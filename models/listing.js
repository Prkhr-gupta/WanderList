const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const Review = require("./review.js")

const listingSchema = new Schema({
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
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        let reviews = listing.reviews;
        await Review.deleteMany({_id : {$in : reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;