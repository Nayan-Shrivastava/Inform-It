
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

// Get Section object
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
    });    

        const sectionId = req.body.sectionId; //user id
        if (req.body.priority === ""){
            req.body.priority = 2
        }
        if (req.body.impLinks === ""){
            req.body.impLinks = []
        }
        else{
            req.body.impLinks = req.body.impLinks.split(',')
        }
        try{
            const section = await Section.findById(sectionId);
            if(!section){
                res.status(200).json({ error : "section not found"});
            }else{
                //if(section.adminId.includes(userId) || section.superAdmin === userId){
                    try{
                        const newNotice = new Notice({
                            heading : req.body.heading,
                            subHeading : req.body.subHeading,
                            by : req.body.by,
                            body : req.body.body,
                            createdBy : userId,
                            numberofPeople: 1,
                            priority : req.body.priority,
                            impLinks : req.body.impLinks,
                            deadline : req.body.deadline,
                            sectionId : sectionId
                        });
                        console.log("newNotice",newNotice);
                        // Save Notice and response
                        await newNotice.save().then((notice) => {
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
    /*
                }else{
                    res.status(400).json("user is not admin");
                }
    */
            }
        }catch(err){
            res.status(200).json({ error : "section not found"});
        }
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
                    arrnotices.push(JSON.parse(JSON.stringify(b)));
                    //console.log(b);
                    i += 1;
                    if(result.noticeId.length == i){
                        let copiedResult = JSON.parse(JSON.stringify(result));
                        copiedResult.arrnotices = arrnotices;
                        console.log(copiedResult);
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
router.get("/", (req,res) => {
    res.send("Hey it's Sections route")
});
module.exports = router;