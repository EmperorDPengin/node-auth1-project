const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const sessionConfig = {
    name: "chocolatechip",
    secret: 'rveagweftw45',
    cookie : {
      maxAge: 1000 * 60 * 2,
      secure: false, 
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
  
    store: KnexSessionStore({
      knex: require('../data/db-config'),
      tablename: 'sessions',
      sidfieldname: 'sid',
      createtable: true,
      clearInterval: 1000 * 60 * 60,
    })
  };

  module.exports = {sessionConfig};