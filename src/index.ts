import { createFetchWithCookies } from './libs/fetch';
import { CookieJar } from 'tough-cookie';
import yamljs from 'yamljs';
import { sduAuth } from './auth';
import { getAllScores } from './score';
import path from 'path';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { delay } from './libs/delay';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { ScoreMailOptions, sendScoreMail } from './send-score-mail';

type AppOptions = {
  casId: string;
  password: string;
  interval: number;
  smtp: SMTPTransport.Options;
  mail: ScoreMailOptions;
};

async function createAuthFetch(
  service: string,
  casId: string,
  password: string
) {
  const cookieJar = new CookieJar();
  const fetch = createFetchWithCookies(cookieJar);
  await sduAuth(fetch, service, casId, password);
  return fetch;
}

async function main() {
  const options: AppOptions = yamljs.load(
    path.resolve(__dirname, '..', 'config.yaml')
  );

  // 已发布成绩的课程 ID
  let postedCourses: string[] = [];
  const postedJsonPath = path.resolve(__dirname, '..', 'posted.json');
  if (existsSync(postedJsonPath)) {
    postedCourses = JSON.parse(
      readFileSync(path.resolve(__dirname, '..', 'posted.json')).toString()
    );
  }

  while (true) {
    try {
      // 登录系统
      const fetch = await createAuthFetch(
        'http://bkjws.sdu.edu.cn/f/j_spring_security_thauth_roaming_entry',
        options.casId,
        options.password
      );

      await delay(1000);

      console.log('登录成功，脚本运行中...');
      // 轮询获取数据
      while (true) {
        const scores = await getAllScores(fetch);
        // 成绩有变动
        if (scores.length !== postedCourses.length) {
          const changes = scores.filter(
            (score) => !postedCourses.includes(score.courseId)
          );
          await Promise.all(
            changes.map((score) =>
              sendScoreMail(options.smtp, options.mail, score)
            )
          );
          postedCourses = scores.map((score) => score.courseId);
          writeFileSync(postedJsonPath, JSON.stringify(postedCourses));
          console.log('成绩发送完毕，脚本继续运行...');
        }
        await delay(options.interval);
      }
    } catch (error) {
      console.log(error);
      console.log('查询出错，将于十秒后重试...');
      await delay(10000);
    }
  }
}

main();
