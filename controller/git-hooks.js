const config = require('../tasks/config')
const axios = require('axios')

const { webhook } = config.git

module.exports = {
  /**
   * @author jasonhuang
   */
  init(req, res, next) {
    console.log(req.body)
    const { 
      object_kind,
      user: { name }
     } = req.body
    if(object_kind === 'merge_request') {
      let postData = `${name}于合并了代码`
      console.log('合并了代码')
      // axios.post(webhook, postData)

    }
    res.send({
      code: 0,
      messag: 'success'
    })
  }

}