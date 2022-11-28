const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require("stripe")(process.env.STRIP_SECRET_KEY)

// middleWare-
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tukbsww.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//Homepage service collection-
async function homePageServices(){
  const homePageServicesCollections = client.db('daily-deal-cars').collection('homePageCarCategories')
  try{
    app.get('/services', async(req, res)=>{
      const query = {}
      const cursor = homePageServicesCollections.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
  }
  catch{
    err=>console.error('this ishomePageServices error:', err)
  }
  finally{

  }
}
homePageServices()
.catch(err=>console.error('This is out of the function error: ',err))




//Product Collection-
async function Products(){
  const ProductsCollection = client.db('daily-deal-cars').collection('products')
  try{
    app.post('/categories', async(req, res)=>{
      const product = req.body;
      console.log(product);
      const result  = await ProductsCollection.insertOne(product)
      res.send(result)
    })
    app.delete('/categories/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await ProductsCollection.deleteOne(query)
      res.send(result)
    })
    app.get('/categories/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {categories_id: parseInt(id)}
      const cursor = ProductsCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/categories', async(req, res)=>{
      const userEmail = req.query.email;
      const query = {seller_email: userEmail}
      const cursor = ProductsCollection.find(query);
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/categories_advertise', async(req, res)=>{
      const query = {advertise: true}
      const cursor = ProductsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
    })
    app.put('/categories/:id', async(req, res)=>{
      const productId = req.params.id;
      const filter = {_id: ObjectId(productId)}
      const updatedDoc = { $set: {advertise: true}}
      const result = await ProductsCollection.updateOne(filter, updatedDoc)
      res.send(result)
      console.log(productId);
    })
  }
  catch{
    err=>console.error('this Product error:', err)
  }
  finally{

  }
}
Products()
.catch(err=>console.error('This is out of the function Products error: ',err))


//

//user Collection-
async function User(){
  const UserCollection = client.db('daily-deal-cars').collection('user')
  try{
    app.post('/user', async(req, res)=>{
      const user = req.body;
      const result = await UserCollection.insertOne(user)
      res.send(result)
    })
    app.get('/user', async(req, res)=>{
      const userEmail = req.query.email;
      const query = {email: userEmail}
      const result = await UserCollection.findOne(query)
      res.send(result)
    })
    app.get('/user/:category', async(req, res)=>{
      const category = req.params.category;
      const query = {userCategory: category}
      const cursor = UserCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.delete('/user/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await UserCollection.deleteOne(query)
      res.send(result)
    })
    app.put('/user/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: ObjectId(id)}
      const updateDoc = { $set : {verification: 'verified'}}
      const result = await UserCollection.updateOne(filter, updateDoc)
      res.send(result)
    })
  }
  catch{
    err=>console.error('this user error:', err)
  }
  finally{

  }
}
User()
.catch(err=>console.error('This is out of the function user error: ',err))



//booking Collection-
async function Booking(){
  const BookingCollection = client.db('daily-deal-cars').collection('booking')
  const PaymentsCollection = client.db('daily-deal-cars').collection('payments')
  try{
    app.post('/booking', async(req, res)=>{
      const user = req.body;
      const result = await BookingCollection.insertOne(user)
      res.send(result)
    })
    app.get('/booking', async(req, res)=>{
      const userEmail = req.query.email;
      const query = {userEmail: userEmail}
      const cursor = BookingCollection.find(query)
      const result = await cursor.toArray()
      res.send(result) 
    })
    app.delete('/booking/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await BookingCollection.deleteOne(query)
      res.send(result)
    })
    app.get('/booking/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await BookingCollection.findOne(query)
      res.send(result)
    })


    app.post("/payments/create-payment-intent", async (req, res) => {
      try {
        const { reSellPrice } = req.body;
        console.log(reSellPrice);
        const amount = Number(reSellPrice * 100);
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          "payment_method_types": [
            "card"
          ],
        });
    
        res.send({
          success: true,
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        console.log(error.name, error.message);
        res.send({
          success: false,
          error: error.message
        })
      }
    });



    
  // Save payment information
  app.post('/payments',  async (req, res) => {
    try {
      const payment = req.body;
      const result = await PaymentsCollection.insertOne(payment);

      const id = payment.bookingId;
      const filter = { _id: ObjectId(id) }
      const updateDoc = {
        $set: {
          paid: true,
          transactionId: payment.transactionId,
        }
      }

      const udpdatedResult = await BookingCollection.updateOne(filter, updateDoc);

      res.send({
        success: true,
        data: result
      })
    } catch (error) {
      console.log(error);
      res.send({
        success: false,
        error: error.message
      })
    }
  })
  }
  catch{
    err=>console.error('this booking error:', err)
  }
  finally{

  }
}
Booking()
.catch(err=>console.error('This is out of the function booking error: ',err))






























app.get('/', (req, res)=>res.send('daily-deal-cars-server is runing....'))
app.listen(port)