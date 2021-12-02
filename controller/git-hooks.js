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
    let content = ''
    if(object_kind === 'push') {
      let {
        ref = '',
        user_name,
        commits
      } = req.body
      if(!(ref.includes('dev') || ref.includes('master')))  return
      content = `项目「${project.name}」收到一次push提交[汗]\n提交者:「${user_name}」\n分支:「${ref}」\n最新提交信息: "${commits[0] && commits[0].message}"`
      let postData ={
        content
      }
      axios.post(webhook, postData)
    } else if(object_kind === 'merge_request') {
      let { 
        user,
        object_attributes = {
          source_branch,
          target_branch,
          source,
          target
        },    // 合并相关信息
        last_commit
      } = this.req.body
      if(!(['dev, master, main'].includes(source_branch) || ['dev, master, main'].includes(target_branch))) return
      content = `「${user.username}」在「${source_branch}」发起了一个MR\n标题: "${last_commit[0] && last_commit[0].message}"\n查看MR详情`
      let postData ={
        content
      }
      axios.post(webhook, postData)
    }
    res.send({
      code: 0,
      messag: 'success'
    })

  }

}