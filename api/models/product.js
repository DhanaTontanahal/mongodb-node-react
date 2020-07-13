const mongoose = require('mongoose');

//design of the layout of model || blueprint of model
const productSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
        //mongoose validations
    name:{type:String , required:true},
            //mongoose validations
    price:{type:Number , required:true}
});

module.exports = mongoose.model('Product',productSchema);