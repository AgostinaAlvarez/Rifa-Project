import axios from 'axios';
import {IncomingMessage} from 'http';

import {buildQueryParams} from './functions';

const STRAPI_URL_API = process.env.NEXT_PUBLIC_STRAPI_URL_API;
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

interface RequestOptions {
  api?: 'strapi';
  req?: IncomingMessage;
}

const handleError = (err: any) => {
  let errorResponse: any = {data: null, error: null};
  if (err.response) {
    // Server responded with a status other than 200 range
    errorResponse.error = {
      message: err.response.data.error?.message || 'An error occurred on the server',
      status: err.response.status,
    };
  } else if (err.request) {
    // Request was made but no response received
    errorResponse.error = {
      message: 'No response from server',
      status: 'Network Error',
    };
  } else {
    // Something else happened while setting up the request
    errorResponse.error = {
      message: err.message,
      status: 'Error',
    };
  }
  return errorResponse;
};

export const apiGet = async (url: string, headers: {accept: string; Authorization: string}) => {
  try {
    const response = await axios.get(url, {
      headers: headers,
    });
    return {data: response.data.data, error: null};
  } catch (err) {
    const response = handleError(err);
    return response;
  }
};

export const apiPost = async (
  url: string,
  data: {cardTokenId?: any; payerEmail?: any; token?: any} | null = null,
  headers: {accept: string; Authorization?: string}
) => {
  try {
    const payload = data ?? {};
    const response = await axios.post(url, payload, {
      headers: headers,
    });
    return {data: response.data?.data ?? response.data, error: null};
  } catch (err) {
    const response = handleError(err);
    return response;
  }
};
export const apiPut = async (
  url: string,
  data: any,
  headers: {accept: string; Authorization?: string}
) => {
  try {
    const response = await axios.put(url, data, {
      headers: headers,
    });
    return {data: response.data.data, error: null};
  } catch (err) {
    const response = handleError(err);
    return response;
  }
};

export const getRequest: any = async (
  url: string,
  params?: Record<string, unknown>,
  options?: RequestOptions
) => {
  const baseUrl = STRAPI_URL_API;
  const token = STRAPI_TOKEN;

  const res = await fetch(`${baseUrl}/${url}?${buildQueryParams(params)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });

  if (res.status >= 500) {
    return {
      status: res.status,
      success: res.status >= 200 && res.status < 300,
      data: null,
    };
  }

  const response = await res.json();

  return {
    status: res.status,
    success: res.status >= 200 && res.status < 300,
    data: response,
  };
};
