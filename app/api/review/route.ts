import { NextResponse } from 'next/server';
import { reviewCode } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { code, language } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid payload: Source code parameter is required.' },
        { status: 400 }
      );
    }

    const review = await reviewCode(code, language || 'javascript');

    return NextResponse.json({ review });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An internal review error occurred inside backend processes.' },
      { status: 500 }
    );
  }
}