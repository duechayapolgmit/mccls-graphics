import { getData } from "@/lib/server/dataImport";
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
    return NextResponse.json(getData("team_info"));
}