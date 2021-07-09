const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,  // remove white spaces from both end if present
        unique:true,
        required:true,
        maxlength:32
    }
},{timestamps:true})

const Category = mongoose.model('category',categorySchema)

module.exports = Category