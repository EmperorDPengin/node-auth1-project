const yup = require('yup');

const passwordSchema = yup.object().shape({
    password: yup 
        .string()
        .trim()
        .typeError('password must be a string')
        .required('Password must be longer than 3 chars')
        .min(4, "Password must be longer than 3 chars")
});

const usernameSchema = yup.object().shape({
    username: yup
        .string('Invalid credentials')
        .trim()
        .typeError('Invalid credentials')
        .required('Username is required')
})

module.exports = { passwordSchema, usernameSchema};