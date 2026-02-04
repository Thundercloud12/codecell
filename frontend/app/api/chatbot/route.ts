import { NextRequest, NextResponse } from "next/server";

const RAG_API_URL = process.env.RAG_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required", success: false },
        { status: 400 }
      );
    }

    const response = await fetch(`${RAG_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("RAG API error:", error);
      return NextResponse.json(
        {
          response:
            "I'm having trouble processing your request right now. Please try again later.",
          success: false,
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      {
        response:
          "Sorry, the chatbot service is currently unavailable. Please try again later.",
        success: false,
      },
      { status: 200 }
    );
  }
}

export async function GET() {
  try {
    const response = await fetch(`${RAG_API_URL}/chat/health`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { status: "unavailable", service: "rag-chatbot" },
      { status: 503 }
    );
  }
}
