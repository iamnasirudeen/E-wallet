import mongoose from "mongoose";
const Schema = mongoose.Schema;
const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    amount: Number,
    reference: String,
    currency: String,
    channel: String,
    ip_address: String,
    status: {
      type: String,
      enum: ["pending", "success", "error"],
      default: "pending",
    },
    access_code: String,
  },
  { timestamps: true },
);

export default mongoose.model("Transactions", transactionSchema);
