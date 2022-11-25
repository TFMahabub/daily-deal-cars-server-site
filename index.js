const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

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
    app.get('/categories/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {categories_id: parseInt(id)}
      const cursor = ProductsCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
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
  try{
    app.post('/booking', async(req, res)=>{
      const user = req.body;
      const result = await BookingCollection.insertOne(user)
      res.send(result)
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