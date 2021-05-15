const router = require("express").Router();
const User = require("../models/User");
const Batch = require("../models/Batch");
const bcrypt = require("bcrypt");

router.post("/login", async (req,res) => {

    try{
        const user = await User.findOne({username:req.body.username});
        !user && res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password");
        res.status(200).json(user);
    } catch(err){
        res.status(500).json(err);
    }
    
});

router.post("/create_user", async (req,res) => {

	try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
		const newUser = new User({
			name : req.body.name,
			username : req.body.username,
			email : req.body.email,
			age : req.body.age,
			password : hashedPassword,
            mobile_number : req.body.mobile_number,
			batchesId : req.body.batchesId, //"6093c2d48cf4d01e9c62268f"   "6093caecab066b0220147a1c"
		});

		// Save Batch and response
		const user = await newUser.save();
		res.status(200).json(user);

	}catch(err){
		res.status(500).json(err);

	};

});

// Add batch id to given user object
const addBatchIdtoUser = (batchId,userId) => {
     User.findByIdAndUpdate(userId,{ $addToSet: { batchesId: [batchId] } },(err,result) => {
        if(err){
            console.log(err);
            console.log("------- addBatchIdtoUser() Not updated -------");
        }
        else{
            console.log(result);
            console.log("------- addBatchIdtoUser() Successfully Added -------");
        }
    });
}


// Create a batch under given user
router.post("/create_batch/:id", async (req,res) => {
    const id = req.params.id; //user id
    try{
        const newBatch = new Batch({
            name : req.body.name,
            description : req.body.description,
            superAdmin : id,
            numberofPeople: 1,

        });

        // Save Batch and response
        await newBatch.save().then((batch) => {
            console.log(batch._id,batch.superAdmin);
            addBatchIdtoUser(batch._id,batch.superAdmin);
            res.status(200).json(batch);
        }).catch((err) => {
            res.status(500).json(err);
        });
        
        

    }catch(err){
        res.status(500).json(err);

    };

});

// Get user object with all batches
router.get("/get-all-batches", async(req,res) => {
    const id = req.body.userId;
    
    User.findById(id)
    .then((result) => {
        
        console.log(result.batchesId)
        //res.status(200).json(result);
        let arrbatches = [];

        
        var i = 0;
        for (let x of result.batchesId){
        	
        		Batch.findById(x)
                .then((b) => {
        		arrbatches.push(JSON.parse(JSON.stringify(b)));
        		//console.log(b);
                i += 1;
                if(result.batchesId.length == i){
                    let copiedResult = JSON.parse(JSON.stringify(result));
                    copiedResult.arrbatches = arrbatches;
                    console.log(copiedResult);
                    res.status(200).json(copiedResult);
                }
            }).catch((err) => {
        		console.log(err);
                i += 1
        	});
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json("User not found");
	});   
});


// Get user object
router.get("/get-user", async(req,res) => {
    const id = req.body.userId;
    console.log("hey");
    User.findById(id)
    .then((result) => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json("User not found");
	});

});



router.get("/", (req,res) => {
    res.send("Hey it's Users route")
});
module.exports = router;