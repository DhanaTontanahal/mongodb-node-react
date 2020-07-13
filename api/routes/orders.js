const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');


router.get('/', (req, res, next) => {

    Order.find().
        select('product quantity _id').
        //to fetch all properties of products
        // populate('product').
        populate('product', 'name').
        exec().then(result => {
            res.status(200).json({
                count: result.length,
                orders: result.map(order => {
                    return {
                        _id: order._id,
                        product: order.product,
                        quantity: order.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + order._id
                        }
                    }
                }),


            });
        }).catch(err => {
            res.status(404).json({})
        })

    // res.status(200).json({
    //     message: 'Handling get requests to /orders'
    // })
})

router.post('/', (req, res, next) => {


    Product.findById(req.body.productId)
        .then(result => {

            if (!result) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });

            return order.save();



        })
        .then(result => {
            console.log("Order placed successfully " + result);
            res.status(201).json({
                message: 'Order placed successfully',
                createdOrder: {
                    _id: result._id,
                    quantity: result.quantity,
                    product: result.product
                },
                request: {
                    type: 'GET',
                    url: "http:localhost:3000/orders/" + result._id
                }
            })
        }).catch(err => {
            console.log("Error while placing the order ");
            res.status(500).json({ error: err })
        });




    // const order={
    //     productId:req.body.productId,
    //     quantity:req.body.quantity
    // }


    // res.status(201).json({
    //     message: 'Handling post requests to /orders',
    //     order:order
    // })
})

router.get('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById(orderId).
        populate('product').
        exec().
        then(result => {
            if (!result) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json({
                order: result,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'
                }
            })
        }).
        catch(err => {
            res.status(500).json({
                error: err
            })
        })
    // if (orderId === 'special') {
    //     res.status(200).json({
    //         message: 'special orderId',
    //         id: orderId
    //     })
    // }
    // else {
    //     res.status(200).json({
    //         message: 'id passsed for order'
    //     })
    // }
})


router.delete('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId;
    Order.remove({ _id: orderId }).exec().
        then(result => {
            res.status(200).json({
                message: 'Order deleted successfully',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { productId: 'ID', quantity: 'Number' }
                }
            })
        }).
        catch(err => {
            res.status(500).json({
                error: err
            })
        })
    // res.status(200).json({
    //     message: 'deleted orders',
    //     id: orderId
    // })
})


module.exports = router;
