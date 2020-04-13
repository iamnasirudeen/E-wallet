/**
 * Disable unauthencticated users from accessing the dashboard pages
 */

export default function (req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("success_msg", "Pls Login to continue");
  res.redirect("/login");
}
