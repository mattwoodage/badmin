var Users = require('../../../models/League.js');
module.exports = function (router) {
  console.log(router)
  router.get('', (req, res, next) => {
    League.find({}).sort({ createdAt: -1 }).exec((err, leagues) => {
      if (err) {

        console.log(err)
        return next(err)
      }
      res.json(leagues)
    })
  })

  

};
