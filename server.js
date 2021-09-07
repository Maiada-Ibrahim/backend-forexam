const express = require('express');
const cors = require('cors');
const server = express();
server.use(cors())


require('dotenv').config();
server.use(express.json());
const axios = require('axios')


const mongoose = require('mongoose');
mongoose.connect('mongodb://maiadadb:0000@cluster0-shard-00-00.ii9w9.mongodb.net:27017,cluster0-shard-00-01.ii9w9.mongodb.net:27017,cluster0-shard-00-02.ii9w9.mongodb.net:27017/exam?ssl=true&replicaSet=atlas-114hrc-shard-0&authSource=admin&retryWrites=true&w=majority');
// mongoose.connect(process.env.mongo);


const PORT = 3001;



const choc = new mongoose.Schema({

    title: 'string',
    imageUrl: 'string',
    email: 'string'
});
const chocmodel = mongoose.model('chockmodel', choc);













server.get("/test", handeltest)
function handeltest(req, res) {
    res.send("Hello from server!");
}


// get a list of students from the database
server.get('/getalldata', async function (req, res, next) {

    let email = req.query.email
    try {
        const resp = await axios.get('https://ltuc-asac-api.herokuapp.com/allChocolateData');
        console.log(resp.data);
        // res.send(resp.data)
        let arr = []
    await    resp.data.map((element) => {


            let mydata = new Chocclass(element.title, element.imageUrl, email);
            arr.push(mydata)

        })


        res.send(arr)





    } catch (err) {
        // Handle Error Here
        console.error(err);
    }






    //  await   Student.find({}).then(function(students){
    //         res.send(students);
    //     }).catch(next);
});

// add a new student to database
server.post('/adduserdata', async function (req, res, next) {

    let { title, imageUrl, email } = req.body
    await chocmodel.create(req.body).then(function (student) {
        // res.send(student);
    }).catch(next);

    chocmodel.find({ email }, function (err, userdata) {

        if (err) { console.log(err) }

        else {
            res.send(userdata);


        }





    })





});

// update a student in the database
server.put('/updatedata/:id', async   function(req,res,next){

    let { title, imageUrl, email } = req.body
id=req.params.id
 await   chocmodel.findOneAndUpdate({_id: id},req.body).then(async   function(student){






 await       chocmodel.findOne({_id: id}).then(function(student){
            // res.send(student);
        });
    });

    await  chocmodel.find({ email:email },async function (err, userdata) {

        if (err) { console.log(err) }

        else {
            res.send(userdata);


        }





    })







});

// delete a student in the database
server.delete('/deletedata/:id', async function (req, res, next) {
let email=req.query.email
    let id = req.params.id

    await chocmodel.findOneAndDelete({ _id: id }).then(function (student) {
        // res.send(student);
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





























class Chocclass {
    constructor(title, imageUrl, email) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.email = email;

    }
}









server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});