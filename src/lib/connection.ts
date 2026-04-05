declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_MONGODB_URI: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

import mongoose from "mongoose";

// Reuse a single Mongoose connection across API calls. Astro can execute many
// requests in the same process, so reconnecting on every request is wasteful.
const connect = async () => {
  const conected = mongoose.connection.readyState;

  if (conected) {
    console.log("already connected");
    return;
  } else {
    const res = await mongoose.connect(
      import.meta.env.PUBLIC_MONGODB_URI ||
        "mongodb+srv://pal351069:shiddhartha29rikta@cluster0.qcjbn.mongodb.net/fullstack-amplify",
    );
    if (res) {
      console.log("connected");
    } else {
      console.log("not connected");
    }
  }
};

export default connect;
