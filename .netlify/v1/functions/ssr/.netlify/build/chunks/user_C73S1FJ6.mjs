import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Please provide a valid email"
    ]
  },
  firstName: {
    type: String,
    required: [true, "First name is required"]
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  createdAt: {
    type: Date,
    default: () => {
      const now = /* @__PURE__ */ new Date();
      const bdTime = new Date(
        now.toLocaleString("en-US", {
          timeZone: "Asia/Dhaka"
        })
      );
      return bdTime;
    }
  }
});
userSchema.pre("save", async function(next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  } catch (error) {
    throw error;
  }
});
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const userDetails = mongoose.models.UserDetails || mongoose.model("UserDetails", userSchema);

export { userDetails as u };
