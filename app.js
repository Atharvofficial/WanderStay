if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const multer = require("multer");
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
var methodOverride = require('method-override');
ejsmate = require('ejs-mate');
let ExpressError = require("./utils/ExpressError.js");
const listingsrouter = require("./routes/listings/listingsrouter.js");
const reviewsrouter = require("./routes/reviews/reviewsrouter.js");
const usersRouter = require("./routes/users/usersrouter.js");
var session = require('express-session');
const MongoStore = require('connect-mongo').default;
var flash = require('connect-flash');
const User = require("./models/users/userSchema.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { error } = require('console');
let DB_URL = process.env.ATLAS_URL;

async function main() {
    await mongoose.connect(DB_URL);
}


async function connect() {
    try {
        await main();
        console.log("Database connected");
    } catch (error) {
        console.log("Database connection failed");
    }
}
connect();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);

const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto:{
    secret: process.env.SECRET
  },
    touchAfter : 24 * 3600,
})

store.on("error", ()=>{
    console.log("error in sessions store",err);
})

app.use(session({
    store,
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
}));



app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.listen(port, () => {
    console.log("Server Listening");
});

app.use("/listings", listingsrouter);
app.use("/listings/:id/reviews", reviewsrouter);
app.use("/",usersRouter);

app.all("/{*path}", (req, res, next) => {
    next(new ExpressError(500, "Page Not Found"));
})

app.use((err, req, res, next) => {
    let {
        status = 500, message = "Something Went Wrong"
    } = err;
    res.status(status);
    res.render("partials/error.ejs", {
        message
    });
});