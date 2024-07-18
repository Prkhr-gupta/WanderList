const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        desc: Joi.string().required(),
        loc: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null)
    }).required()
});
