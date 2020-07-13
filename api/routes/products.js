const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

//handles incoming get requests '/products' from the app.js middle where
//check app.js

router.get('/', (req, res, next) => {

    Product.find()
    
    .select('name price _id')
    .exec()
    .then(docs=>{

        // console.log("Retrieving all products from dataase "+docs);

        const response={
            count:docs.length,
            products:docs.map(doc=>{
                return{
                    name:doc.name,
                    price:doc.price,
                    _id:doc._id,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/products/'+doc._id
                    }
                }
            })

        };

        res.status(200).json(response);
    })
    .catch(err=>{
        console.log("problem in retrieving all products"+err);

        res.status(500).json({
            error:err
        });

    })
    // res.status(200).json({
    //     message: 'Handling get requests to /products'
    // })
})


router.post('/', (req, res, next) => {
    // const product={
    //     //with body parser , you have the body property on incoming request
    //     name:req.body.name,
    //     price:req.body.price
    // };

    const product = new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
    });

    product.save().then(result=>{
        console.log("Tried to post this to database "+result);

        res.status(201).json({
            message: 'Handling post requests to /products',
            createdProduct:result
        })

    }).catch(err=>{
        console.log("Error while creating new product"+err);
        res.status(500).json({
            error:err
        })
    });

    
})

router.get('/:productId', (req, res, next) => {
    const producidtId = req.params.productId;

    Product.findById(producidtId).exec().then(doc=>{
        console.log("Retrieved from database"+doc);
        if(doc){
            res.status(200).json(doc);
        }
        else
        {
            res.status(404).json({message:"No valid entry found"});
        }
        

    }).catch(err=>{
        console.log("Unable to retrieve the product :"+err);
        res.status(500).json({error:err})
    });
    // if (producidtId === 'special') {
    //     res.status(200).json({
    //         message: 'special products',
    //         id: producidtId
    //     })
    // }
    // else {
    //     res.status(200).json({
    //         message: 'id passsed for product'
    //     })
    // }
})


router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    //dynamic approach for supporting dynamic updates
    //sometimes only one or more properties values might chaneg
    //to avoid like static upate in line commented just above
    //you may not know if only nam ei supdated or both or updated
    for(const op of req.body){
        console.log("Iterating the given request body ==>"+JSON.stringify(op))
        console.log(op[op.propName]);
        updateOps[op.propName]=op[op.propName];
    }
    // Product.update({_id:id},{ $set:{name:req.body.newName,price:req.body.newPrice} });
    Product.update({_id:id},{ $set:updateOps }).exec()
    .then(result=>{
        console.log("tried updating the product "+JSON.stringify(result));
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log("error while updating the product "+err);
        res.status(500).json({
            error:err
        });

    })


        // res.status(200).json({
        //     message: 'updated products',
        //     id: producidtId
        // })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id:id}).exec().then(result=>{
        console.log("Tried deleting the product "+result);
        res.status(200).json(result);
    }).catch(err=>{
        console.log("Error deleting the product");
        res.status(500).json({error:err});
    })
        // res.status(200).json({
        //     message: 'deleted products',
        //     id: producidtId
        // })
})


module.exports = router;
