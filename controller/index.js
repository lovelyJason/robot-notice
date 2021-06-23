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
    // await page.evaluateOnNewDocument(() => {
    //   // 在每个新页面打开前执行以下脚本
    //   const newProto = navigator.__proto__;
    //   delete newProto.webdriver; // 删除navigator.webdriver字段
    //   navigator.__proto__ = newProto;
    //   window.chrome = {}; // 添加window.chrome字段，为增加真实性还需向内部填充一些值
    //   window.chrome.app = {
    //     InstallState: "hehe",
    //     RunningState: "haha",
    //     getDetails: "xixi",
    //     getIsInstalled: "ohno",
    //   };
    //   window.chrome.csi = function () {};
    //   window.chrome.loadTimes = function () {};
    //   window.chrome.runtime = function () {};
    //   Object.defineProperty(navigator, "userAgent", {
    //     // userAgent在无头模式下有headless字样，所以需覆写
    //     get: () =>
    //       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36",
    //   });
    //   Object.defineProperty(navigator, "plugins", {
    //     get: () => [
    //       {
    //         0: {
    //           type: "application/x-google-chrome-pdf",
    //           suffixes: "pdf",
    //           description: "Portable Document Format",
    //           enabledPlugin: Plugin,
    //         },
    //         description: "Portable Document Format",
    //         filename: "internal-pdf-viewer",
    //         length: 1,
    //         name: "Chrome PDF Plugin",
    //       },
    //       {
    //         0: {
    //           type: "application/pdf",
    //           suffixes: "pdf",
    //           description: "",
    //           enabledPlugin: Plugin,
    //         },
    //         description: "",
    //         filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
    //         length: 1,
    //         name: "Chrome PDF Viewer",
    //       },
    //       {
    //         0: {
    //           type: "application/x-nacl",
    //           suffixes: "",
    //           description: "Native Client Executable",
    //           enabledPlugin: Plugin,
    //         },
    //         1: {
    //           type: "application/x-pnacl",
    //           suffixes: "",
    //           description: "Portable Native Client Executable",
    //           enabledPlugin: Plugin,
    //         },
    //         description: "",
    //         filename: "internal-nacl-plugin",
    //         length: 2,
    //         name: "Native Client",
    //       },
    //     ],
    //   });
    //   Object.defineProperty(navigator, "languages", {
    //     // 添加语言
    //     get: () => ["zh-CN", "zh", "en"],
    //   });
    //   const originalQuery = window.navigator.permissions.query;
    //   window.navigator.permissions.query = (parameters) =>
    //     parameters.name === "notifications"
    //       ? Promise.resolve({ state: Notification.permission })
    //       : originalQuery(parameters);
    //   Object.defineProperties(navigator, {
    //     webdriver: { get: () => undefined },
    //   });
    // });

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
