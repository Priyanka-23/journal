var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var sessions=require('express-session');
var MongoStore=require('connect-mongo')(sessions);
var app=express();
//object of the database to authenticate
var options={
    user:'myAuthor',
    pass:'journal123'
}
//connecting to database
mongoose.connect('mongodb://localhost/journaldb', options);
var db=mongoose.connection;

//handle mongodb error
db.on('error', console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log('we are connected');
})
//use session for tracking logins
app.use(sessions({
    secret:'pt2310',
    resave:true,
    saveUninitialized:false,
    store: new MongoStore({
        mongooseConnection:db
    })

}))
//middlewares to parse the incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//server static file from template
app.use(express.static(__dirname+'/views'))



//including routes
var routes=require('./routes/router');
app.use('/',routes);

app.get('/hindi',function(req,res){
    res.sendFile(__dirname+'/views/hindi.html')
})

app.listen(3000,function(){
    console.log("the server is running at port 3000")
})