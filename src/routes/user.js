import express from "express";
import passport from "../config/passport";
const router = express.Router();
import User from "../models/user";
import crypto from "crypto";

// Sign up page
router.post("/sign-up", async (req, res, next) => {
  // check the body for empty fields
  req.assert("email", "Email Field is Compulsory").notEmpty();
  req.assert("full_name", "Full name Field is Compulsory").notEmpty();
  req.assert("password", "Password Field is Compulsory").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    req.flash("success_msg", errors[0].msg);
    return res.redirect("back");
  }

  // Generate a 12 random virtual account ID for each user
  let account_id = crypto.randomBytes(6).toString("hex");

  const { email, full_name, password, virtual_account_id = account_id, roleId = "user" } = req.body;

  // check if the email coming from the body exist
  let email_exist = await User.findOne({ email });
  if (email_exist) {
    req.flash("success_msg", "This Email has been used");
    return res.redirect("back");
  }

  // if email doesnt exist, create the user
  await User.create({ email, full_name, password, virtual_account_id, roleId });
  req.flash("success_msg", "Registration Successfull");
  return res.redirect("back");
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) return next(err);
    if (!user) {
      req.flash("success_msg", "Incorect Email or password");
      return res.redirect("back");
    }
    req.logIn(user, function (err) {
      if (err) return next(err);
      switch (req.user.roleId) {
        case "user":
          return res.redirect("/user/dashboard");
          break;
        case "admin":
          return res.redirect("/admin/dashboard");
          break;
        default:
          return res.redirect("/user/dashboard");
          break;
      }
    });
  })(req, res, next);
});

router.get("/log-out", (req, res, next) => {
  req.logOut();
  req.flash("success_msg", "Login to Continue.");
  return res.redirect("/login");
});

module.exports = router;
