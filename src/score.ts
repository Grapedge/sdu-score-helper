import { URLSearchParams } from 'url';
import { FetchWithCookies } from './libs/fetch';

export interface Score {
  courseId: string;
  semester?: string;
  courseName: string;
  courseIndex: number;
  examTime: Date;
  score: string;
  credits: number;
  gradePoint: number;
  level: string;
}

function jsonToScore(json: any): Score {
  const examTime = new Date(0);
  examTime.setFullYear(parseInt(json.kssj.substr(0, 4), 10));
  examTime.setMonth(parseInt(json.kssj.substr(4, 2), 10) - 1);
  examTime.setDate(parseInt(json.kssj.substr(6, 2), 10));
  return {
    courseId: json.kch,
    courseIndex: json.kxh,
    semester: json.xnxq,
    courseName: json.kcm,
    credits: json.xf,
    examTime,
    level: json.wfzdj,
    score: json.kscjView,
    gradePoint: json.wfzjd,
  };
}

export async function getAllScores(fetch: FetchWithCookies): Promise<Score[]> {
  const jsons = await fetch('http://bkjws.sdu.edu.cn/b/cj/cjcx/xs/list', {
    method: 'POST',
    body: new URLSearchParams({
      aoData: JSON.stringify([
        { name: 'sEcho', value: 3 },
        { name: 'iColumns', value: 10 },
        { name: 'sColumns', value: '' },
        { name: 'iDisplayStart', value: 0 },
        { name: 'iDisplayLength', value: -1 },
        { name: 'mDataProp_0', value: 'function' },
        { name: 'mDataProp_1', value: 'kch' },
        { name: 'mDataProp_2', value: 'kcm' },
        { name: 'mDataProp_3', value: 'kxh' },
        { name: 'mDataProp_4', value: 'xf' },
        { name: 'mDataProp_5', value: 'kssj' },
        { name: 'mDataProp_6', value: 'kscjView' },
        { name: 'mDataProp_7', value: 'wfzjd' },
        { name: 'mDataProp_8', value: 'wfzdj' },
        { name: 'mDataProp_9', value: 'kcsx' },
        { name: 'iSortingCols', value: 0 },
        { name: 'bSortable_0', value: false },
        { name: 'bSortable_1', value: false },
        { name: 'bSortable_2', value: false },
        { name: 'bSortable_3', value: false },
        { name: 'bSortable_4', value: false },
        { name: 'bSortable_5', value: false },
        { name: 'bSortable_6', value: false },
        { name: 'bSortable_7', value: false },
        { name: 'bSortable_8', value: false },
        { name: 'bSortable_9', value: false },
      ]),
    }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      if (data.result !== 'success') {
        throw new Error('出错啦');
      }
      return data.object.aaData as any[];
    });

  return jsons.map(jsonToScore);
}
