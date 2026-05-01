const express = require("express");
const router = express.Router();

const hayvanController = require("../controllers/hayvanController");

router.get("/", hayvanController.hayvanlariListele);

module.exports = router;