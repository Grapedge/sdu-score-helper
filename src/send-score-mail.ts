import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Score } from './score';

export type ScoreMailOptions = {
  from: string;
  to: string;
};

const createHtml = (score: Score) => `
<h3>【${score.courseName}】成绩发布</h3>
<table>
  <tr>
    <td>
      课程名
    </td>
    <td>
      ${score.courseName}
    </td>
  </tr>
  <tr>
    <td>
      考试时间
    </td>
    <td>
      ${score.examTime.toLocaleString()}
    </td>
  </tr>
  <tr>
    <td>
      绩点
    </td>
    <td>
      ${score.gradePoint}
    </td>
  </tr>
  <tr>
    <td>
      学分
    </td>
    <td>
      ${score.credits}
    </td>
  </tr>
  <tr>
    <td>
      考试成绩
    </td>
    <td>
      ${score.score}
    </td>
  </tr>
  <tr>
    <td>
      成绩等级
    </td>
    <td>
      ${score.level}
    </td>
  </tr>
  <tr>
    <td>
      发布时间
    </td>
    <td>
      ${new Date().toLocaleString()}
    </td>
  </tr>
</table>
`;

export async function sendScoreMail(
  smtp: SMTPTransport.Options,
  mail: ScoreMailOptions,
  score: Score
) {
  console.log(`[${score.courseName}]成绩已出，开始发送邮件提醒`);
  const transporter = nodemailer.createTransport(smtp);
  await transporter.sendMail({
    from: mail.from,
    to: mail.to,
    subject: '成绩查询小助手',
    html: createHtml(score),
  });
  console.log(`[${score.courseName}]成绩发送完毕`);
}
