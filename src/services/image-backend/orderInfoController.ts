// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** deleteOrderInfo POST /api/order/delete */
export async function deleteOrderInfoUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/order/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteBatchOrderInfo POST /api/order/deleteBatch */
export async function deleteBatchOrderInfoUsingPost(
  body: API.DeleteBatchRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/order/deleteBatch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getOrderInfoById GET /api/order/get */
export async function getOrderInfoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getOrderInfoByIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseOrderInfo>('/api/order/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listOrderInfo GET /api/order/list */
export async function listOrderInfoUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listOrderInfoUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListOrderInfo>('/api/order/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listOrderInfoByPage GET /api/order/list/page */
export async function listOrderInfoByPageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listOrderInfoByPageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageOrderInfo>('/api/order/list/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listOrderInfoByUserId GET /api/order/listByUserId */
export async function listOrderInfoByUserIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listOrderInfoByUserIdUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseListOrderInfo>('/api/order/listByUserId', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** updateOrderInfo POST /api/order/update */
export async function updateOrderInfoUsingPost(
  body: API.OrderInfoUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseboolean>('/api/order/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
