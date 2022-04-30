const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// process.env.PORT for heroku 
const port = process.env.PORT || 5000;
// middleware 
app.use(cors());
app.use(express.json());
// load data from database 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kzcfs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// load data from database 
async function run() {

    try {
        await client.connect();
        const serviceCollection = client.db('pcRepair').collection('service');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        // for find service by id 
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
           
        });
        app.post('/service', async(req,res)=>{
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);

// root
app.get('/', (req, res) => {
    res.send('Runnnging PC service');
});
app.listen(port, () => {
    console.log('Listing to port', port);
});
