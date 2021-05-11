const router = require("express").Router();
const Batch = require("../models/Batch");
const Section = require("../models/Section");
const User = require("../models/User");


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
router.post("/create_section/", async (req,res) => {
    const userId = req.body.userid; //user id
    const batchId = req.body.batchid; //user id
    const batch = await Batch.findById(batchId);
    if(!batch){
    	res.status(404).json("batch not found");
    }else{
    	if(batch.adminId.includes(userId) || batch.superAdmin === userId){
    		try{
    			const newSection = new Section({
    				name : req.body.name,
    				description : req.body.description,
    				batchId : req.body.batchid
    			});

		        // Save Batch and response
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

		}else{
			res.status(400).json("user is not admin");
		}
	}
});

// Get batch object with all it's sections
router.get("/sections/:id", async(req,res) => {
    const id = req.params.id;
    
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
        res.status(404).json("Batch not found");
	});   
});



// Get Batch object
router.get("/:id", async(req,res) => {
   const id = req.params.id;
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




router.get("/", (req,res) => {
    res.send("Hey it's Batches route")
});




module.exports = router;



// https://stackoverflow.com/questions/15128849/using-multiple-parameters-in-url-in-express#:~:text=Such%20a%20request%20will%20return%20a%20JSON%20response.&text=I%20have%20configured%20express%20to,data%20as%20above%20using%20request.