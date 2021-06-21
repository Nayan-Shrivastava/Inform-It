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
        username = authData.username
    });    
    //const userId = req.body.userid;
    const batchId = req.body.batchId;

    Batch.findById(batchId)
    .then( async (batch) => {
        if(!batch){
            res.status(200).json( { error : "batch not found"} );
        }
        else if (!batch.adminId.includes(userId) && userId != batch.superAdmin ) {
            res.status(200).json({
                error : "You are not An Admin"
            });
        }else{
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
            }
        })
        .catch((err)=> {
            console.log(err);
            res.status(200).json( { error : "batch not found"} );

        });
});


/*
// Get batch object with all it's sections
router.post("/get-all-sections",verifyToken, async(req,res) => {
    verifyUser(req,res,(authData) => {

        const id = req.body.batchId;
        
        Batch.findById(id)
        .then(async (result) => {
            
            //console.log(result.sectionId)
            //res.status(200).json(result);
            var arrsections = [];
            var arrusers = [];
            var copiedResult = JSON.parse(JSON.stringify(result));
            var i = 0;
            var j = 0;

            console.log("result.peopleId.length",result.peopleId.length)
            if(result.peopleId.length !== 0){
                    for (let x of result.peopleId){
                        
                        User.findById(x)
                        .then((b) => {
                            console.log("j",j)
                            if(b != null){
                                if (result.adminId.includes(x)){
                                    d = {name : b.name, username : b.username, userId : b._id, isAdmin: true }
                                    arrusers.push(JSON.parse(JSON.stringify(b)));
                                }else{
                                    d = {name : b.name, username : b.username, userId : b._id, isAdmin: false }
                                    arrusers.push(JSON.parse(JSON.stringify(b)));
                                }
                            }
                            //console.log(b);
                            j += 1;
                            if(result.peopleId.length == j){
                                console.log("j",j);
                                copiedResult.arrusers = arrusers.sort(function(a,b){
                                  // Turn your strings into dates, and then subtract them
                                  // to get a value that is either negative, positive, or zero.
                                  return new Date(b.name) - new Date(a.name);
                                });  
                            }
                        }).catch((err) => {
                            console.log(err);
                            j += 1
                        });
                }
            }else{
                //let copiedResult = JSON.parse(JSON.stringify(result));
                copiedResult.arrusers = [];
                
            }

            if (result.sectionId.length !== 0){

               for (let x of result.sectionId){
                    console.log("i",i);
                    Section.findById(x)
                    .then((b) => {
                        console.log("i",i);
                        if(b != null){
                            arrsections.push(JSON.parse(JSON.stringify(b)));
                        }
                        //console.log(b);
                        i += 1;
                        console.log("i",i);
                        if(result.sectionId.length == i){
                            let copiedResult = JSON.parse(JSON.stringify(result));
                            copiedResult.arrsections = arrsections.sort(function(a,b){
                              // Turn your strings into dates, and then subtract them
                              // to get a value that is either negative, positive, or zero.
                              return new Date(b.updatedAt) - new Date(a.updatedAt);
                            });
                        }
                    }).catch((err) => {
                        console.log(err);
                        i += 1
                    });
                }
            }else{
                //let copiedResult = JSON.parse(JSON.stringify(result));
                copiedResult.arrsections = [];
                
            }

            console.log(result.sectionId.length , i ,"=======", result.peopleId.length , j)
            while(true){
                console.log(false);
                if(copiedResult.arrusers && copiedResult.arrsections){
                    console.log(false);
                    res.status(200).json(copiedResult);
                    break;
                }
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(200).json({"error": "Batch not found"});
        });
    }); 
});  

*/

const getUserList = async(result) => {
    var j = 0;
    var arrusers = [];
    if(result.peopleId.length !== 0){
                    for (let x of result.peopleId){
                        
                        await User.findById(x)
                        .then((b) => {
                            
                            if(b != null){
                                if (result.adminId.includes(x) || result.superAdmin == x){
                                    d = {name : b.name, username : b.username, userId : b._id, isAdmin: true }
                                    arrusers.push(JSON.parse(JSON.stringify(d)));
                                }else{
                                    d = {name : b.name, username : b.username, userId : b._id, isAdmin: false }
                                    arrusers.push(JSON.parse(JSON.stringify(d)));
                                }
                            }
                            //console.log(b);
                            j += 1;
                            if(result.peopleId.length == j){
                                //console.log("j",j);
                                //console.log("User j",j, arrusers);
                                result.arrusers =   arrusers.sort(function(a,b){
                                  // Turn your strings into dates, and then subtract them
                                  // to get a value that is either negative, positive, or zero.
                                  return b.username.toLowerCase() -  a.username.toLowerCase();
                                
                                });
                                return arrusers;
                                  
                            }
                        }).catch((err) => {
                            console.log(err);
                            j += 1
                            if(result.peopleId.length == j){
                                //console.log("j",j);
                                result.arrusers =   arrusers.sort(function(a,b){
                                  // Turn your strings into dates, and then subtract them
                                  // to get a value that is either negative, positive, or zero.
                                  return b.username -  a.username;
                                  
                                });
                                return arrusers;
                                
                            }

                        });
                }
            }else{
                //let copiedResult = JSON.parse(JSON.stringify(result));
                result.arrusers =  [];
                return arrusers;               
            }
};


const getSectionList = async(result) => {
    var i = 0;
    var arrsections = [];
    if(result.sectionId.length !== 0){
                    for (let x of result.sectionId){
                        
                        await Section.findById(x)
                        .then((b) => {
                            //console.log("section i",i)
                            if(b != null){
                                  arrsections.push(JSON.parse(JSON.stringify(b)));
                            }
                            //console.log(b);
                            i += 1;
                            if(result.sectionId.length == i){
                                //console.log("i",i);
                                result.arrsections =   arrsections.sort(function(a,b){
                                  // Turn your strings into dates, and then subtract them
                                  // to get a value that is either negative, positive, or zero.
                                  return new Date(b.updatedAt) - new Date(a.updatedAt);
                                
                                }); 
                                return arrsections;
                                
                            }
                        }).catch((err) => {
                            //console.log(err);
                            i += 1
                            if(result.sectionId.length == i){
                                //console.log("i",i);
                                result.arrsections =   arrsections.sort(function(a,b){
                                  // Turn your strings into dates, and then subtract them
                                  // to get a value that is either negative, positive, or zero.
                                  return new Date(b.updatedAt) - new Date(a.updatedAt);
                                
                                });  
                                return arrsections;
                                  
                            }

                        });
                }
            }else{
                //let copiedResult = JSON.parse(JSON.stringify(result));
                result.arrsections =  []; 
                return arrsections;               
            }
};


router.post("/get-all-sections",verifyToken, async(req,res) => {
    verifyUser(req,res,(authData) => {

        const id = req.body.batchId;
        
        Batch.findById(id)
        .then( (result) => {
            
            //console.log(result.sectionId)
            //res.status(200).json(result);
            var copiedResult = JSON.parse(JSON.stringify(result));
            //console.log("result.peopleId.length",result.peopleId.length)
            a = async (copiedResult) =>{
                await getUserList(copiedResult);
                await getSectionList(copiedResult);
                
            };
            
            a(copiedResult)
            .then((result) => {
                console.log(copiedResult.arrsections);
                console.log(copiedResult.arrsections);
                res.status(200).json(copiedResult);
            });
                

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


//Delete Batch Object
router.post("/delete-batch",verifyToken, async(req,res) => {
   verifyUser(req,res,(authData) => {
        userId = authData._id;
        username = authData.username
        const id = req.body.batchId;
        Batch.findById(id).then((batch) => {
            if (userId != batch.superAdmin && username != batch.superAdminName) {
                res.status(200).json({
                    error : "You are not SuperAdmin"
                });
            }else{

                Batch.findByIdAndRemove(id)
                .then((result) => {
                    console.log("Deleted Batch => ",result);
                    res.status(200).json(result);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(404).json("Some internal error");
                 });
            }
        });     
    });    
});


//update Batch
router.post("/update-batch",verifyToken, async(req,res) => {
   verifyUser(req,res,(authData) => {
        userId = authData._id;
        username = authData.username
        const batchId = req.body.batchId;
        Batch.findById(batchId)
        .then((batch) => {
            if (!batch.adminId.includes(userId) && userId != batch.superAdmin ) {
                res.status(200).json({
                    error : "You are not An Admin"
                });
            }else{

                Batch.findByIdAndUpdate(batchId,{ name : req.body.name, description : req.body.description },(err,result) => {
                    if(err){
                        console.log(err);
                        console.log("------- Batch Not updated -------");
                        res.status(200).json({error : "some error"});
                    }
                    else{
                        console.log(result);
                        console.log("------- Batch Successfully updated -------");
                        res.status(200).json({isUpdated : true});
                    }
                });
            }
        })
        .catch((err)=> {
            console.log(err);
            res.status(200).json({error : "batch not found"});

        });
    });    
});

function arrayRemove(arr, value) { 
    
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }
router.post("/make-admin", verifyToken, (req,res) => {
    verifyUser(req,res,(authData) => {
        userId = authData._id;
        username = authData.username
    });

    const batchId = req.body.batchId;
    const newAdmin = req.body.newAdmin;

    Batch.findById(batchId)
    .then( async (batch) => {
        if(!batch){
            res.status(200).json( { error : "batch not found"} );
        }
        else if (!batch.adminId.includes(userId) && userId != batch.superAdmin ) {
            res.status(200).json({
                error : "not admin"
            });
        }else if (!batch.peopleId.includes(newAdmin)) {
            res.status(200).json({
                error : "not member"
            });
        }
        else{
                try{

                    Batch.findByIdAndUpdate(batchId,{ $addToSet: { adminId: [newAdmin] } },(err,result) => {
                        if(err){
                            console.log(err);
                            console.log("------- make-admin failed -------");
                        }
                        else{
                            console.log(result);
                            console.log("------- make-admin Success -------");
                            res.status(200).json({
                                message : "success"
                            })
                        }
                    });

                }catch(err){
                    res.status(500).json(err);

                };
            }
        })
        .catch((err)=> {
            console.log(err);
            res.status(200).json( { error : "batch not found"} );

        });

});


router.post("/remove-user", verifyToken, (req,res) => {
    verifyUser(req,res,(authData) => {
        userId = authData._id;
        username = authData.username
    });

    const batchId = req.body.batchId;
    const removeUserId = req.body.removeUserId;

    Batch.findById(batchId)
    .then( async (batch) => {
        if(!batch){
            //console.log("error 1")
            res.status(200).json( { error : "batch not found"} );
        }
        else if (!batch.adminId.includes(userId) && userId != batch.superAdmin ) {
            res.status(200).json({
                error : "not admin"
            });
        }else if (!batch.peopleId.includes(removeUserId)) {
            res.status(200).json({
                error : "not member"
            });
        }
        else{
                try{
                    var PeopleId2 = arrayRemove(batch.peopleId,removeUserId); 
                    await Batch.findByIdAndUpdate(batchId,{ peopleId: PeopleId2 },(err,result) => {
                        if(err){
                            console.log(err);
                            console.log("------- remove-user-PeopleId failed -------");
                        }
                        else{
                            //console.log(result);
                            console.log("------- remove-user-PeopleId Success -------");
                            
                        }
                    });
                     
                    

                    

                    await User.findById(removeUserId)
                    .then(async(user) => {
                        var batchesId2 = arrayRemove(user.batchesId,batchId);
                        await User.findByIdAndUpdate(removeUserId,{ batchesId: batchesId2 },(err,result) => {
                        if(err){
                            console.log(err);
                            console.log("------- remove-user-SectionId failed -------");
                        }
                        else{
                            //console.log(result);
                            //console.log("------- remove-user-SectionId Success -------");
                            
                        }
                    });
                        
                        
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(404).json("User not found");
                    });



                    res.status(200).json({
                                message : "success"
                            })
                }catch(err){
                    res.status(500).json(err);

                };
            }
        })
        .catch((err)=> {
            console.log(err);
            res.status(200).json( { error : "batch not found"} );

        });

});



router.get("/", (req,res) => {
    res.send("Hey it's Batches route")
});



module.exports = router;



// https://stackoverflow.com/questions/15128849/using-multiple-parameters-in-url-in-express#:~:text=Such%20a%20request%20will%20return%20a%20JSON%20response.&text=I%20have%20configured%20express%20to,data%20as%20above%20using%20request.