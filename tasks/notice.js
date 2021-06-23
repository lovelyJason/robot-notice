const fs = require('fs')
const path = require('path')
const cheerio = require("cheerio");
const superagent = require("superagent");
// console.log(process.env.NODE_ENV)
const isDev = process.env.NODE_ENV === 'development' ? true : false
const puppeteer = isDev ? require("puppeteer-core") : require('puppeteer');
const schedule = require("node-schedule");
const jsDiff = require('diff')
const axios = require('axios')

const spiderDisguise = require("../utils/spider-disguise.js");
const config = require('./config')

let oldNote = '', newNote = ''
let count = 1

async function getHtml() {
  // superagent
  //   .get('https://note.youdao.com/ynoteshare1/index.html?id=f20811452fd279ad4a97f8abba81acbb&type=note')
  //   .end((err, res) => {
  //     if(err) {

  //     } else {
  //       // console.log(res.text)
  //       getData(res.text)
  //     }
  //   })
  try {
    let executablePath = "C:/Program Files/Google/Chrome/Application/chrome.exe"
    // let executablePath = "C:/Users/kingdee/Downloads/chromedriver_win32/chromedriver.exe"
    let launchOptions = {
      headless: true,
      // executablePath,
      ignoreDefaultArgs: ["--enable-automation"],
      args: [
        "--disable-blink-features=AutomationControlled",
        "--allow-running-insecure-content",
        "--disable-web-security",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--remote-debugging-port=9222"  // 开启远程调试
      ],
    }
    isDev ? launchOptions.executablePath = executablePath : undefined
    const browser = await puppeteer.launch(launchOptions);
    //直接连接已经存在的 Chrome
    // let browser = await puppeteer.connect({
    //   browserWSEndpoint: version.webSocketDebuggerUrl
    // });
    global.browser = browser;
    let page = await initYoudaoPage(browser)
    run(browser, page);

    let rule = new schedule.RecurrenceRule(); 
    rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]
    schedule.scheduleJob(rule, async function () {
      console.log('开启定时任务')
      // page = await initYoudaoPage(browser)
      await page.reload({
        waitUntil: 'networkidle0',
        timeout: 60000
      })
      run(browser, page)
    })
  } catch (error) {
    console.error(error);
  }
}

async function initYoudaoPage (browser) {
  const page = await browser.newPage();
  global.page = page;
  await page.evaluateOnNewDocument(() => {
    // 在每个新页面打开前执行以下脚本
    spiderDisguise();
  });
  const url = config.url || "https://note.youdao.com/ynoteshare1/index.html?id=f20811452fd279ad4a97f8abba81acbb&type=note";
  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 50000
  });
  return page
}

async function run(browser, page) {
  try {
    // await page.waitForTimeout(300);    // iframe中会有网络资源加载
    await page.waitForSelector("iframe");
    page.screenshot({ path: "screenshot.png" });
    const elementHandle = await page.$("div#main iframe");
    const frame = await elementHandle.contentFrame();
  
    const html = await frame.content();
    const $ = cheerio.load(html);
    const noteText = $(".bulb-editor").text();
    
    if(count > 1) {   // 至少第二次定时任务开始
      // 比较新旧文档
      newNote = noteText
      const diffArr = diffNote(oldNote, newNote)
      console.log(diffArr)
      if(diffArr.length > 0) {
        // console.log('note changed', diffArr)
        // 调用机器人发送信息
        let content = `需求文档被修改，点击查看${config.url || 'https://note.youdao.com/ynoteshare1/index.html?id=f20811452fd279ad4a97f8abba81acbb&type=note'}\n\n`
        let reg = /^[\s\n\r[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|；|\:|：|\"|\'|\,|，|\<|\.|。|\>|\/|\?]{1,}$/
        let validDiffArr = diffArr.filter(val => {
          // 去掉空白字符以及全部为标点符号的
          return val.value && val.value.trim() && !reg.test(val.value)
        })
        if(validDiffArr.length === 0) return
        let changeStr = validDiffArr
          .map(val => {
            return `${val.added ? '新增' : '删除'}------${val.value}`
          })
          .join('\n')
        content += changeStr
        let postData = {
          content
        }
        console.log('机器人消息', content)
        axios.post(config.webhook || 'https://www.yunzhijia.com/gateway/robot/webhook/send?yzjtype=0&yzjtoken=5e7ad7f53e4649a0a2f9d2de5fd7f5d3', postData)
      } else {
        console.log('no change')
      }
    } else {
      // 第一次新旧文档应该是一样的，方便后续重置
      newNote = oldNote = noteText
    }
  
    console.log('run complete')
    fs.writeFile(path.join(process.cwd(), 'text.txt'), noteText, function (err) {})

    // 任务结束收尾工作
    oldNote = newNote
    newNote = ''
    count++
    // await page.close();
    // await browser.close()
    
  } catch (error) {
    console.log(error.message)
  }

}

function diffNote (old, newly) {
  const diffRes = jsDiff.diffChars(old, newly)    // return array eg:{ count: 8, added: true, removed: undefined, value: ' 我是新加的文字' }
  const changedArr = diffRes.filter(val => {
    return val.added || val.removed
  })
  return changedArr
}

module.exports = function () {
  console.log("note task init");
  getHtml();
}
