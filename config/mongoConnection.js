const mongoose = require("mongoose");

mongoose
  .connect("mongodb://0.0.0.0:27017/SocialMedia")
  .then(() => {
    console.log("Connection established");
  })
  .catch((error) => handleError(error));
