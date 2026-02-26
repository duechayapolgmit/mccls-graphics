import { NextResponse, type NextRequest } from "next/server";
import { getData } from '@/lib/voting/votingInfo'

export function GET(request: NextRequest) {

    return NextResponse.json(getData());
}