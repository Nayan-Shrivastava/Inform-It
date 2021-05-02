const router = require("express").Router();


router.get("/:id", async(req,res) => {
    
    res.send(`Hey it's section == ${req.params.id}`)
});


router.get("/", (req,res) => {
    res.send("Hey it's Sections route")
});
module.exports = router;