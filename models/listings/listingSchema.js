const { ref } = require("joi");
const mongoose = require("mongoose");
const Review = require("../reviews/reviewSchema");
const User = require("../users/userSchema");

let Schema = mongoose.Schema;

let listingSchema = Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },
    image : {
        url: String,
        filename: String,
    },
    location : {
        type : String,
        required : true,
    },
    country : {
        type : String,
        required : true,
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});



listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        let result = await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

let Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;