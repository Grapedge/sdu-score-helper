import fetch, { Headers, RequestInfo, RequestInit } from 'node-fetch';
import { CookieJar } from 'tough-cookie';

export function createFetchWithCookies(cookieJar: CookieJar) {
  const fetchWithCookie = async (url: RequestInfo, init?: RequestInit) => {
    const info = url as any;
    const currentUrl = info.url || info.href || info;
    const currentCookie = cookieJar.getCookieStringSync(currentUrl);
    if (currentCookie) {
      if (!init) init = {};
      init.headers = new Headers(init.headers);
      init.headers.set('cookie', currentCookie);
    }
    const response = await fetch(url, init);
    const cookies = response.headers.raw()['set-cookie'];
    if (cookies) {
      cookies.forEach((cookie) => {
        cookieJar.setCookieSync(cookie, response.url);
      });
    }
    return response;
  };
  return fetchWithCookie;
}

export type FetchWithCookies = ReturnType<typeof createFetchWithCookies>;
