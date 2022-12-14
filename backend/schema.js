const Sequelize = require("sequelize");
const path = require("path");
const fs = require('fs');

const mergedDatabase = path.resolve('./dataset/', "database.db");
const isFirst = !fs.existsSync(mergedDatabase);

const sequelize = new Sequelize("main", null, null, {
  dialect: "sqlite",
  storage: mergedDatabase,
  logging: false,
});

const Asset = sequelize.define(
  "assets",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      _autoGenerated: true,
    },
    contract: Sequelize.STRING,
    tokenId: Sequelize.STRING,
    name: Sequelize.STRING,
    imageOriginalUrl: Sequelize.STRING,
    imagePreviewUrl: Sequelize.STRING,
    imageUrl: Sequelize.STRING,
    supportsWyvern: Sequelize.TINYINT,
    scamSniffer: Sequelize.TINYINT
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["contract", "tokenId"],
      },
    ],
  }
);


const Cache = sequelize.define(
  "cache",
  {

    key: Sequelize.STRING,
    value: Sequelize.STRING
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["key"],
      },
    ],
  }
);

async function init() {
  await Asset.sync({ alter: true });
}

if (isFirst) {
  init()
}


module.exports = {
  init,
  sequelize,
  Asset,
  Cache,
};
