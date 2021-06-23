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