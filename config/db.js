const mongoose = require("mongoose");
mongoose.set("debug", true);
const connectUrl =
  "mongodb+srv://sungu:sungu1111@cluster0.gxj08vx.mongodb.net/onsight?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(connectUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = connectDB;
