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
  semester: string;
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
    // 登录系统
    const fetch = await createAuthFetch(
      'http://bkjws.sdu.edu.cn/f/j_spring_security_thauth_roaming_entry',
      options.casId,
      options.password
    );
    await delay(1000);

    // 轮询获取数据
    try {
      while (true) {
        const scores = await getAllScores(fetch);
        // 获取本学期的课程
        const currentScores = scores.filter(
          (score) => score.semester === options.semester
        );
        // 成绩有变动
        if (currentScores.length !== postedCourses.length) {
          const changes = currentScores.filter(
            (score) => !postedCourses.includes(score.courseId)
          );
          await Promise.all(
            changes.map((score) =>
              sendScoreMail(options.smtp, options.mail, score)
            )
          );
          postedCourses = currentScores.map((score) => score.courseId);
          writeFileSync(postedJsonPath, JSON.stringify(postedCourses));
        }
        await delay(options.interval);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

main();
