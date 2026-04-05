import mongoose from 'mongoose';

const connect = async () => {
  const conected = mongoose.connection.readyState;
  if (conected) {
    console.log("already connected");
    return;
  } else {
    const res = await mongoose.connect(
      "mongodb+srv://pal351069:shiddhartha29rikta@cluster0.qcjbn.mongodb.net/fullstack-amplify"
    );
    if (res) {
      console.log("connected");
    } else {
      console.log("not connected");
    }
  }
};

export { connect as c };
