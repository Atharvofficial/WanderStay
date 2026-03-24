const express = require("express");
const router = express.Router();
let wrapAsync = require("../../utils/wrapAsync.js");
const {isLoggedin, isOwner, validateListing, geoCode} = require("../../middlewares.js");
const listingsController = require("../../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../../cloudConfig.js");
const upload = multer({storage});



router.route("/")
.get(wrapAsync(listingsController.index))
.post(isLoggedin,upload.single("listing[image]"),validateListing,wrapAsync(geoCode),wrapAsync(listingsController.newListing));


router.get("/new",isLoggedin,listingsController.renderNewForm)

router.route("/:id")
.get(wrapAsync(listingsController.showListing))
.put(isLoggedin,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingsController.editListing))
.delete(isLoggedin,isOwner, wrapAsync(listingsController.destroyListing));


router.get("/:id/edit",isLoggedin,isOwner, wrapAsync(listingsController.showEditListing));



module.exports = router;