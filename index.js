const http = require('http');
var express=require("express");
var bodyParser=require('body-parser');
var session = require('express-session');
var cors = require('cors');
var url = require('url') ;



const hostname = '127.0.0.1';
const port = 3003;


var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.options('*',cors());
app.use(function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

var shortUrlController=require('./controllers/shorturl-controller');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function (req, res) {  
  console.log(req.params); 
});  
 
 


app.post('/api/shorturl',shortUrlController.shorturl)
app.get('/api/shorturllist',shortUrlController.shorturllist,function(err,res){
    res.send(res.body);
});

app.get('/short/:link_name',shortUrlController.short,function(err,res){
  res.send(res.body);
});


app.listen(3003);


