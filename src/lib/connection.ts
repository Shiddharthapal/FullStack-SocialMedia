declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_MONGODB_URI: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

import mongoose from "mongoose";

const connect = async () => {
  const conected = mongoose.connection.readyState;

  if (conected) {
    console.log("already connected");
    return;
  } else {
    const res = await mongoose.connect(
      import.meta.env.PUBLIC_MONGODB_URI ||
        "mongodb+srv://pal351069:shiddhartha29rikta@cluster0.qcjbn.mongodb.net/frontend_intern",
    );
    if (res) {
      console.log("connected");
    } else {
      console.log("not connected");
    }
  }
};

export default connect;
