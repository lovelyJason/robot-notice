const config = require('../tasks/config')
const axios = require('axios')

const { webhook } = config.git

module.exports = {
  /**
   * @author jasonhuang
   */
  init(req, res, next) {
    console.log(req.body)
    let { 
      object_kind,
      project = {},
    } = req.body
    if(!['dev, master, main'].includes(source_branch)) {
      return res.send({
        code: 0,
        message: 'success'
      })
    }
    let content = ''
    if(object_kind === 'push') {
      let {
        ref,
        user_name,
        commits
      } = req.body
      content = `
        项目「${project.name}」收到一次push提交[汗]\n
        提交者:「${user_name}」\n
        分支:「${ref}」\n
        最新提交信息: "${commits[0] && commits[0].message}"
      `
    } else if(object_kind === 'merge_request') {
      let { 
        user,
        object_attributes = {
          source_branch,
          source,
          target
        },    // 合并相关信息
        last_commit
      } = this.req.body
      content = `
        「${user.username}」在「${source_branch}」发起了一个MR\n
        标题: "${last_commit[0] && last_commit[0].message}"\n
        查看MR详情
      `
    }
    let postData ={
      content
    }
    console.log('合并了代码')
    axios.post(webhook, postData)
    res.send({
      code: 0,
      messag: 'success'
    })
  }

}