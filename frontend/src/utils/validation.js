import Joi from 'joi'

/**
 * Creates an Ant Design Form validator rule using a Joi schema.
 * @param {Joi.Schema} schema - The Joi schema to validate against.
 * @returns {Object} Ant Design Form rule object.
 */
export const joiValidator = (schema) => ({
  validator: async (_, value) => {
    try {
      await schema.validateAsync(value)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(new Error(error.message))
    }
  },
})

/**
 * Common Joi schemas for reuse.
 */
export const commonSchemas = {
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required',
    }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required',
  }),
  requiredString: (label) =>
    Joi.string()
      .required()
      .messages({
        'string.empty': `${label} is required`,
      }),
}
