import express from "express";
import Wallet from "../models/gift";
import mongoose from "mongoose";
import Transactions from "../models/transactions";
import auth from "../helpers/auth";
const router = express.Router();

let wallet_query = (query) => {
  return Wallet.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: null,
        amount: {
          $sum: "$amount",
        },
      },
    },
  ]);
};

router.get("/user/dashboard", auth, async (req, res, next) => {
  let total_funds_sent = await wallet_query({ senderId: mongoose.Types.ObjectId(req.user.id) });
  let total_funds_received = await wallet_query({
    receiverId: mongoose.Types.ObjectId(req.user.id),
  });
  let pending_transactions_count = await Transactions.countDocuments({
    userId: req.user.id,
    status: "pending",
  });

  let transaction_history = await Transactions.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });

  res.render("./account/dashboard", {
    title: "Dashboard",
    total_funds_sent,
    total_funds_received,
    transaction_history,
    pending_transactions_count,
  });
});

router.get("/user/dashboard/transaction-history", auth, async (req, res, next) => {
  let transaction_details = await Transactions.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });

  res.render("./account/transactions", {
    title: "Dashboard | Transactions",
    transaction_details,
  });
});

router.get("/user/dashboard/fund-wallet", auth, (req, res, next) =>
  res.render("./account/fund-wallet"),
);

router.get("/user/dashboard/gift-history", auth, async (req, res, next) => {
  let gift_sent = await Wallet.find({ senderId: req.user.id })
    .populate("receiverId")
    .sort({ createdAt: -1 });
  res.render("./account/gift-sent", { gift_sent });
});

router.get("/user/dashboard/gift-received", auth, async (req, res, next) => {
  let gift_received = await Wallet.find({ senderId: { $ne: req.user.id } })
    .populate("senderId")
    .sort({ createdAt: -1 });
  res.render("./account/gift-received", { gift_received });
});

router.get("/user/dashboard/gift/send-a-gift", auth, (req, res, next) =>
  res.render("./account/send-a-gift"),
);

export default router;
