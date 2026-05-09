const express = require("express");
const router = express.Router();

const DataList = require("../models/listings");


// middleware
router.use(express.urlencoded({ extended: true }));


// async wrapper
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}


// SHOW ALL
router.get("/", wrapAsync(async (req, res) => {

  const listings = await DataList.find({});

  res.render("index", { listings });

}));


// NEW FORM
router.get("/new", (req, res) => {

  res.render("new");

});


// CREATE
router.post("/", wrapAsync(async (req, res) => {

  let data = req.body.newData;

  data.image = {
    url: data.image,
    filename: "listingimage"
  };

  let formNewData = new DataList(data);

  await formNewData.save();

  req.flash("success", "New Listing Added!");

  res.redirect("/listings");

}));


// SHOW ONE
router.get("/:id", wrapAsync(async (req, res) => {

  let { id } = req.params;

  const listings = await DataList.findById(id)
    .populate("reviews");

    if(!listings){
      req.flash("erroor", "Lisitng your requested for does not exist");
      res.redirect("/listings")
    }

  res.render("show", {listings});

}));


// EDIT FORM
router.get("/:id/edit", wrapAsync(async (req, res) => {

  let { id } = req.params;

  let listings = await DataList.findById(id);

  res.render("edit", { listings });

}));


// UPDATE
router.put("/:id", wrapAsync(async (req, res) => {

  let { id } = req.params;

  await DataList.findByIdAndUpdate(id, {
    ...req.body.newData
  });

  req.flash("success", "Listing Updated!");

  res.redirect(`/listings/${id}`);

}));


// DELETE
router.delete("/:id", wrapAsync(async (req, res) => {

  let { id } = req.params;

  await DataList.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");

  res.redirect("/listings");

}));


module.exports = router;