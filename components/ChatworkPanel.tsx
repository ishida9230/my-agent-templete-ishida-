"use client";

import { useState } from "react";
import {
  fetchChatworkMessages,
  fetchChatworkRooms,
} from "@/app/chatwork/actions";
import type { ChatworkMessage, ChatworkRoom } from "@/lib/chatwork/types";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "selectRoom"; rooms: ChatworkRoom[] }
  | { status: "messages"; messages: ChatworkMessage[]; roomName: string }
  | { status: "error"; error: string };

function formatTime(unixSec: number): string {
  const d = new Date(unixSec * 1000);
  return d.toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatworkPanel({
  defaultRoomName,
}: {
  defaultRoomName?: string;
}) {
  const [state, setState] = useState<State>({ status: "idle" });

  // ルーム名が指定されていれば直接取得、なければルーム一覧を取得
  async function handleFetch() {
    setState({ status: "loading" });

    if (defaultRoomName) {
      const result = await fetchChatworkMessages(defaultRoomName);
      if (result.success) {
        setState({ status: "messages", messages: result.messages, roomName: result.roomName });
      } else {
        setState({ status: "error", error: result.error });
      }
    } else {
      const result = await fetchChatworkRooms();
      if (result.success) {
        setState({ status: "selectRoom", rooms: result.rooms });
      } else {
        setState({ status: "error", error: result.error });
      }
    }
  }

  async function handleSelectRoom(room: ChatworkRoom) {
    setState({ status: "loading" });
    const result = await fetchChatworkMessages(room.name);
    if (result.success) {
      setState({ status: "messages", messages: result.messages, roomName: result.roomName });
    } else {
      setState({ status: "error", error: result.error });
    }
  }

  return (
    <div className="mt-10 border border-gray-200 rounded-lg overflow-hidden">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Chatwork</span>
          {state.status === "messages" && (
            <span className="text-xs text-gray-500">
              {state.roomName} · {state.messages.length}件
            </span>
          )}
        </div>
        <button
          onClick={handleFetch}
          disabled={state.status === "loading"}
          className="text-xs px-3 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
        >
          {state.status === "loading"
            ? "取得中..."
            : state.status === "messages"
            ? "再取得"
            : "メッセージを取得"}
        </button>
      </div>

      {/* コンテンツ */}
      <div className="bg-white">
        {state.status === "idle" && (
          <p className="px-4 py-6 text-sm text-gray-400 text-center">
            「メッセージを取得」をクリックしてChatworkの会話を読み込みます
          </p>
        )}

        {state.status === "loading" && (
          <p className="px-4 py-6 text-sm text-gray-400 text-center">読み込み中...</p>
        )}

        {state.status === "error" && (
          <p className="px-4 py-6 text-sm text-red-500 text-center">
            エラー: {state.error}
          </p>
        )}

        {/* ルーム選択 */}
        {state.status === "selectRoom" && (
          <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
            {state.rooms.map((room) => (
              <li key={room.room_id}>
                <button
                  onClick={() => handleSelectRoom(room)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-800">{room.name}</span>
                  {room.unread_num > 0 && (
                    <span className="ml-2 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">
                      {room.unread_num}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* メッセージ一覧 */}
        {state.status === "messages" && (
          <ul className="divide-y divide-gray-100 max-h-[480px] overflow-y-auto">
            {state.messages.length === 0 && (
              <li className="px-4 py-6 text-sm text-gray-400 text-center">
                メッセージがありません
              </li>
            )}
            {state.messages.map((msg) => (
              <li key={msg.message_id} className="px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    {msg.account.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTime(msg.send_time)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {msg.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
