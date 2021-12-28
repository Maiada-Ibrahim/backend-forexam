const express = require('express');
const cors = require('cors');
const server = express();
server.use(cors())


require('dotenv').config();
server.use(express.json());
const axios = require('axios')

const {handleGetData,handleAddingData,handleGetCollection, handleGetUserCollection,handleDeletingData,handleDeletingCollections} = require('./modules/helper.js');

const mongoose = require('mongoose');
mongoose.connect('mongodb://maiadadb:0000@cluster0-shard-00-00.ii9w9.mongodb.net:27017,cluster0-shard-00-01.ii9w9.mongodb.net:27017,cluster0-shard-00-02.ii9w9.mongodb.net:27017/seller?ssl=true&replicaSet=atlas-114hrc-shard-0&authSource=admin&retryWrites=true&w=majority');
// mongoose.connect(process.env.mongo);


const PORT = 3001;

const choc = new mongoose.Schema({
    name: 'string',
    email:'string',
    location:'string',
    imageUrl: 'string',
    prodectName: 'string',
    prodectImg:'string',
    price:'string',
    description:'string',
    time:'string',
    date:'string',
    statusForThis:'string',
    sellerEmail:'string'
});
const chocmodel = mongoose.model('chockmodel', choc);




server.get("/test", handeltest)
function handeltest(req, res) {
    res.send("Hello from server!");
}



server.get('/getalldata', async function (req, res, next) {

    let email = req.query.email
    try {
        const resp = await axios.get('http://localhost:5121/users');
        console.log(resp.data);
        res.send(resp.data)

    } catch (err) {
        console.error(err);
    }
  
});

server.post('/adduserdata', async function (req, res, next) {
    let { name, imageUrl, email,prodectName,prodectImg,date,time,description,price,location,statusForThis,sellerEmail} = req.body
    await chocmodel.create(req.body).then(function (student) {
    }).catch(next);

    chocmodel.find({ email }, function (err, userdata) {

        if (err) { console.log(err) }

        else {
            res.send(userdata);
        }
    })

});

server.put('/updatedata/:id', async   function(req,res,next){
    let { name, imageUrl, email,prodectName,prodectImg,date,time,description,price,location,statusForThis,sellerEmail} = req.body
id=req.params.id
 await   chocmodel.findOneAndUpdate({_id: id},req.body).then(async   function(student){

 await       chocmodel.findOne({_id: id}).then(function(student){
        });
    });
    await  chocmodel.find({ email:email },async function (err, userdata) {

        if (err) { console.log(err) }
        else {
            res.send(userdata);
        }

    })

});

server.delete('/deletedata/:id', async function (req, res, next) {
let email=req.query.email
    let id = req.params.id

    await chocmodel.findOneAndDelete({ _id: id }).then(function (student) {
    });

    await  chocmodel.find({ email }, function (err, userdata) {

        if (err) { console.log(err) }

        else {
            res.send(userdata);


        }

    })

});



server.get('/getuserdata',handelgetuserdata)
async  function handelgetuserdata(req, res) {
    let email = req.query.email
    await  chocmodel.find({ email:email }, function (err, userdata) {

        if (err) { console.log(err) }

        else {
            res.send(userdata);


        }
    })

    res.send("Hello from server!");
}
server.get('/Seller', async function (req, res, next) {
    let name = req.query.title

    try {
        const resp = await axios.get('http://localhost:5121/users');
       
           let arr = []
    await    resp.data.map((element) => {
        console.log(element.name)
        console.log(name)
        if (name==element.name)
            arr.push(element)
        })
        res.send(arr)

    } catch (err) {
        console.error(err);
    }

});
server.get('/getsellerdata',handelgetsellerdata)
async  function handelgetsellerdata(req, res) {
    let sellerEmail = req.query.email
    await  chocmodel.find({ sellerEmail:sellerEmail }, function (err, userdata) {

        if (err) { console.log(err) }

        else {
            res.send(userdata);


        }
    })

    res.send("Hello from server!");
}

class Chocclass {
    constructor(name, imageUrl, email) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.email = email;
    }
}

server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});