const mongoose = require("mongoose");
const Schema = mongoose.Schema;
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
        url: String,
        filename: String
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
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    category: [
        {
            type: String,
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