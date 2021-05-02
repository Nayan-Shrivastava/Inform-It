const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const batchesRoute = require("./routes/batches");
const usersRoute = require("./routes/users");
const sectionsRoute = require("./routes/sections");
// Port Number
const port = 8000;

dotenv.config();

/*
// Connect to DB
mongoose.connect(process.env.MONGO_URL ,{ useNewUrlParser: true, useUnifiedTopology: true },() => {
    console.log('Connected to MONGO DB')
});
*/
// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.set('view engine','ejs');



app.use("/api/batches",batchesRoute);
app.use("/api/users",usersRoute);
app.use("/api/sections",sectionsRoute);
//app.use("/api/batches",batchesRoute);
//app.use("/api/auth",authRoute);

// Home Page
app.get("/api", (req,res) => {
    
    res.render('index');
});




// Listen on port 5000
app.listen(port,() => console.log(`Listening on port ${port}`))
