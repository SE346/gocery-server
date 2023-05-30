import Joi from 'joi';

export const productOrderDetailSchema = Joi.object({
  id: Joi.string().required(),
  quantity: Joi.number().required(),
});

export const productOrderDetailListSchema = Joi.array().items(productOrderDetailSchema).min(1);
