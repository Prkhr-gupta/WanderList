const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        desc: Joi.string().required(),
        loc: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        category: Joi.array().items(Joi.string().valid("Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Camping", "Farms", "Amazing Pools", "Arctic", "Beaches"))
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});
