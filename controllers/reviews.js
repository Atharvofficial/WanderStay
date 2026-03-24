const Review = require("../models/reviews/reviewSchema.js");
const Listing = require("../models/listings/listingSchema.js");

module.exports.newReview = async(req,res)=>{
    let newReview =  new Review ({...req.body.review});
    newReview.author = req.user._id;
    let id = req.params.id;
    let listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    let {author : authorId} = await Review.findById(reviewId);
    console.log(authorId);
    if(authorId.toString() === req.user._id.toString()){
        await Review.findByIdAndDelete(reviewId);
        await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
        
        req.flash("success", "Review Deleted");
        return res.redirect(`/listings/${id}`);
    }
    req.flash("error", "You do not have permission to delete this review!");
    res.redirect(`/listings/${id}`)
    
}

