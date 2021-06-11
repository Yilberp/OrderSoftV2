const { Router } = require("express");
const LoginController = require("../controllers/LoginController");
const passport = require("passport");
const router = Router();

router.route("/").post(
	passport.authenticate("local-signin", {
		successRedirect: "/",
		failureRedirect: "/",
		passReqToCallback: true,
	})
);
router
	.route("/supervisor")
	.get(LoginController.viewLoginSupervisor)
	.post(
		passport.authenticate("supervisor-signin", {
			successRedirect: "/administrador/nuevo-producto",
			failureRedirect: "/login/supervisor",
			passReqToCallback: true,
		})
	);
router.route("/signup").post(
	passport.authenticate("local-signup", {
		successRedirect: "/",
		failureRedirect: "/",
		passReqToCallback: true,
	})
);

module.exports = router;
