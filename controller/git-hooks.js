const config = require('../tasks/config')
const axios = require('axios')

const { webhook } = config.git

function randomFromCollection(collection) {
  var item = collection[Math.floor(Math.random() * collection.length)];
  return item
}

module.exports = {
  /**
   * @author jasonhuang
   */
  init(req, res, next) {
    // console.log(req.body)
    let { 
      object_kind,
      project = {},
    } = req.body
    let content = ''
    // "合并分支 'zjian_dev' 到 'dev'\n\n支付页面新增  ISV数据看板\n\n查看合并请求 appmarketplace"
    let reg = /\s*查看合并请求.*/
    // [奋斗][吃惊][翻白眼][馋嘴][懒得理你][思考][憋屈][发愣][渴望][兴奋][嘘][疑问][汗][困][打哈气][睡觉][哼][闭嘴][doge][嘿哈][收到][皱眉]
    let emojis = ['[奋斗]', '[吃惊]', '[翻白眼]', '[馋嘴]', '[懒得理你]', '[思考]', '[憋屈]', '[发愣]', '[渴望]', '[兴奋]', '[嘘]', '[汗]','[困]','[打哈气]','[睡觉]','[哼]','[闭嘴]','[闭嘴]','[doge]','[嘿哈]','[收到]','[皱眉]' ]
    let emoji = randomFromCollection(emojis)
    if(object_kind === 'push') {
      let {
        ref = '',
        // user_name,    // 注意不是这里， 要看commit里面author信息
        commits
      } = req.body
      
      if(!(ref.includes('dev') || ref.includes('master')))  {
        return res.send({
          code: 0,
          messag: 'success'
        })
      }
      let lastCommitMessage = commits[0] && commits[0].message && commits[0].message.replace(reg, '')
      let lastCommitUsername = commits[0] && commits[0].author && commits[0].author.name
      let lastCommitUrl = commits[0] && commits[0].url
      content = `项目「${project.name}」收到一次push提交${emoji}\n提交者:「${lastCommitUsername}」\n分支:「${ref}」\n最新提交信息: ${lastCommitMessage}\n查看push详情${lastCommitUrl}`
      let postData ={
        content
      }
      axios.post(webhook, postData)
    } else if(object_kind === 'merge_request') {
      console.log('有合并请求, last_commit:')
      let { 
        user,
        object_attributes: {
          source_branch,
          target_branch,
          // source,
          // target
          last_commit = {}
        } = {},    // 合并相关信息
      } = req.body
      console.log(last_commit)
      if(!(['dev', 'master', 'main'].includes(source_branch) || ['dev', 'master', 'main'].includes(target_branch))) {
        return res.send({
          code: 0,
          messag: 'success'
        })
      }
      let lastCommitMessage = last_commit.message && last_commit.message.replace(reg, '')
      // let lastCommitUsername = last_commit.author && last_commit.author.name
      let lastCommitUsername = user.username
      content = `${emoji}「${lastCommitUsername}」在「${source_branch}」发起了一个MR\n标题: ${lastCommitMessage}\n源分支: ${source_branch}\n目标分支: ${target_branch}\n查看MR详情${last_commit.url}`
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