const router = require("express").Router();


router.get("/:id", async(req,res) => {
    
    res.send(`Hey it's user == ${req.params.id}`)
});


router.get("/", (req,res) => {
    res.send("Hey it's Users route")
});
module.exports = router;