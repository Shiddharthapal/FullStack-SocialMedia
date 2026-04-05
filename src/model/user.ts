import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// UserDetails is the authentication record used by login, registration, posts,
// comments, and reactions. Password hashing is handled in the schema hook below.
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Please provide a valid email",
    ],
  },
  firstName: {
    type: String,
    required: [true, "First name is required"], 
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"], 
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  createdAt: {
    type: Date,
    default: () => {
      // The project uses Bangladesh-local timestamps in several places, so the
      // initial createdAt value is normalized here.
      const now = new Date();
      const bdTime = new Date(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
        }),
      );
      return bdTime;
    },
  },
});

// Hash the password only when it changes so updates do not repeatedly re-hash
// an already-hashed value.
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  } catch (error) {
    throw error;
  }
});

// Instance method used by the login route for password verification.
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.UserDetails ||
  mongoose.model("UserDetails", userSchema);
