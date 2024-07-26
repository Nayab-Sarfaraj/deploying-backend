const mongoose = require("mongoose");
const connectToDatabase = async () => {
  // Or:
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/user");
   
  } catch (error) {
    // handleError(error);
    console.log(error);
  }
};

connectToDatabase();
