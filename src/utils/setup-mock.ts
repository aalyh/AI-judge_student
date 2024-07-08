import { HttpResponse } from '@/api/interceptor';
import debug from './env';

export default ({ mock, setup }: { mock?: boolean; setup: () => void }) => {
  if (mock !== false && debug) setup();
};

export const successResponseWrap = (data: unknown) => {
  return {
    data,
    success: true,
    message: '请求成功',
    code: 200,
  } satisfies HttpResponse;
};

export const failResponseWrap = (data: unknown, message: string, code = 50000) => {
  return {
    data,
    success: false,
    message,
    code,
  } satisfies HttpResponse;
};
