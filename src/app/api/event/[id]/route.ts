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

    // Calculate the rank based on scores and deducted scores
    const teamsWithTotalScore = teams.map((team) => ({
      ...team,
      totalScore: team.score - team.deductedScore,
    }));

    console.log("teamsWithTotalScore: ", teamsWithTotalScore);

    // Sort teams according to the criteria
    const sortedTeams = teamsWithTotalScore
      .filter((team) => team.totalScore > 0) // Consider only teams with a positive totalScore
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // Sort by score descending
        } else if (b.deductedScore !== a.deductedScore) {
          return a.deductedScore - b.deductedScore; // Sort by deductedScore ascending
        } else {
          return a.id - b.id; // Sort by id ascending
        }
      });

    console.log("sortedTeams: ", sortedTeams);

    // Update ranks
    const updatedTeams = teams.map((team) => {
      const index = sortedTeams.findIndex(
        (sortedTeam) => sortedTeam.id === team.id
      );
      return index !== -1
        ? { ...team, rank: index + 1 } // Update rank based on sorted order
        : { ...team, rank: 0 }; // Teams with no score get rank 0
    });

    console.log("updatedTeams: ", updatedTeams);

    // Prepare final data by excluding `totalScore` from the result
    const finalTeams = updatedTeams.map(({ totalScore, ...team }) => team);

    console.log("finalTeams: ", finalTeams);

    // Store the event data in MongoDB
    const result = await eventCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { teams: finalTeams } },
      { upsert: true }
    );

    return NextResponse.json(
      {
        status: "success",
        data: { _id: params.id, teams: finalTeams },
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
