
const router = require("express").Router();
const Section = require("../models/Section");
const Batch = require("../models/Batch");
const User = require("../models/User");
const Notice = require("../models/Notice");
const jwt = require("jsonwebtoken");
const {verifyToken,verifyUser} = require("../auth");
// Get Section object
router.post("/get-section", async(req,res) => {
   const id = req.body.sectionId;
   console.log(id);
    Section.findById(id)
    .then((result) => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json("section not found");
     });
});




// Add Notice id to given Section object
const addnoticeIdtoSection = (noticeId,sectionId) => {
     Section.findByIdAndUpdate(sectionId,{ $addToSet: { noticeId: [noticeId] } },(err,result) => {
        if(err){
            console.log(err);
            console.log("------- addnoticeIdtoSection() Not updated -------");
        }
        else{
            console.log(result);
            console.log("------- addnoticeIdtoSection() Successfully Added -------");
        }
    });
}


router.post("/create-notice/",verifyToken, async (req,res) => {
    verifyUser(req,res,(authData) => {
        userId = authData._id;  
        userName = authData.username; 
    });    
        const batchId = req.body.batchId;
        const sectionId = req.body.sectionId; //user id


        Batch.findById(batchId)
        .then((batch) => {
            if (!batch.adminId.includes(userId) && userId != batch.superAdmin ) {
                res.status(200).json({
                    error : "You are not An Admin"
                });
            }else{

                if (req.body.priority === ""){
                    req.body.priority = 2
                }

                if (req.body.impLinks === ""){
                    req.body.impLinks = []
                }else{
                    req.body.impLinks = req.body.impLinks.split(',')
                }

                if (req.body.priority === ""){
                    req.body.priority = 2
                }

                if (req.body.body=== null || req.body.body.length === 0){
                    req.body.body== " ";
                }

                try{
                        const newNotice = new Notice({
                            heading : req.body.heading,
                            subHeading : req.body.subHeading,
                            by : req.body.by,
                            body : req.body.body,
                            createdBy : userId,
                            createdByName : userName,
                            priority : req.body.priority,
                            impLinks : req.body.impLinks,
                            deadline : req.body.deadline,
                            sectionId : sectionId
                        });
                        //console.log("newNotice",newNotice);
                        // Save Notice and response
                        newNotice.save().then((notice) => {
                            console.log(notice._id,notice.sectionId);
                            addnoticeIdtoSection(notice._id,notice.sectionId);
                            res.status(200).json(notice);
                        }).catch((err) => {
                            console.log(err);
                            res.status(500).json(err); 
                        });

                    }catch(err){
                        console.log(err);
                        res.status(500).json(err);

                    };

            }
        })
        .catch((err)=> {
            console.log(err);
            res.status(200).json({"error" : "batch not found"});

        });  
});

// Get Section object with all it's notices
router.post("/get-all-notices",verifyToken, async(req,res) => {
    verifyUser(req,res,(authData) => {

        const sectionId = req.body.sectionId;
        
        Section.findById(sectionId)
        .then((result) => {
            if(result === null){
                //console.log("result",typeof result,typeof null,result)
                res.status(200).json({ "error" : "Section not found"});
            }else{
            
            
            //res.status(200).json(result);
            let arrnotices = [];

            
            var i = 0;
            for (let x of result.noticeId){
                
                    Notice.findById(x)
                    .then((b) => {
                        if(b != null){
                            arrnotices.push(JSON.parse(JSON.stringify(b)));
                        }
                        //console.log(b);
                        i += 1;
                        if(result.noticeId.length == i){
                            let copiedResult = JSON.parse(JSON.stringify(result));
                            copiedResult.arrnotices = arrnotices.sort(function(a,b){
                              // Turn your strings into dates, and then subtract them
                              // to get a value that is either negative, positive, or zero.
                              return new Date(b.updatedAt) - new Date(a.updatedAt);
                          });
                            //console.log(copiedResult);
                            res.status(200).json(copiedResult);
                    }
                }).catch((err) => {
                    console.log(err);
                    i += 1
                });
            }
        }})
        .catch((err) => {
            console.log(err);
            res.status(200).json({ "error" : "Section not found"});
        }); 
    });  
});



//delete Batch
router.post("/delete-section",verifyToken, async(req,res) => {
   verifyUser(req,res,(authData) => {
        userId = authData._id;
        //username = authData.username
        const batchId = req.body.batchId;
        const sectionId = req.body.sectionId;
        Batch.findById(batchId)
        .then((batch) => {
            if (!batch.adminId.includes(userId) && userId != batch.superAdmin ) {
                res.status(200).json({
                    error : "You are not An Admin"
                });
            }else{
                console.log("batch =>",batch);
                Batch.findByIdAndUpdate(batchId  ,{ $pull: {sectionId: sectionId } },(err,result) => {
                    if(err){
                        console.log(err);
                        console.log("------- removing sectionId failed -------");
                    }
                    else{
                        console.log(result);
                        console.log("------- removing sectionId Success -------");
                    }
                });


                Section.findByIdAndRemove(sectionId)
                .then((result) => {
                    console.log("Deleted Section => ",result);
                    res.status(200).json(result);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(200).json({"error" : "section not found"});
                 });

                //$pullAll: {uid: [req.params.deleteUid]}



            }
        })
        .catch((err)=> {
            console.log(err);
            res.status(200).json({"error" : "batch not found"});

        });
    });    
});




//update Batch
router.post("/update-section",verifyToken, async(req,res) => {
   verifyUser(req,res,(authData) => {
        userId = authData._id;
        username = authData.username
        const batchId = req.body.batchId;
        const sectionId = req.body.sectionId;
        Batch.findById(batchId)
        .then((batch) => {
            if (!batch.adminId.includes(userId) && userId != batch.superAdmin ) {
                res.status(200).json({
                    error : "You are not An Admin"
                });
            }else{
                if (req.body.description=== null || req.body.description.length === 0){
                    req.body.description== " ";
                }
                if(req.body.name !== null && req.body.name.trim() !== ""){
                    Section.findByIdAndUpdate(sectionId,{ name : req.body.name, description : req.body.description },(err,result) => {
                        if(err){
                            console.log(err);
                            console.log("------- Section Not updated -------");
                            res.status(200).json({error : "some error"});
                        }
                        else{
                            console.log(result);
                            console.log("------- Section Successfully updated -------");
                            res.status(200).json({isUpdated : true});
                        }
                    });
                }else{
                    res.status(200).json({"error" : "name is required"});
                }
            }
        })
        .catch((err)=> {
            console.log(err);
            res.status(200).json({"error" : "batch not found"});

        });
    });    
});



router.get("/", (req,res) => {
    res.send("Hey it's Sections route")
});
module.exports = router;