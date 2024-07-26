const mongoose = require("mongoose");
const connectToDatabase = async () => {
  // Or:
  try {
    console.log(process.env.ATLAS_username);
    await mongoose.connect(
      `mongodb+srv://${process.env.ATLAS_username}:${process.env.password}@cluster0.peuugea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("connected");
  } catch (error) {
    // handleError(error);
    console.log(error);
  }
};

connectToDatabase();
