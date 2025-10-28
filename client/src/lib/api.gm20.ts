// src/lib/api.gm20.ts
import type {
  GuessMasterData,
  GuessMasterAskRequest,
  GuessMasterAskResponse,
} from "@/types/gamesTypes/GuessMaster";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5075";
const GAME_ID = 14;

const URLS = {
  data: `${BASE}/api/v1/GeneralGame/${GAME_ID}/data`,
  leaderboard: `${BASE}/api/v1/GeneralGame/${GAME_ID}/leaderboard`,
  progress: `${BASE}/api/v1/GeneralGame/${GAME_ID}/progress`,
  ask: `${BASE}/api/v1/games/guessmaster-20/ask`,
};

console.log("[GM20] URLs:", URLS);

export async function postGuessMaster20RefreshSuggestions(
  sessionId: string,
  exclude: string[]
): Promise<string[]> {
  const res = await fetch(
    `${BASE}/api/v1/games/guessmaster-20/suggestions/refresh`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, exclude }),
    }
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Refresh failed (${res.status}): ${text}`);
  }
  const data = (await res.json()) as {
    sessionId: string;
    suggestedQuestions: string[];
  };
  return data.suggestedQuestions ?? [];
}

function unwrap<T>(json: any): T {
  return (json?.data?.data ?? json?.data ?? json) as T;
}

async function getJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { headers: { accept: "application/json" }, ...init });
  if (!res.ok) throw new Error(`${init?.method ?? "GET"} ${url} failed: ${res.status}`);
  const j = await res.json();
  return unwrap<T>(j);
}

export async function getGuessMaster20Data(): Promise<GuessMasterData> {
  const d = await getJSON<GuessMasterData>(URLS.data);
  console.log("[GM20] /data ->", d);
  return d;
}

export async function postGuessMaster20Ask(body: GuessMasterAskRequest): Promise<GuessMasterAskResponse> {
  const d = await getJSON<GuessMasterAskResponse>(URLS.ask, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
  });
  console.log("[GM20] /ask ->", d);
  return d;
}

export type LeaderboardRow = { rank: number; playerName: string; score: number; time: string | number };

export async function getGuessMaster20Leaderboard(): Promise<{ leaderboard: LeaderboardRow[] }> {
  return getJSON(URLS.leaderboard);
}

export type ProgressPayload = {
  sessionId: string;
  playerName: string;
  score: number;
  timeMs: number;
  won: boolean;
};

export async function postGuessMaster20Progress(payload: ProgressPayload): Promise<{ status: string; newRank?: number }> {
  return getJSON(URLS.progress, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(payload),
  });
}
