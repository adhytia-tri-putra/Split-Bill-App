import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    return NextResponse.json({
      success: true,
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request",
      },
      { status: 400 },
    );
  }
}
