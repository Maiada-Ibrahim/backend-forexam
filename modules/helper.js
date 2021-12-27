const axios = require('axios');
const mongoose = require('mongoose');
module.exports = { handleGetData, handleAddingData, handleGetCollection, handleGetUserCollection, handleDeletingData,handleDeletingCollections };

let arrayofcollection = [];
const threeDSchema = new mongoose.Schema({
    title: String,
    modelCollection: String,
    email: String,
    thumbnail: String,
    collectionOfModels: String
});

const threeDModel = mongoose.model('alldata', threeDSchema);

let arr = [];

//localhost:3001/models?title=
async function handleGetData(req, res) {
    let nameOfModel = req.query.title
    let url = `https://api.sketchfab.com/v3/search?type=models&q=${nameOfModel}%20&animated=false`
    try {
        let data = await axios.get(url)
        data.data.results.map((item, index) => {
            let modelData = new modelClass(item.name, item.embedUrl, 'cars', item.thumbnails.images[0].url, 'tasneem.alabsi@gmail.com', index);
            arr.push(modelData);
        }

        )
        res.send(arr);
        arr = [];
    }
    catch (error) {
        console.log('THE ERROR IS HHHHHHHHH :', error);
        res.send(error);
    }

}


function seedModelData(collectionType) {
    const threeDModel = mongoose.model(collectionType, threeDSchema);
    let saveModel = arr.map(item => {
        const models = new threeDModel({
            title: item.modelName,
            modelCollection: item.modelUrl,
            email: 'tasneem.alabsi@gmail.com',
            collectionOfModels: collectionType,
            thumbnail: item.thumbnails.images[0].url
        })
        models.save();
    })



}

async function handleAddingData(req, res) {

    let { title, modelUrl, email, collectionName, thumbnail } = req.body;

    arrayofcollection.push(threeDModel)
    await threeDModel.create({ title: title, modelCollection: modelUrl, email: email, collectionOfModels: collectionName, thumbnail: thumbnail })


    threeDModel.find({ email }, function (err, ownerData) {
        if (err) {
            console.log('error in getting the data')
        } else {
            res.send(ownerData)
        }

    })
}




function handleGetUserCollection(req, res) {

    let email = req.query.email;
    let collection = req.query.collection;
    threeDModel.find({ email: email, collectionOfModels: collection }, function (error, threeDInfo) {
        if (error) {
            console.log('error in getting the data')
        } else {
            res.send(threeDInfo)
        
        }
    })

}




function handleGetCollection(req, res) {

    let email = req.query.email;
    threeDModel.find({ email }, function (error, threeDInfo) {
        if (error) {
            console.log('error in getting the data')
        } else {
            res.send(threeDInfo)
      
        }
    })

}


function handleDeletingData(req, res) {
    let email = req.query.email;
    let modelID = req.params.modelID2;
    let collection = req.query.collection;
   
    threeDModel.remove({ _id: modelID }, (error, modelData1) => {
        if (error) {
            console.log('error in deleteing the data', error)
            // console.log();
        } else {
            console.log('data deleted', modelData1)
            threeDModel.find({ email:email,collectionOfModels:collection }, function (error, modelData) {
                if (error) {
                    console.log('error in getting the data')
                } else {
                    console.log(modelData)
                    res.send(modelData)
                    
                }
            })
        }
    })
}


function handleDeletingCollections(req, res) {
    let email = req.query.email;
    let collection = req.params.collection;
    threeDModel.remove({ collectionOfModels: collection }, (error, modelData1) => {
        if (error) {
            console.log('error in deleteing the data', error)
            // console.log();
        } else {
            console.log('data deleted', modelData1)
            threeDModel.find({ email:email }, function (error, modelData) {
                if (error) {
                    console.log('error in getting the data')
                } else {
                    console.log(modelData)
                    res.send(modelData)
                }
            })
        }
    })
}


class modelClass {
    constructor(modelName, modelUrl, modelCollection, thumbnail, email, key) {
        this.modelName = modelName;
        this.modelUrl = modelUrl;
        this.thumbnail = thumbnail;
        this.modelCollection = modelCollection;
        this.email = email;
        this.key = key

    }
}