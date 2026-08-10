import { getData } from "@/lib/server/storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return NextResponse.json(await getData("team_info"));
}