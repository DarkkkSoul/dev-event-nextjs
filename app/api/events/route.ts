import { Event } from "@/database/event.model";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        await connectToDatabase();

        const body = await req.json();

        const newEvent = await Event.create(body);

        return NextResponse.json({
            message: "Event created successfully",
            event: newEvent
        }, { status: 201 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Event creation failed",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 })
    }
}