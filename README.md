# 山东大学成绩查询提醒小助手

## 简介

轮询教务查询成绩，出成绩后发送邮件提醒。

## 使用

克隆仓库，并执行下列命令安装依赖：

```bash
# 需要先安装 Node
$ npm i
# 构建项目
$ npm run build
```

开启 QQ 邮箱 SMTP 功能，获取密钥。

创建配置文件 `config.yaml`，模板如下：

```yaml
casId: '学工号'
password: '密码'
# 查询成绩学期
semester: 2020-2021-2
# 获取成绩时间间隔，下面是30s
interval: 30000
# nodemailer smtp 传输选项
smtp:
  host: smtp.qq.com
  auth:
    user: 你的QQ号@qq.com
    pass: 开启 SMTP 服务后获取的密钥
mail:
  from: '"成绩查询小助手 😆" <你的QQ号@qq.com>'
  # 下面是要接收提醒的邮箱，逗号隔开多个邮箱
  to: '11111@qq.com'
```
