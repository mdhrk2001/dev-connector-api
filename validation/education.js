const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data ={}) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (Validator.isEmpty(data.school)) {
        errors.school = 'School field is required'; // Check if school is empty
    }

    if (Validator.isEmpty(data.degree)) {
        errors.degree = 'Degree field is required'; // Check if degree is empty
    }

    if (Validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'Field of study field is required'; // Check if field of study is empty
    }

    if (Validator.isEmpty(data.from)) {
        errors.from = 'From date field is required'; // Check if from date is empty
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}