const Users = require('../users/users-model');
const {passwordSchema, usernameSchema} = require('./auth-yupSchemas');
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next({status: 401, message: "You shall not pass!"})
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
function checkUsernameFree(req, res, next) {
  usernameSchema.validate(req.body, {
    strict: true,
    stripUnknown: true
  })
  .then( validated => {
    const {username} = validated;

    Users.findBy({username})
      .then( usersFound => {
        if  (usersFound.length > 0) {
          next({status: 422, message: "Username taken"});
          return;
        }
        req.body = validated;
        next();
      })
      .catch(next)
  })
  .catch(err => {
    next({status: 422, message: err.message});
  })
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists(req, res, next) {
  usernameSchema.validate(req.body, {
    strict: true,
    stripUnknown: true
  })
  .then( validated => {
    const {username} = validated;

    Users.findBy({username}).first()
      .then( userFound => {
        if  (!userFound) {
          next({status: 401, message: "Invalid credentials"});
        }
        req.body = validated;
        req.body.user = userFound;
        next();
      })
      .catch(next)
  })
  .catch(err => {
    next({status: 401, message: err.message});
  })
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  passwordSchema.validate(req.body,
    {
      strict: true,
      stripUnknown: true
    })
    .then( validated => {
        req.body = validated;
        next();
    })
    .catch(err => {
      next({status: 422, message: err.message})
    });
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}