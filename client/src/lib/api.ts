import { API_BASE, getFetchOptions } from "./constants";
import type {
  GameId,
  LeaderboardResponse,
  SubmitProgressPayload,
  SubmitProgressResponse,
} from "../types";
import type { GameResponseMap } from "../types";
import { GuessMasterAskRequest, GuessMasterAskResponse } from "@/types/gamesTypes/GuessMaster";

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message || res.statusText);
  }
  return json ? json : ({} as T);
}

export async function fetchGameData<T extends GameId>(
  gameId: T
): Promise<GameResponseMap[T]> {
  const res = await fetch(`${API_BASE}/GeneralGame/${gameId}/data`, {
    ...getFetchOptions(),
  });
  return handleResponse<GameResponseMap[T]>(res);
}

export async function fetchLeaderboard(
  gameId: GameId
): Promise<LeaderboardResponse> {
  const res = await fetch(`${API_BASE}/GeneralGame/${gameId}/leaderboard`, {
    ...getFetchOptions(),
  });
  return handleResponse<LeaderboardResponse>(res);
}

export async function submitProgress(
  payload: SubmitProgressPayload
): Promise<SubmitProgressResponse> {
  const res = await fetch(`${API_BASE}/GeneralGame/${payload.gameID}/progress`, {
    method: "POST",
    ...getFetchOptions(),
    body: JSON.stringify(payload),
  });
  return handleResponse<SubmitProgressResponse>(res);
}

export async function postGuessMasterTurn(
  gameId: GameId,
  body: GuessMasterAskRequest
): Promise<GuessMasterAskResponse> {
  const res = await fetch(`${API_BASE}/${gameId}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("failed to submit GM20 turn");
  return await res.json();
}


  export async function fetchPlatformGames() {
    const res = await fetch(`${API_BASE}/Game/GetAll`, {
      headers: { "Content-Type": "application/json" }
    });
    const result = await res.json();
    console.log("Fetched platform games:", result);
    if (!res.ok) throw new Error(
      `Failed to fetch games ${result?.message || result.statusText}`
    );
    return result.data;

  }