var express = require('express')
var hbs = require('hbs')

var app = express()

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'hbs')

var url = 'mongodb://localhost:27017'; // CẦN ĐỊA CHỈ ĐỂ KẾT NỐI
var MongoClient = require('mongodb').MongoClient;

app.post('/update', async (req, res) => {
    let id = req.body.txtId;
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let newValues = { $set: { name: nameInput, price: priceInput } };
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };
    let client = await MongoClient.connect(url);
    let dbo = client.db("Test123");
    await dbo.collection("product").updateOne(condition, newValues);
    res.redirect('/');

})

app.get('/edit', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };
    let client = await MongoClient.connect(url);
    let dbo = client.db("Test123");
    let productToEdit = await dbo.collection("product").findOne(condition);
    res.render('edit', { product: productToEdit })

})

app.get('/delete', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("Test123");

    await dbo.collection("product").deleteOne(condition);
    res.redirect('/')
})

app.post('/search', async (req, res) => { // chức năng tìm kiếm sản phẩm
    let client = await MongoClient.connect(url);
    let dbo = client.db("Test123");
    let nameInput = req.body.txtName;
    let searchCondition = new RegExp(nameInput, 'i') // dòng này để thực hiện lệnh khi tìm kiếm sản phẩn không rõ vẫn có thể tìm được
    let results = await dbo.collection("product").find({ name: searchCondition }).toArray(); // thay find vào "name:nameInput" thì sẽ tìm được sản phẩm đúng ý,
    res.render('index', { model: results })
})

app.get('/', async (req, res) => { // DÙNG async để đồng bộ
    let client = await MongoClient.connect(url);
    let dbo = client.db("Test123");
    let results = await dbo.collection("product").find({}).toArray();
    res.render('index', { model: results })
})

//taoj file insert
app.get('/insert', (req, res) => {
    res.render('newProduct')
})

app.post('/doInsert', async (req, res) => { //dungf async để luôn đc đồng bộ
    var nameInput = req.body.txtName;
    var priceInput = req.body.txtPrice;
    var newProduct = { name: nameInput, price: priceInput };

    let client = await MongoClient.connect(url); // liên kết đến mogoclient
    let dbo = client.db("Test123"); // liên kết đến tên local host
    await dbo.collection("product").insertOne(newProduct);
    res.redirect('/')
})

app.listen(3000);
console.log('server is running at 3000')