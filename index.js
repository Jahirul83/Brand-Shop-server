const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

// brandDB
// XdC09yw2oeeqwlxj




// const uri = "mongodb+srv://brandDB:XdC09yw2oeeqwlxj@cluster0.i3hf6sp.mongodb.net/?retryWrites=true&w=majority";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i3hf6sp.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const productCollection = client.db('productDB').collection('products');
        const cartCollection = client.db('productDB').collection('cart');


        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        app.put('/products/:id', async (req, res) => {
            id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedProduct = req.body;
            const product = {
                $set: {
                    name: updatedProduct.name,
                    brandName: updatedProduct.brandName,
                    type: updatedProduct.type,
                    price: updatedProduct.price, description: updatedProduct.description,
                    rating: updatedProduct.rating
                }
            }
            const result = await productCollection.updateOne(filter, product, options)
            res.send(result);
        })

        app.post('/products', async (req, res) => {

            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);

        })

        // cart related api
        app.post('/carts', async (req, res) => {
            const addedToCart = req.body;
            console.log(addedToCart);
            const result = await cartCollection.insertOne(addedToCart);
            res.send(result)
        })

        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete id',id);
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query);
            // console.log(result,query,id);
            res.send(result);
        })

        app.get('/carts', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Brand Shop server is running');
})


app.listen(port, () => {
    console.log(`Brand shop app listening on port ${port}`);
})
