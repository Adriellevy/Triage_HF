import OpenAI from 'openai'

// Replace 'your_actual_api_key' with your OpenAI API key
const apiKey = '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'

const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
export async function consulta(Content: string, Model = null) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: Content }],
    model: Model || 'gpt-3.5-turbo'
  })

  return completion.choices[0]
  //console.log(completion.choices[0])
}
