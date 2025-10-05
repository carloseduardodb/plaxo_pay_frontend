import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3010/api",
  });
}
