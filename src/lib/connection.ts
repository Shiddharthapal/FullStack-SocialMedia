import mongoose from "mongoose";

const connect = async () => {
  let conected = mongoose.connection.readyState;

  if (conected) {
    console.log("already connected");
    return;
  } else {
    let res = await mongoose.connect(import.meta.env.MONGODB_URI||"mongodb+srv://pal351069:shiddhartha29rikta@cluster0.qcjbn.mongodb.net/frontend_intern");
    if (res) {
      console.log("connected");
    } else {
      console.log("not connected");
    }
  }
};

export default connect;
