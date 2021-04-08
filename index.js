const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x2r2l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express() 

app.use(express.json());
app.use(cors());

const port =process.env.PORT || 3001

app.get('/', (req, res) =>{
  console.log(process.env.DB_NAME);
  res.send('hello its working')
})





const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  // console.log(err)
  const productsCollection = client.db("assignmentBookVally").collection("products");
  const ordersCollection = client.db("assignmentBookVally").collection("orders");


  app.post('/addProducts', (req, res) => {
const products = req.body;
productsCollection.insertOne(products)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })


  app.get('/products', (req, res) => {
    productsCollection.find({}).limit(20)
    .toArray((err, documents) => {
      res.send(documents);
    })
  })


  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key}).limit(20)
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
productsCollection.find({key: { $in: productKeys}})
.toArray((err, documents) => {
  res.send(documents);
})

})


app.post('/addOrder', (req, res) => {
  const order = req.body;
  ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })

    app.get('/orders', (req, res) => {
      ordersCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
    })


    app.delete('/delete/:id', (req, res) =>{
      productsCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result =>{
        console.Console(result)
      })

    })




});


app.listen(process.env.PORT || port)