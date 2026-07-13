import { getData } from "@/lib/server/storage";
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
    return NextResponse.json(getData("break_screens"));
}