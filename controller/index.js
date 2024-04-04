// 废弃，在tasks/中作为定时任务执行
const cheerio = require("cheerio");
//根据请求网址的协议来决定引入http还是https模块
const superagent = require("superagent");
const puppeteer = require("puppeteer-core");

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
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      ignoreDefaultArgs: ["--enable-automation"],
      args: [
        "--disable-blink-features=AutomationControlled",
        "--allow-running-insecure-content",
        "--disable-web-security",
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });
    global.browser = browser;
    const page = await browser.newPage();
    global.page = page;

    const url =
      "https://note.youdao.com/ynoteshare1/index.html?id=f20811452fd279ad4a97f8abba81acbb&type=note";
    await page.goto(url, {
      waitUntil: 'networkidle0'
    });
    await page.waitForTimeout(500)
    await page.waitForSelector("iframe");
    page.screenshot({ path: 'screenshot.png' });
    const elementHandle = await page.$('div#main iframe');
    const frame = await elementHandle.contentFrame();
    // console.log(frame)

    const html = await frame.content()
    const $ = cheerio.load(html)
    const noteHtml = $('.bulb-editor').text()
    console.log(noteHtml)

  } catch (error) {
    console.log(error.message);
  }
}

function getData(html) {
  console.log(html);
  const $ = cheerio.load(html);
  const content = $("#root").html();
  console.log(content);
}

function init() {
  getHtml();
}

module.exports = {
  init,
};
