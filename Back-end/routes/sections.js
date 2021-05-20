const router = require("express").Router();
const Section = require("../models/Section");
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


router.get("/", (req,res) => {
    res.send("Hey it's Sections route")
});
module.exports = router;