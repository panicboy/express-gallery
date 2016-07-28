'use strict';

module.exports = {
  up: function (queryInterface, Sequelize, DataTypes) {
    return queryInterface.createTable("Post", {
      image_url: {type: DataTypes.STRING,
        isUrl: true,
        unique: true,
        allowNull: false},
      title: {type: DataTypes.STRING,
        allowNull: false},
      description: DataTypes.TEXT
      },{
      classMethods: {
        associate: function(models) {
          Post.belongsTo(models.User);
        }
      }
    });
  },
  down: function (queryInterface, Sequelize) {
      return queryInterface.dropTable('Post');
  }
};
