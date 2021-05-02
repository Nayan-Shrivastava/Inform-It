const router = require("express").Router();


router.get("/:id", async(req,res) => {
    
    res.send(`Hey it's batch == ${req.params.id}`)
});


router.get("/", (req,res) => {
    res.send("Hey it's Batches route")
});
module.exports = router;