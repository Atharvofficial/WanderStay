const Listing = require("./models/listings/listingSchema");
const {listingSchema,reviewSchema} = require("./utils/JoiSchema.js");
let ExpressError = require("./utils/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });



module.exports.isLoggedin = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    console.log(req.originalUrl);
    req.session.originalUrl = req.originalUrl
    req.flash("error","Please Log in first!");
    res.redirect("/login");
}

module.exports.alreadyLoggedin = (req,res,next)=>{
    if(req.isAuthenticated()){
        req.flash("success","You are already logged in!");
        return res.redirect("/listings");
    }
    next();
}

module.exports.saveOriginalUrl = (req,res,next)=>{
    res.locals.originalUrl = req.session.originalUrl;
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(listing.owner._id.toString()===res.locals.currUser._id.toString()){
        return next();
    }
    req.flash("error", "You do not have permission for this activity!");
    res.redirect(`/listings/${id}`);
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        next(new ExpressError(400, error));
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        next(new ExpressError(400, error));
    }else{
        next();
    }
}

module.exports.geoCode = async(req,res,next)=>{
    const response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    }).send();
    if (!response.body.features.length) {
    throw new ExpressError(400, "Invalid location");
    }
    req.coordinates = response.body.features[0].geometry;
    next();
}