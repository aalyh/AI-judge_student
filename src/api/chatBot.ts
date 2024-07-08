import request from '@/utils/request';

const schema = 'chat';

const enum ChatBotApi {
  chat = `${schema}/exam/chat`,
}

export interface BotChatResponse {
  status: number;
  content: string;
}

/**
 * 考试详情页, 获取chat聊天返回数据
 * @param data
 * @returns
 */
export const getChatResponse = (data: { examId: number; content: string; userId: number }) => {
  return request.post<BotChatResponse>(ChatBotApi.chat, data);
};
