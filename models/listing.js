const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    image: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/022/014/063/small_2x/missing-picture-page-for-website-design-or-mobile-app-design-no-image-available-icon-vector.jpg",
        set: (v) => v === "" ? "https://static.vecteezy.com/system/resources/thumbnails/022/014/063/small_2x/missing-picture-page-for-website-design-or-mobile-app-design-no-image-available-icon-vector.jpg" : v
    },
    price: {
        type: Number,
        required: true
    },
    loc: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;