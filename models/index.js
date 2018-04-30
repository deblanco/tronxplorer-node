const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const models = {};
const mongoose = require('mongoose');

if (CONFIG.db_host != '') {
  const files = fs
    .readdirSync(__dirname)
    .filter(file => (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    ))
    .forEach((file) => {
      const filename = file.split('.')[0];
      const modelName = filename.charAt(0).toUpperCase() + filename.slice(1);
      models[modelName] = require(`./${file}`);
    });

  mongoose.Promise = global.Promise; // set mongo up to use promises
  const mongo_location =
    `mongodb://${CONFIG.db_user}:${CONFIG.db_password}@${CONFIG.db_host}:${CONFIG.db_port}/${CONFIG.db_name}`;

  mongoose.connect(mongo_location).catch((err) => {
    console.log('*** Can Not Connect to Mongo Server:', mongo_location);
  });

  const db = mongoose.connection;
  module.exports = db;
  db.once('open', () => {
    console.log(`Connected to mongo at ${mongo_location}`);
  });
  db.on('error', (error) => {
    console.log('error', error);
  });
  // End of Mongoose Setup
} else {
  console.log('No Mongo Credentials Given');
}

module.exports = models;
