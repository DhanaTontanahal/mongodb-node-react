const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')

mongoose.connect('mongodb+srv://dhana:'+process.env.MONGO_ATLAS_PW +'@cluster0.3sgac.mongodb.net/<dbname>?retryWrites=true&w=majority');

app.use(morgan('dev'));
// url encoded body parser 
app.use(bodyParser.urlencoded({extended:false}));
//parse json
app.use(bodyParser.json());
//Routes to handle requests

//handle cors

// CORS -security mechanism imposed by browser
//we can restrict the domains who can access the APIs
//Postman is not browser , so we dont get cors issue with post man

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, Authorization, Content-Type ,Acccept, X-Requested-With");

    //if there is post or put request , the browser first send the options request
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', "PUT , POST , DELETE , PATCH");
        return res.status(200).json({})
    }

    next();
});
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
//sets up the middle ware
//all requests will go through this middle ware
//next is used to move request to next middle ware (if there)
// app.use((req,res,next)=>{

//     res.status(200).json({
//         message:'It works'
//     });
// })

//If the control has reached here
//meaning that the routes given in request are not handled in code

app.use((req,res,next)=>{
    const error= new Error('Not found');
    error.status=404;
    next(error);
});

//for any request which is throwing error from it's subsequest request to let us say Database
//the below handles those errors

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
});




module.exports=app;