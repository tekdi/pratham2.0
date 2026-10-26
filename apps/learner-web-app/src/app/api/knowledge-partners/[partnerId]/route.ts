import { NextRequest, NextResponse } from 'next/server';
import { findKnowledgePartnerById } from '../knowledgePartnersData';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { partnerId: string } }
) {
  try {
    const partner = findKnowledgePartnerById(params?.partnerId);
    if (!partner) {
      return NextResponse.json(
        { error: 'Knowledge partner not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ result: partner }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching knowledge partner:', error);
    return NextResponse.json(
      { error: error?.message || 'Unable to fetch knowledge partner' },
      { status: 500 }
    );
  }
}
