import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Session terminated successfully.',
  });

  // Clear HTTP cookie
  response.cookies.delete('aurabots_access_token');
  return response;
}
