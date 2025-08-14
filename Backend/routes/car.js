const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const admin = require("../middleware/admin");

router.get("/", carController.getCar);
router.get("/getAllCarOfUser", auth, carController.getAllCarOfUser);
router.get("/getLuxuryCars", carController.getLuxuryCars);
router.get("/getCheapCars", carController.getCheapCars);
router.get("/detail/:id", carController.getDetailsCar);
router.post(
  "/addCar",
  auth,
  upload.fields([
    { name: "main_image", maxCount: 1 },
    { name: "sub_images", maxCount: 10 },
  ]),
  carController.addCar
);
router.delete("/:id", auth, carController.deleteCar);
router.put("/:id", auth, carController.updateCar);
router.get("/getStatsOfUser", auth, carController.getStatsOfUser);
router.get("/admin/getAllCarStats", auth, admin, carController.getAllCarStats);
router.get("/similarCars/:id", carController.getSimilarCars);
router.get("/rentedPeriods/:id", carController.getCarRentedPeriods);

module.exports = router;
