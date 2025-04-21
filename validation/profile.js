const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data = {}) {
    // Initialize errors object to store validation errors
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';
    
    if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
        errors.handle = 'Handle needs to be between 2 and 40 characters'; // Validate handle length
    }

    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Profile handle is required'; // Check if handle is empty
    }

    if (Validator.isEmpty(data.status)) {
        errors.status = 'Status field is required'; // Check if status is empty
    }

    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'Skills field is required'; // Check if skills are empty
    }

    if (!isEmpty(data.website)) {
        if (!Validator.isURL(data.website)) {
            errors.website = 'Not a valid URL'; // Validate website URL
        }
    }

    if (!isEmpty(data.youtube)) {
        if (!Validator.isURL(data.youtube)) {
            errors.youtube = 'Not a valid URL'; // Validate YouTube URL
        }
    }

    if (!isEmpty(data.twitter)) {
        if (!Validator.isURL(data.twitter)) {
            errors.twitter = 'Not a valid URL'; // Validate Twitter URL
        }
    }

    if (!isEmpty(data.facebook)) {
        if (!Validator.isURL(data.facebook)) {
            errors.facebook = 'Not a valid URL'; // Validate Facebook URL
        }
    }

    if (!isEmpty(data.linkedin)) {
        if (!Validator.isURL(data.linkedin)) {
            errors.linkedin = 'Not a valid URL'; // Validate LinkedIn URL
        }
    }

    if (!isEmpty(data.instagram)) {
        if (!Validator.isURL(data.instagram)) {
            errors.instagram = 'Not a valid URL'; // Validate Instagram URL
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}