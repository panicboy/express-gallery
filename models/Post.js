module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    image_url: {type: DataTypes.STRING,
      isUrl: true,
      unique: true,
      allowNull: false},
    title: {type: DataTypes.STRING,
      allowNull: false},
    description: DataTypes.TEXT
    }, { classMethods:
      { associate: function(models) {
        Post.belongsTo(models.User);
      }
    }
  });
  return Post;
};