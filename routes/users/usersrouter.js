const express = require("express");
const router = express.Router();
const passport = require("passport");
let wrapAsync = require("../../utils/wrapAsync.js");
const usersController = require("../../controllers/users.js");

const {isLoggedin,alreadyLoggedin,saveOriginalUrl} = require("../../middlewares.js");


router.route("/signup")
.get(alreadyLoggedin,usersController.getSignup)
.post(alreadyLoggedin,wrapAsync(usersController.postSignup));


router.route("/login")
.get(alreadyLoggedin,usersController.getLogin)
.post(alreadyLoggedin,saveOriginalUrl,passport.authenticate("local", { failureRedirect: '/login', failureFlash : true }), usersController.authenticateLogin);

router.get("/logout",isLoggedin,usersController.logout);

module.exports = router;