"use server";

import { chatworkClient } from "@/lib/chatwork/client";
import type { ChatworkMessage, ChatworkRoom } from "@/lib/chatwork/types";

/**
 * Chatworkのルーム一覧を取得する Server Action
 */
export async function fetchChatworkRooms(): Promise<
  { success: true; rooms: ChatworkRoom[] } | { success: false; error: string }
> {
  const client = chatworkClient();
  const result = await client.listRooms();
  if (!result.success) return result;
  return { success: true, rooms: result.data };
}

/**
 * ルーム名を指定してメッセージ一覧を取得する Server Action
 */
export async function fetchChatworkMessages(roomName: string): Promise<
  | { success: true; messages: ChatworkMessage[]; roomName: string }
  | { success: false; error: string }
> {
  const client = chatworkClient();
  const result = await client.listMessagesByRoomName(roomName);
  if (!result.success) return result;
  return { success: true, messages: result.data, roomName };
}
