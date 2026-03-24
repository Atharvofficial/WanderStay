const mongoose = require("mongoose");
const Listing = require("../models/listings/listingSchema.js");
let data = require("./newData.js");
require("dotenv").config();


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
}


async function connect(){
    
    try {
        await main();
        console.log("Database connected");
    } catch (error) {
        console.log("Database connection failed");
    }
}

connect();



async function init (){
    await Listing.deleteMany({})
    data = data.map((el)=> ({...el, owner : "69b7f1a8e1a9cdf2d8f44a5e"}));
    await Listing.insertMany(data);
    console.log("Data initialised");
}

init();