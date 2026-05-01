const express = require("express");
const router = express.Router();

const sahipController = require("../controllers/sahipController");

router.get("/", sahipController.sahipleriListele);

module.exports = router;