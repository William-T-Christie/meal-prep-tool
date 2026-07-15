import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod/v4'

const globalForAnthropic = globalThis as unknown as {
  anthropic: Anthropic | undefined
}

function getClient(): Anthropic {
  if (!process.env.AI_API_KEY) {
    throw new AiGenerationError('AI_API_KEY environment variable is not set', 'API_ERROR')
  }
  if (!globalForAnthropic.anthropic) {
    globalForAnthropic.anthropic = new Anthropic({ apiKey: process.env.AI_API_KEY })
  }
  return globalForAnthropic.anthropic
}

export class AiGenerationError extends Error {
  code: 'API_ERROR' | 'VALIDATION_ERROR' | 'RETRY_FAILED'

  constructor(message: string, code: 'API_ERROR' | 'VALIDATION_ERROR' | 'RETRY_FAILED') {
    super(message)
    this.name = 'AiGenerationError'
    this.code = code
  }
}

interface GenerateOptions<T> {
  systemPrompt: string
  userPrompt: string
  schema: z.ZodType<T>
  toolName: string
  toolDescription: string
  maxTokens?: number
}

interface GenerateResult<T> {
  data: T
  usage: { inputTokens: number; outputTokens: number }
}

/**
 * Call Claude API with tool_use for structured JSON output.
 * Validates response with Zod. Retries once on validation failure.
 */
export async function generateStructuredOutput<T>(
  options: GenerateOptions<T>
): Promise<GenerateResult<T>> {
  const client = getClient()
  const { systemPrompt, userPrompt, schema, toolName, toolDescription, maxTokens = 16000 } = options

  const jsonSchema = z.toJSONSchema(schema)

  const tool: Anthropic.Tool = {
    name: toolName,
    description: toolDescription,
    input_schema: jsonSchema as Anthropic.Tool.InputSchema,
  }

  // First attempt
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    tools: [tool],
    tool_choice: { type: 'tool', name: toolName },
  })

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
  )

  if (!toolUse) {
    throw new AiGenerationError('AI did not return structured output', 'API_ERROR')
  }

  const parsed = schema.safeParse(toolUse.input)

  if (parsed.success) {
    return {
      data: parsed.data,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    }
  }

  // Retry once with validation error feedback
  console.warn('[AI] First attempt validation failed, retrying with correction prompt')

  const errorDetails = JSON.stringify(parsed.error, null, 2)
  const retryResponse = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userPrompt },
      { role: 'assistant', content: response.content },
      {
        role: 'user',
        content: `The output had validation errors. Please fix and try again:\n${errorDetails}`,
      },
    ],
    tools: [tool],
    tool_choice: { type: 'tool', name: toolName },
  })

  const retryToolUse = retryResponse.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use'
  )

  if (!retryToolUse) {
    throw new AiGenerationError('AI retry did not return structured output', 'RETRY_FAILED')
  }

  const retryParsed = schema.safeParse(retryToolUse.input)

  if (retryParsed.success) {
    return {
      data: retryParsed.data,
      usage: {
        inputTokens: response.usage.input_tokens + retryResponse.usage.input_tokens,
        outputTokens: response.usage.output_tokens + retryResponse.usage.output_tokens,
      },
    }
  }

  throw new AiGenerationError(
    `AI output failed validation after retry: ${JSON.stringify(retryParsed.error)}`,
    'RETRY_FAILED'
  )
}
