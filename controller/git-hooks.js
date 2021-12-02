module.exports = {
  init(req, res, next) {
    console.log(req.body, req.body.object_kind)
    res.send({
      code: 0,
      messag: 'success'
    })
  }

}