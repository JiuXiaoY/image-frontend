// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** payNotify POST /api/Alipay/notify */
export async function payNotifyUsingPost(options?: { [key: string]: any }) {
  return request<string>('/api/Alipay/notify', {
    method: 'POST',
    ...(options || {}),
  });
}

/** getPay POST /api/Alipay/pay */
export async function getPayUsingPost(
  body: API.OrderInfoAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsestring>('/api/Alipay/pay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
