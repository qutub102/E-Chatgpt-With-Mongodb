const express = require("express");
const runConversation = require("./chatgpt");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const response = await runConversation(req.body.prompt);
    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
  // res.send("Done")
});

module.exports = router;
