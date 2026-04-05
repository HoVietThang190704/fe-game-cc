import { Endpoint } from "../shared/constants/endpoint";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

type BaseResponse<T> = {
  response: number;
  message: string;
  success: boolean;
  data?: T | null;
};

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export type BoardSize = "small" | "medium" | "large";

export type FindMatchResponse = {
  _id: string;
  userId: string;
  boardSize: BoardSize;
  status: "waiting" | "matched" | "cancelled";
  createdAt: string;
  matchedAt?: string;
};

export async function findMatch(boardSize: BoardSize = "medium") {
  const res = await fetch(`${BASE_URL}${Endpoint.MATCH_FIND}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ boardSize }),
  });

  const body = (await res.json()) as BaseResponse<FindMatchResponse>;
  if (!res.ok || !body.success) {
    throw new Error(body.message || `Find match failed: ${res.status}`);
  }

  return body.data!;
}

export async function cancelMatch() {
  const res = await fetch(`${BASE_URL}${Endpoint.MATCH_CANCEL}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const body = (await res.json()) as BaseResponse<FindMatchResponse | null>;
  if (!res.ok) {
    throw new Error(body.message || `Cancel match failed: ${res.status}`);
  }

  return body;
}

export type CreatePrivateMatchResponse = {
  matchId: string | null;
  pinCode: string;
};

export async function joinPrivateMatch(
  pinCode: string,
  accessToken: string,
): Promise<CreatePrivateMatchResponse> {
  const res = await fetch(`${BASE_URL}${Endpoint.MATCH_JOIN}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ pinCode }),
  });

  const body = (await res.json()) as BaseResponse<CreatePrivateMatchResponse>;
  if (!res.ok || !body.success || !body.data) {
    throw new Error(body.message || `Join match failed: ${res.status}`);
  }

  return body.data;
}
