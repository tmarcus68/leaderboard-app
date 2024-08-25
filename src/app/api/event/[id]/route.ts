// src/app/api/event/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const database = client.db("leaderboard-app");
const eventCollection = database.collection("event");

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

    if (!eventId) {
      return NextResponse.json(
        { status: "error", message: "Event ID is required" },
        { status: 400 }
      );
    }

    // Fetch the event data by ID from MongoDB
    const eventData = await eventCollection.findOne({
      _id: new ObjectId(eventId),
    });

    if (eventData) {
      return NextResponse.json(eventData, {
        headers: {
          "Cache-Control": "no-store",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    } else {
      return NextResponse.json(
        { status: "error", message: "Event not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error handling GET request:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to handle GET request" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { teams } = await request.json();

    // Validate incoming data
    if (
      !Array.isArray(teams) ||
      !teams.every(
        (team) =>
          typeof team.id === "number" &&
          typeof team.rank === "number" &&
          typeof team.country === "string" &&
          typeof team.logo === "string" &&
          typeof team.chineseName === "string" &&
          typeof team.englishName === "string" &&
          typeof team.score === "number" &&
          typeof team.deductedScore === "number"
      )
    ) {
      console.error("Invalid data format:", { teams });
      return NextResponse.json(
        { status: "error", message: "Invalid data format" },
        { status: 400 }
      );
    }

    // Store the event data in MongoDB
    const result = await eventCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { teams } },
      { upsert: true }
    );

    return NextResponse.json(
      {
        status: "success",
        data: { _id: params.id, teams },
      },
      {
        headers: {
          "Cache-Control": "no-store",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error handling POST request:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to handle POST request" },
      { status: 500 }
    );
  }
}
