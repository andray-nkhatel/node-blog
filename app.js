const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer")

app.use(methodOverride("_method"))
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(expressSanitizer());
mongoose.connect("mongodb://localhost/mongoose_basics",{ useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false},(err)=>{
    if(err) throw err;
    console.log("Successfully connected");
});

// SCHEMA
let storySchema = mongoose.Schema({
    image: String, 
    name: String,
    content: String,
    created: {type:Date, default: Date.now}
});

let Story = mongoose.model('Story', storySchema);

// ROUTES
app.get("/", (req,res)=>{
    Story.find({},(err,saved)=>{
        if (err) throw err;
        console.log(saved);
        res.render("index",{data:saved});
    })
    
})

app.get("/show/:id",(req,res)=>{
    Story.findById(req.params.id, (err, result)=>{
        if(err) throw err;
        res.render("show", {data:result})
    })
    
})

app.get("/new", (req,res)=>{
    res.render("new")
})


app.post("/new", (req,res)=>{
    console.log(req.body);
    req.body.story.content = req.sanitize(req.body.story.content);
    Story.create(req.body.story, (err, newStuff)=>{
        if(err) throw err;
        res.redirect("/")
    })
})

app.get("/edit/:id",(req,res)=>{
    Story.findById(req.params.id, (err,single)=>{
        if(err) throw err;
        res.render("edit", {data: single});
    })

})



app.put("/show/:id",(req,res)=>{
    Story.findByIdAndUpdate(req.params.id, req.body.story, (err,edited)=>{
        if(err) throw err;
        res.redirect('/show/' + req.params.id);
    })

})



app.delete("/delete/:id", (req,res)=>{
   Story.findByIdAndRemove(req.params.id, (err)=>{
        if(err) throw err;
        console.log("Deleted")
        res.redirect("/");
    })
})

app.listen(8080, ()=>{
    console.log("Server Working!");
})