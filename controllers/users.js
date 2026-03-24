const User = require("../models/users/userSchema.js");


module.exports.getSignup = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.postSignup = async(req,res)=>{
    try {
        let {username, email, password} = req.body;
        let newUser = new User({username, email});
        let registeredUser = await User.register(newUser,password);
        
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome To Airbnb");
            res.redirect("/listings");
        })
        
    } catch (error) {
        if(error.code === 11000){
            req.flash("error","Email Already Exists!");
            return res.redirect("/signup");
        }
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

module.exports.getLogin = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.authenticateLogin = (req,res)=>{
    req.flash("success", "Welcome Back To Airbnb");
    if(res.locals.originalUrl){
    return res.redirect(res.locals.originalUrl);
    }else{
        res.redirect("listings");
    }
}

module.exports.logout = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully!");
        
        res.redirect("/listings");
    })
}