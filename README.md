# robot-notice

## 介绍

这是一个什么项目？多年前在某大厂上班时，为团队搭建的一个基础设施吧，这个项目主要实现两个功能

1. git仓库的webhooks被触发时调用我司机器人的接口，通知到群里

2. 爬虫爬取产品经理写的需求文档，通过前后diff比对产品对需求文档的增删改，定时任务轮询，然后调用机器人的hook往项目群里发通知，同学们再也不担心需求文档被篡改了

## 示例

![](https://raw.githubusercontent.com/lovelyJason/robot-notice/master/public/images/document-hook.jpg)

![](https://raw.githubusercontent.com/lovelyJason/robot-notice/master/public/images/git-hook.jpeg)

## 安装

```bash
npm i
npm install puppeteer --registry https://registry.npm.taobao.org
```

## 开发

```bash
npm run dev
```

## 生产环境运行服务

低版本不支持fs.promises，所以需要指定node版本

```bash
# 启动，只需执行一次
pm2 start --interpreter ~/.nvm/versions/node/v12.19.0/bin/node --name robot-notice npm -- run start

# 重启
pm2 restart robot-notice
```
