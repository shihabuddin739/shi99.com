import crypto from 'crypto';

const TOKEN = "3bef1fecabdcdd5896edd9e1febf56dc";
const SECRET = "6ec179b179fc1e4dca307f26ea88dfd3";
const SERVER_URL = "https://767fafapi.live/api/v1";

export function encryptPayload(data: Record<string, unknown>): string {
  if (SECRET.length !== 32) {
    throw new Error("Secret key must be exactly 32 characters");
  }
  const json = JSON.stringify(data);
  const cipher = crypto.createCipheriv('aes-256-ecb', Buffer.from(SECRET), null);
  let encrypted = cipher.update(json, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

export async function launchGame(payload: {
  user_id: string;
  balance: number;
  game_uid: string;
  return: string;
  callback: string;
  currency_code?: string;
  language?: string;
  is_demo?: number;
}) {
  const fullPayload = {
    ...payload,
    token: TOKEN,
    timestamp: Date.now(),
  };

  const encrypted = encryptPayload(fullPayload);
  const url = `${SERVER_URL}?payload=${encodeURIComponent(encrypted)}&token=${encodeURIComponent(TOKEN)}`;

  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export const SOFTAPI_CONFIG = {
  TOKEN,
  SECRET,
  SERVER_URL,
};
