const Listing = require("../models/listings/listingSchema");
const {cloudinary} = require("../cloudConfig");
const ExpressError = require("../utils/ExpressError");

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.index = async (req, res) => {
    let data = await Listing.find({});
    res.render("listings/home.ejs", {
        data
    });
}

module.exports.showListing = async (req, res) => {
    let {
        id
    } = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");
    if (!listing) {
        req.flash("error", "No Such Listing Found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {
        listing, mapToken : process.env.MAP_TOKEN,
    });
}

module.exports.showEditListing = async (req, res) => {
    let {
        id
    } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "No Such Listing Found!");
        return res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    // originalUrl = originalUrl.replace("/upload" , "/upload/h_300,w_250");
    res.render("listings/edit.ejs", {
        listing,
        originalUrl
    });


}

module.exports.editListing = async (req, res) => {
    let {
        id
    } = req.params;
    let newListing = await Listing.findByIdAndUpdate(id, {
        ...req.body.listing
    }, {
        runValidators: true
    });
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {
            url,
            filename
        }
        await newListing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let {
        id
    } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    cloudinary.api.delete_resources(listing.image.filename);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}

module.exports.newListing = async (req, res) => {
    if (!req.file) {
        req.flash("error", "Image is required!");
        return res.redirect("/listings/new");
    }
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.image = {
        url,
        filename
    }
    newListing.owner = req.user._id;
    newListing.geometry = req.coordinates;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");


}