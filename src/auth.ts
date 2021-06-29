import { desEnc } from './libs/des-enc';
import { FetchWithCookies } from './libs/fetch';

const LOGIN_URL = 'http://pass.sdu.edu.cn/cas/login';

export async function sduAuth(
  fetch: FetchWithCookies,
  service: string,
  casId: string,
  password: string
) {
  const loginUrl = new URL(LOGIN_URL);
  loginUrl.search = new URLSearchParams({
    service,
  }).toString();

  const loginHtml = await fetch(loginUrl, {
    method: 'GET',
  }).then((resp) => resp.text());

  const ltMatch = /name="lt".*value="(.*)"/.exec(loginHtml);
  if (!ltMatch) {
    throw new Error('无效的 LT');
  }
  const lt = ltMatch[1];

  await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      rsa: desEnc(`${casId}${password}${lt}`, '1', '2', '3'),
      ul: casId.length.toString(),
      pl: password.length.toString(),
      lt,
      execution: 'e1s1',
      _eventId: 'submit',
    }),
    redirect: 'manual',
  })
    .then((resp) => {
      if (resp.status < 300 || resp.status >= 400) {
        throw new Error('登录失败');
      }
      return resp;
    })
    .then((resp) => fetch(resp.headers.get('location'), { redirect: 'manual' }))
    .then((resp) => fetch(resp.headers.get('location'), { redirect: 'manual' }))
    .then((resp) => fetch(resp.headers.get('location')));
}
