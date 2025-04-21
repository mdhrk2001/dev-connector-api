const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data ={}) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Job title field is required'; // Check if title is empty
    }

    if (Validator.isEmpty(data.company)) {
        errors.company = 'Company field is required'; // Check if company is empty
    }

    if (Validator.isEmpty(data.from)) {
        errors.from = 'From date field is required'; // Check if from date is empty
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}