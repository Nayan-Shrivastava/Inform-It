
const router = require("express").Router();
const Section = require("../models/Section");
const Batch = require("../models/Batch");
const User = require("../models/User");
const Notice = require("../models/Notice");
const jwt = require("jsonwebtoken");
const {verifyToken,verifyUser} = require("../auth");


// Get Notice object 790
router.post("/get-notice", async(req,res) => {
   const id = req.body.noticeId;
   console.log(id);
    Notice.findById(id)
    .then((result) => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch((err) => {
        console.log(err);
        res.status(404).json("notice not found");
     });
});





//delete Notice
router.post("/delete-notice",verifyToken, async(req,res) => {
   verifyUser(req,res,(authData) => {
        userId = authData._id;
        //username = authData.username
        const batchId = req.body.batchId;
        const sectionId = req.body.sectionId;
        const noticeId = req.body.noticeId;
        Batch.findById(batchId)
        .then((batch) => {
            if (!batch.adminId.includes(userId) && userId != batch.superAdmin ) {
                res.status(200).json({
                    error : "You are not An Admin"
                });
            }else{
                
                Section.findByIdAndUpdate(sectionId  ,{ $pull: {noticeId: noticeId } },(err,result) => {
                    if(err){
                        console.log(err);
                        console.log("------- removing noticeId failed -------");
                    }
                    else{
                        console.log("section =>",result);
                        console.log("------- removing noticeId Success -------");
                    }
                });


                Notice.findByIdAndRemove(noticeId)
                .then((result) => {
                    console.log("Deleted notice => ",result);
                    res.status(200).json(result);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(200).json({"error" : "notice not found"});
                 });
                
                // $pullAll : {uid: [req.params.deleteUid]}

            }
        })
        .catch((err)=> {
            console.log(err);
            res.status(200).json({"error" : "batch not found"});

        });
    });    
});




//update Batch
router.post("/update-notice",verifyToken, async(req,res) => {
    verifyUser(req,res,(authData) => {
        userId = authData._id;
        userName = authData.username
        const batchId = req.body.batchId;
        const sectionId = req.body.sectionId;
        const noticeId = req.body.noticeId;
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
                if(req.body.heading !== null && req.body.heading.trim() !== ""){
                    Notice.findByIdAndUpdate(noticeId,{
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
                        },
                        (err,result) => {
                            if(err){
                                console.log(err);
                                console.log("------- notice Not updated -------");
                                res.status(200).json({error : "some error"});
                            }
                            else{
                                console.log(result);
                                console.log("------- notice Successfully updated -------");
                                res.status(200).json({isUpdated : true});
                            }
                    });
                }else{
                    res.status(200).json({"error" : "heading is required"});
                }
            }
        })
        .catch((err)=> {
            console.log(err);
            res.status(200).json({"error" : "batch not found"});

        });
    });    
});

module.exports = router;