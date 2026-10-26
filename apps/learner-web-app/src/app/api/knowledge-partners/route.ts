import { NextResponse } from 'next/server';
import { knowledgePartners } from './knowledgePartnersData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ result: knowledgePartners }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching knowledge partners:', error);
    return NextResponse.json(
      { error: error?.message || 'Unable to fetch knowledge partners' },
      { status: 500 }
    );
  }
}
