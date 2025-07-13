import { NextResponse } from 'next/server';
import { generateSmartReminder } from '@/ai/flows/smart-reminders';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await generateSmartReminder(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[SMART_REMINDER_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
