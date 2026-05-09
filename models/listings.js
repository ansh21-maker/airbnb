const mongoose = require("mongoose");
const Review = require("./reviews");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String
    },
    description: String,
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ]
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});

const DataList = mongoose.model("DataList", listingSchema);

module.exports = DataList;