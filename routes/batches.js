const router = require("express").Router();
const Batch = require("../models/Batch");
const Section = require("../models/Section");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {verifyToken,verifyUser} = require("../auth"); 

// Add Section id to given Batch object
const addSectionIdtoBatch = (sectionId,batchId) => {
     Batch.findByIdAndUpdate(batchId,{ $addToSet: { sectionId: [sectionId] } },(err,result) => {
        if(err){
            console.log(err);
            console.log("------- addSectionIdtoBatch() Not updated -------");
        }
        else{
            console.log(result);
            console.log("------- addSectionIdtoBatch() Successfully Added -------");
        }
    });
}


// Create a Section under given Batch
router.post("/create-section/",verifyToken, async (req,res) => {
    verifyUser(req,res,(authData) => {
        userId = authData._id;   
    });    
        //const userId = req.body.userid; //user id
        const batchId = req.body.batchId; //user id
        try{
            const batch = await Batch.findById(batchId);
            if(!batch){
                res.status(200).json( { error : "batch not found"} );
            }else{
                //if(batch.adminId.includes(userId) || batch.superAdmin === userId){
                    try{
                        const newSection = new Section({
                            name : req.body.name,
                            description : req.body.description,
                            batchId : req.body.batchId
                        });

                        // Save section and response
                        await newSection.save().then((section) => {
                            console.log(section._id,section.batchId);
                            addSectionIdtoBatch(section._id,section.batchId);
                            res.status(200).json(section);
                        }).catch((err) => {
                            res.status(500).json(err);
                        });

                    }catch(err){
                        res.status(500).json(err);

                    };
    /*
                }else{
                    res.status(400).json("user is not admin");
                }
    */
            }
    }catch(err){
        console.log(err)
        res.status(200).json({
            error : "batch not found"
        });
    }
});

// Get batch object with all it's sections
router.post("/get-all-sections",verifyToken, async(req,res) => {
    verifyUser(req,res,(authData) => {

        const id = req.body.batchId;
        
        Batch.findById(id)
        .then((result) => {
            
            console.log(result.sectionId)
            //res.status(200).json(result);
            let arrsections = [];

            
            var i = 0;
            for (let x of result.sectionId){
            	
            		Section.findById(x)
                    .then((b) => {
            		arrsections.push(JSON.parse(JSON.stringify(b)));
            		//console.log(b);
                    i += 1;
                    if(result.sectionId.length == i){
                        let copiedResult = JSON.parse(JSON.stringify(result));
                        copiedResult.arrsections = arrsections;
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
            res.status(200).json({"error": "Batch not found"});
    	}); 
    });  
});



// Get Batch object
router.post("/get-batch",verifyToken, async(req,res) => {
   verifyUser(req,res,(authData) => {
       const id = req.body.batchId;
        Batch.findById(id)
        .then((result) => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(404).json("batch not found");
         });
    });    
});




router.get("/", (req,res) => {
    res.send("Hey it's Batches route")
});




module.exports = router;



// https://stackoverflow.com/questions/15128849/using-multiple-parameters-in-url-in-express#:~:text=Such%20a%20request%20will%20return%20a%20JSON%20response.&text=I%20have%20configured%20express%20to,data%20as%20above%20using%20request.