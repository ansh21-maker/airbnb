const joi=require("joi");


module.exports.lisingSchema=joi.object({
    lisitng:joi.object({
        title:joi.string().required(),
         descriptio:joi.string().required(),
          location:joi.string().required(),
          country:joi.string().required(),
          price:joi.string().required(), 
          image:joi.string().required(),
    }).required(),
})

module.exports.reviewSchema=joi.object({
    
})