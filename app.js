const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'; 
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js")
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"./public")));
main().then(()=>{
    console.log("Connected to db");
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect(MONGO_URL);
}
app.get("/",(req,res)=>{
    res.send("Hi,I am root");
})
// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By The Beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Succesful testing");
// })
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
    })
//new routes
 app.get("/listings/new",(req,res)=>{
        res.render("./listings/new.ejs");
    })
    //create route
    app.post("/listings",wrapAsync(async(req,res,next)=>{
    
        const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    
})
)
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
})
    // show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
})
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
})
app.delete("/listings/:id",async(req,res)=>{
    let { id } = req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
app.use((err,req,res,next)=>{
    res.send("something went wrong!");
})
app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
}); 