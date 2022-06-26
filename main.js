var express = require('express')
const async = require('hbs/lib/async')
var app = express()
const { ObjectId } = require('mongodb')
const mongo = require('mongodb')

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

var MongoClient = require('mongodb').MongoClient

var url = 'mongodb+srv://beobeo114:beobeo114@cluster0.jbvsge5.mongodb.net/test'

app.get('/', async(req,res)=>{
    res.render('home')
})

app.get('/create',async(req,res)=>{
    res.render('NewProduct')
})

app.post('/ascending', async(req,res)=>{
    let sortPrice = req.body.txtPrice

    let server = await MongoClient.connect(url)

    let dbo = server.db("MuStore")

    let products = await dbo.collection('product').find({'name': new RegExp(sortPrice,'i')}).sort({'price': 1}).toArray()

    res.render('AllProduct', {'product': products})
})

app.post('/decrease', async(req,res)=>{
    let sortPrice = req.body.txtPrice

    let server = await MongoClient.connect(url)

    let dbo = server.db("MuStore")

    let products = await dbo.collection('product').find({'name': new RegExp(sortPrice,'i')}).sort({'price': -1}).toArray()

    res.render('AllProduct', {'product': products})
})

app.post('/search', async(req,res)=>{
    let name = req.body.txtName

    let server = await MongoClient.connect(url)

    let dbo = server.db("MuStore")

    let products = await dbo.collection('product').find({'price': new RegExp(name)}).toArray()

    res.render('AllProduct', {'product': products})
})

app.post('/AddProduct', async(req,res)=>{
    let name = req.body.txtName
    let price = req.body.txtPrice
    let description = req.body.txtDescription
    let image = req.body.txtImage
    let product = {
        'name' : name,
        'price' : price,
        'description' : description,
        'image': image
    }
    // if (name.length <= 6) {
    //     res.render('NewProduct', { 'nameError': 'Name field must be more than 5 character' })
    //     return
    // }
    // if (description.length <=3) {
    //     res.render('NewProduct', { 'DesError': 'Name field must be more than 5 character' })
    //     return
    // }
    let client = await MongoClient.connect(url)
    let dbo = client.db("MuStore")
    await dbo.collection("product").insertOne(product)
    res.redirect('/viewAll')
})

app.get('/delete', async(req,res)=>{
    let id = mongo.ObjectId(req.query.id)
    const client = await MongoClient.connect(url);
    let dbo = client.db("MuStore");
    let collection = dbo.collection('product');
    let products = await collection.deleteOne({'_id': id});
    console.log(id)
    res.redirect('/viewAll')
})

app.get('/update', async(req,res)=>{
    let id = req.query.id
    const client = await MongoClient.connect(url)
    let dbo = client.db("MuStore")

    let products = await dbo.collection("product").findOne({ _id: ObjectId(id)})
    console.log(products)
    res.render('update', {'products':products})
})

app.post('/updateProduct', async(req,res)=>{
    let id = req.body._id
    let name = req.body.txtName
    let price = req.body.txtPrice
    let description = req.body.txtDescription
    let image = req.body.txtImage

    let client = await MongoClient.connect(url);
    let dbo = client.db("MuStore")

    await dbo.collection("product").updateOne({ _id:ObjectId(id) } ,{
        $set : {
            'name' : name,
            'price' : price,
            'description' : description,
            'image': image
        }
    })
    res.redirect('/viewAll')
})

app.get('/viewAll', async(req,res)=>{
    let client = await MongoClient.connect(url)
    let dbo = client.db("MuStore")
    let products = await dbo.collection("product").find().toArray()
    res.render('AllProduct', {'product': products})
})

const PORT = process.env.PORT || 8000
app.listen(PORT)
console.log("Siuuuuuuuuu")