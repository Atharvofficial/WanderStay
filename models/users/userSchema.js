const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const passportLocalMongoose = require ("passport-local-mongoose");
// console.log(passportLocalMongoose);

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true,
    },

});

userSchema.plugin(passportLocalMongoose.default);

const User =  mongoose.model("User", userSchema);

module.exports = User;