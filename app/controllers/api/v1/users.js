var Users = require('../../../models/users.js');
module.exports = function (router) {


  router.get('', function(req, res) {
    
      // I know, this API should return a list but what the hell
      Users.findOne({email: 'shahqaan@onebyte.biz'}).then(function(user) {

        if (user) { return user; }

        return Users.create({email: 'shahqaan@onebyte.biz'});
      }).then(function(user) {
        res.json(user);
      });
    
  });

};
