module.exports = {
  spider: {
    enable: true, // 是否开启爬虫轮询
    rule: {
      hour: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
      minute: [0, 10, 20, 30, 40, 50]
    },
    url: 'https://note.youdao.com/ynoteshare/index.html?id=eeb629e270683d93666c4a60deca86e8&type=note&_time=1712465134859',
    webhook: '',
  },
  git: {
    webhook: ''
  }
}