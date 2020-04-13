import express from "express";
import flash from "express-flash";
const router = express.Router();

router.use(flash());
router.use(async (req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

router.get("/", (req, res, next) => res.redirect("index"));
router.get("/sign-up", (req, res, next) => res.render("sign-up"));
router.get("/login", (req, res, next) => res.render("login"));

export default router;
