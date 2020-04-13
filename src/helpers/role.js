/**
 * check if a user is allowed to access a page
 * @param  {...any} role The role Id to check
 */

export default function permit(...allowed) {
  const isAllowed = (roleId) => allowed.indexOf(roleId) > -1;
  return (req, res, next) => {
    if (req.user && isAllowed(req.user.roleId)) next();
    else {
      res.send("You re not allowed to visit this page");
    }
  };
}
