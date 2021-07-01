# 山东大学成绩查询提醒小助手

## 简介

轮询教务查询成绩，出成绩后发送邮件提醒。

## 安装

首先首要安装 Node JS：[NodeJS 中文网](http://nodejs.cn/)  
然后打开终端，执行以下命令：

```bash
# 克隆代码仓库
$ git clone git@github.com:Grapedge/sdu-score-helper.git
# 进入工作目录
$ cd sdu-score-helper
# 安装项目需要的依赖
$ npm install
# 构建项目
$ npm run build
```

更新脚本：
```bash
# 拉取最新代码
$ git pull
# 构建项目
$ npm run build
```

## 使用

### 开启 QQ 邮箱 SMTP 服务

参考链接：[如何打开POP3/SMTP/IMAP功能？](https://service.mail.qq.com/cgi-bin/help?subtype=1&no=166&id=28)

### 获取 QQ 邮箱授权码

参考链接：[什么是授权码，它又是如何设置？](https://service.mail.qq.com/cgi-bin/help?subtype=1&id=28&no=1001256)

复制获取到的授权码（一串类似 `gzoyimtltnqsbdba` 的字符串），然后在下面的配置文件中输入。

### 编写配置文件
在目录下创建 `config.yaml`，把下方的模板粘贴进去，并把相应内容进行修改：

```yaml
casId: '学工号'
password: '密码'
# 获取成绩时间间隔（单位毫秒），下面是 60s，建议频率不要太高
interval: 60000
# nodemailer smtp 传输选项
# 更多配置项参考 nodemailer 文档
smtp:
  host: smtp.qq.com
  auth:
    user: 你的QQ号@qq.com
    pass: 上一步获取到的授权码，不要带空格
mail:
  from: '"成绩查询小助手 😆" <你的QQ号@qq.com>'
  # 下面是要接收提醒的邮箱，英文逗号隔开多个邮箱
  to: '11111@qq.com'
  # 多个邮箱的话这么填（去掉井号），可以把成绩发给自己的爸爸妈妈和亲朋好友，或者是同班同学：
  #to: "bar@example.com, baz@example.com"
```

### 运行脚本

运行脚本（请确保上述任务已完成），如果想让脚本 24 小时工作的话，需要关掉电脑的息屏断网之类的节能功能：

```bash
$ npm run start
```
