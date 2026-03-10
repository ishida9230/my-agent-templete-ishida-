/**
 * Chatwork APIクライアント
 *
 * テンプレートの lib/line/client.ts パターンを踏襲。
 * Chatwork REST API v2 に対してHTTPS通信を行う。
 * 参考: https://developer.chatwork.com/reference
 */

import type {
  ChatworkMessage,
  ChatworkMyInfo,
  ChatworkResult,
  ChatworkRoom,
} from "./types";

const CHATWORK_API_BASE = "https://api.chatwork.com/v2";

export class ChatworkClient {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  // ===== ファクトリメソッド =====

  /**
   * 環境変数からクライアントを生成
   */
  static fromEnv(): ChatworkClient {
    const token = process.env.CHATWORK_API_TOKEN;
    if (!token) {
      throw new Error("CHATWORK_API_TOKEN が設定されていません");
    }
    return new ChatworkClient(token);
  }

  // ===== 内部通信 =====

  private async request<T>(
    path: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE";
      body?: Record<string, string | number>;
      query?: Record<string, string | number>;
    } = {}
  ): Promise<ChatworkResult<T>> {
    const { method = "GET", body, query } = options;

    const url = new URL(`${CHATWORK_API_BASE}${path}`);
    if (query) {
      Object.entries(query).forEach(([k, v]) =>
        url.searchParams.append(k, String(v))
      );
    }

    const fetchOptions: RequestInit = {
      method,
      headers: {
        "X-ChatWorkToken": this.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    if (body && method !== "GET") {
      const params = new URLSearchParams();
      Object.entries(body).forEach(([k, v]) => params.append(k, String(v)));
      fetchOptions.body = params;
    }

    try {
      const res = await fetch(url.toString(), fetchOptions);
      const text = await res.text();

      if (!res.ok) {
        return {
          success: false,
          error: `APIエラー [${res.status}]: ${text}`,
          status: res.status,
        };
      }

      const data = JSON.parse(text) as T;
      return { success: true, data };
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : "不明なエラー",
      };
    }
  }

  // ===== 自分の情報 =====

  /**
   * 自分自身のアカウント情報を取得
   */
  async getMe(): Promise<ChatworkResult<ChatworkMyInfo>> {
    return this.request<ChatworkMyInfo>("/me");
  }

  // ===== ルーム（チャット） =====

  /**
   * 参加しているチャット一覧を取得
   */
  async listRooms(): Promise<ChatworkResult<ChatworkRoom[]>> {
    return this.request<ChatworkRoom[]>("/rooms");
  }

  /**
   * ルーム名からルームを検索
   */
  async findRoomByName(
    name: string
  ): Promise<ChatworkResult<ChatworkRoom | null>> {
    const result = await this.listRooms();
    if (!result.success) return result;

    const room = result.data.find((r) => r.name === name) ?? null;
    return { success: true, data: room };
  }

  // ===== メッセージ =====

  /**
   * チャットのメッセージ一覧を取得（最大100件）
   * @param roomId ルームID
   * @param force  trueの場合、既読・未読に関わらず最新100件を取得
   */
  async listMessages(
    roomId: number,
    force = true
  ): Promise<ChatworkResult<ChatworkMessage[]>> {
    return this.request<ChatworkMessage[]>(`/rooms/${roomId}/messages`, {
      query: { force: force ? 1 : 0 },
    });
  }

  /**
   * ルーム名を指定してメッセージ一覧を取得
   * ルームが見つからない場合はエラーを返す
   */
  async listMessagesByRoomName(
    roomName: string,
    force = true
  ): Promise<ChatworkResult<ChatworkMessage[]>> {
    const roomResult = await this.findRoomByName(roomName);
    if (!roomResult.success) return roomResult;
    if (!roomResult.data) {
      return { success: false, error: `ルーム "${roomName}" が見つかりません` };
    }
    return this.listMessages(roomResult.data.room_id, force);
  }

  /**
   * チャットにメッセージを送信
   * @param roomId ルームID
   * @param text   送信するメッセージ本文
   */
  async postMessage(
    roomId: number,
    text: string
  ): Promise<ChatworkResult<{ message_id: string }>> {
    return this.request<{ message_id: string }>(
      `/rooms/${roomId}/messages`,
      {
        method: "POST",
        body: { body: text },
      }
    );
  }
}

/**
 * デフォルトのChatworkクライアントインスタンスを返す（環境変数から生成）
 * Server Actionsや lib からインポートして使用する
 */
export function chatworkClient(): ChatworkClient {
  return ChatworkClient.fromEnv();
}
