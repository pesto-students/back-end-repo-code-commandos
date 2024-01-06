const express = require("express");
const router = express.Router();
const message = require("../controllers/message");

router.get("/*", (req, res) =>
  res.status(404).send("Error Code 404: Page Not Found !!!!")
);

router.post("/create", message.createMessage);
router.post("/get-messages", message.getMessage);

module.exports = router;
