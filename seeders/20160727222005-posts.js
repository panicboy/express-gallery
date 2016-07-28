'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Posts', [{ image_url : `https://upload.wikimedia.org/wikipedia/bar/thumb/2/27/Hello_Kitty_logo.svg/2000px-Hello_Kitty_logo.svg.png`, title : `flickr.com` , description : `Here's a thing!`, createdAt : new Date(), updatedAt : new Date(), UserId : 2 }, { image_url : `http://cdn.trendir.com/wp-content/uploads/old/house-design/archipelago-house-2.jpg`, title : `Archipelago House` , description : `Archipelago House`, createdAt : new Date(), updatedAt : new Date(), UserId : 2  }, { image_url : `https://eggerapps.at/postico/img/icon_256x256.png`, title : `eggerapps.at` , description : `elephant icon`, createdAt : new Date(), updatedAt : new Date(), UserId : 3 }, { image_url : `https://img.buzzfeed.com/buzzfeed-static/static/2015-02/27/15/enhanced/webdr14/anigif_enhanced-14643-1425068912-32.gif`, title : `buzzfeed.com` , description : `Never gonna give you up`, createdAt : new Date(), updatedAt : new Date(), UserId : 3 }, { image_url : `http://kocham.org/wp-content/uploads/2012/04/1532.jpg`, title : `flickr.com` , description : `Shay Maria, modeling glasses`, createdAt : new Date(), updatedAt : new Date(), UserId : 3 }, { image_url : `http://iv1.lisimg.com/image/5081453/488full-francoise-boufhal.jpg`, title : `Francoise Boufhal` , description : `Francoise Boufhal`, createdAt : new Date(), updatedAt : new Date(), UserId : 4 }], {});
  },

  down : function (queryInterface, Sequelize) {
    queryInterface.bulkDelete('Posts', [{ image_url : `http://cdn.trendir.com/wp-content/uploads/old/house-design/archipelago-house-2.jpg` }, { image_url : `https://eggerapps.at/postico/img/icon_256x256.png` }, { image_url : `https://img.buzzfeed.com/buzzfeed-static/static/2015-02/27/15/enhanced/webdr14/anigif_enhanced-14643-1425068912-32.gif` }, { image_url : `http://kocham.org/wp-content/uploads/2012/04/1532.jpg` }, { image_url : `http://iv1.lisimg.com/image/5081453/488full-francoise-boufhal.jpg` }]);
  }
};