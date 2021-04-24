const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const HikingPlace = require("../models/hikers");
const Review = require("../models/review");

router.get("/", async (req, res) => {
  const hikingPlaces = await HikingPlace.find({});
  res.render("hiking-places/index", { hikingPlaces }); //pass to template
});

router.get("/new", (req, res) => {
  res.render("hiking-places/new");
});

router.post(
  "/",
  catchAsync(async (req, res) => {
    const hikingPlace = new HikingPlace(req.body.hikingPlace);
    await hikingPlace.save();
    res.redirect(`/hiking-places/${hikingPlace._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const hikingPlace = await HikingPlace.findById(req.params.id).populate(
      "reviews"
    );
    res.render("hiking-places/show", { hikingPlace }); //take id and look up corresponding place
  })
); //id to look up corresponding hiking place from data

router.get("/:id/edit", async (req, res) => {
  const hikingPlace = await HikingPlace.findById(req.params.id);
  res.render("hiking-places/edit", { hikingPlace });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const hikingPlace = await HikingPlace.findByIdAndUpdate(id, {
    ...req.body.hikingPlace,
  }); //...take what's in body not hardcode data, spread to the object
  res.redirect(`/hiking-places/${hikingPlace._id}`);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await HikingPlace.findByIdAndDelete(id);
  res.redirect("/hiking-places");
});

module.exports = router;
