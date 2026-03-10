// Chatwork API レスポンス型定義
// 参考: https://developer.chatwork.com/reference

export type ChatworkRoom = {
  room_id: number;
  name: string;
  type: "my" | "direct" | "group";
  role: "admin" | "member" | "readonly";
  sticky: boolean;
  unread_num: number;
  mention_num: number;
  mytask_num: number;
  message_num: number;
  file_num: number;
  task_num: number;
  icon_path: string;
  last_update_time: number;
};

export type ChatworkMessage = {
  message_id: string;
  account: {
    account_id: number;
    name: string;
    avatar_image_url: string;
  };
  body: string;
  send_time: number;
  update_time: number;
};

export type ChatworkMyInfo = {
  account_id: number;
  room_id: number;
  name: string;
  chatwork_id: string;
  organization_id: number;
  organization_name: string;
  department: string;
  title: string;
  url: string;
  introduction: string;
  mail: string;
  tel_organization: string;
  tel_extension: string;
  tel_mobile: string;
  skype: string;
  facebook: string;
  twitter: string;
  avatar_image_url: string;
  login_mail: string;
};

export type ChatworkResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; status?: number };
