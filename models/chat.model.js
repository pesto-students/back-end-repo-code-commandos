const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chat = new Schema({
    users:[
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
},{timestamps:true});


module.exports = mongoose.model("Chat",chat);