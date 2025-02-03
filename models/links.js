"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Links extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Links.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Links.init(
    {
      name: DataTypes.STRING,
      url: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        model: "Users",
        key: "id",
      },
    },
    {
      sequelize,
      modelName: "Links",
    }
  );
  return Links;
};
