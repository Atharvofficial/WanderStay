const express = require("express");
const router = express.Router({mergeParams:true});
let wrapAsync = require("../../utils/wrapAsync.js");
const {isLoggedin, validateReview} = require("../../middlewares.js");
const reviewsController = require("../../controllers/reviews.js");


// Reviews Routes
router.post("/",isLoggedin, validateReview, wrapAsync(reviewsController.newReview));

router.delete("/:reviewId",isLoggedin, wrapAsync(reviewsController.destroyReview));

module.exports = router;