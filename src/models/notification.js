import mongoose from "mongoose";
const Schema = mongoose.Schema;
const notificationSchema = new Schema(
  {
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    content: String,
    status: {
      type: String,
      enum: ["delivered", "read"],
      default: "delivered",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);
