import { createFetchWithCookies } from './libs/fetch';
import { CookieJar } from 'tough-cookie';
import { sduAuth } from './auth';
import { getAllScores } from './score';

async function main() {
  const jar = new CookieJar();
  const fetch = createFetchWithCookies(jar);
  await sduAuth(
    fetch,
    'http://bkjws.sdu.edu.cn/f/j_spring_security_thauth_roaming_entry',
    '222',
    '222'
  );
  const scores = await getAllScores(fetch);
  console.log(scores);
}

main();
