// IMPORT REQUIRED MODULES
const mongoose = require('mongoose');

// DEFINE DATABASE OPTIONS
const URL = `mongodb+srv://app-admin:${process.env.DB_KEY}@${process.env.DB_URI}/${process.env.DB_NAME}`;

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

// ATTEMPT CONNECTION TO DATABASE
mongoose
  .connect(URL, OPTIONS)
  .then(function (connection_data) {
    // console.log(connection_data);
  })
  .catch(function (error) {
    console.log(
      `Mongodb connection failed.  The following errors occured: ${error}`
    );
  });
