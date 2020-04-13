import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: {
      type: Number,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    virtual_account_id: String,
    balance: {
      type: Number,
      default: 0,
    },
    roleId: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

//Hash password with bcrypt before saving
userSchema.pre("save", function (next) {
  let user = this;
  let SALT_FACTOR = 12;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

export default mongoose.model("Users", userSchema);
