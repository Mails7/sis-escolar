import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request: messages array is required" }, { status: 400 })
    }

    // Prepare the conversation for the AI model
    const conversation = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Add system message to guide the AI's behavior
    conversation.unshift({
      role: "system",
      content: `You are an AI assistant for teachers. 
      Your purpose is to help with lesson planning, creating educational content, 
      providing teaching strategies, and answering questions about education.
      If the user writes in Portuguese, respond in Portuguese. 
      If the user writes in English, respond in English.
      Be helpful, concise, and educational in your responses.`,
    })

    // Call the Grok API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: conversation,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Grok API error:", error)
      return NextResponse.json({ error: "Failed to get response from AI service" }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Error in AI chat route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
