const ClienteController = require("../controllers/ClienteController");
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const UsuarioController = require("../controllers/UsuarioController");

passport.serializeUser((user, done) => {
	done(null, { id: user.id, rol: user.id_rol });
});

passport.deserializeUser(async ({ id, rol }, done) => {
	let userDB;
	if (rol == process.env.ROL_CLIENTE) {
		userDB = await ClienteController.loadDataCliente(id);
	} else {
		userDB = await UsuarioController.getById(id);
	}
	userDB ? done(null, userDB.dataValues) : done(null, false);
});

passport.use(
	"local-signup",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "contrasena",
			passReqToCallback: true,
		},
		async (req, email, contrasena, done) => {
			req.logOut();
			const userDB = await UsuarioController.getByEmail(email);
			const user = !userDB ? await ClienteController.create(req) : null;
			return user ? done(null, userDB.dataValues) : done(null, false);
		}
	)
);

passport.use(
	"local-signin",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "contrasena",
			passReqToCallback: true,
		},
		async (req, email, contrasena, done) => {
			req.logOut();
			const userDB = await UsuarioController.getClienteByEmail(email);
			return !userDB || (userDB && !userDB.comparePassword(contrasena))
				? done(null, false)
				: done(null, userDB.dataValues);
		}
	)
);

passport.use(
	"supervisor-signin",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "contrasena",
			passReqToCallback: true,
		},
		async (req, email, contrasena, done) => {
			req.logOut();
			const { id_rol } = req.body;
			const userDB = await UsuarioController.getUserSupervisor(email, id_rol);
			return !userDB || (userDB && !userDB.comparePassword(contrasena))
				? done(null, false)
				: done(null, userDB.dataValues);
		}
	)
);
