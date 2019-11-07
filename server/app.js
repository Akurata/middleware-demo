const express = require('express');
const app = express();
const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer();

var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var helmet = require('helmet');

//Resources:
//https://www.npmjs.com/package/vue
//https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d
//https://ssr.vuejs.org/guide/#using-a-page-template

//START: User Authentication and Session store initialization in case of user based system
const uuid = require('uuid/v4');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Example demo data of what a user query would return
const users = [
  {id: '2f24vvg', email: 'test@test.com', password: 'password'}
];

//Configure passport to use local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    const user = users[0];
    if(email === user.email && password === user.password) {
      return done(null, user);
    }
  }
));

//Tell Passport how to serialize a user
passport.serializeUser((user, done) => {
  //User ID and session are stored here
  done(null, user.id);
});

//Tell Passport how to match + remove a session
passport.deserializeUser((id, done) => {
  const user = users[0].id === id ? users[0] : false;
  done(null, user);
});
//END: User Auth Decleration


//START: Middleware Decleration
app.use(express.static(path.resolve('./'), {maxAge: 86400000}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(session({
  genid: (req) => { //Generate unique session identification codes
    return uuid();
  },
  store: new fileStore(),
  secret: '0dce3d6a4a',
  resave: false,
  saveUninitialized: true,
  retries: 0
}));
app.use(passport.initialize());
app.use(passport.session());
//END: Middleware Decleration


//I threw this example up using server side rendering, treating VUE like a template engine
//I'm not entirely sure this is the right route and I will not be offended if you throw all this out.
app.get('/', (req, res) => {
  console.log(req.isAuthenticated())
  //Before the server can render the template file, you can declare the variables that will be populated here.
  //Use {{ var }} for variable interpolation, the docs call it double-moustaching and im going to from now on too.
  const info = new Vue({
    data: {
      sessionID: req.sessionID,
      time: new Date().toLocaleTimeString(),
      title: 'Page Ex Title'
    },
    template: fs.readFileSync('./index.html', 'utf-8')
  });

  renderer.renderToString(info, (err, html) => {
    if(err) {
      console.log(err);
      res.end();
    }else {
      res.send(html);
    }
  });
});


//Login Page
app.get('/login', (req, res) => {
  //Check if the user is already logged in
  if(req.isAuthenticated()) {
    res.redirect('/isAuthenticated');
  }else {
    const info = new Vue({
      data: {
        title: 'Login Page'
      },
      template: fs.readFileSync('./login.html', 'utf-8')
    });

    renderer.renderToString(info, (err, html) => {
      if(err) {
        console.log(err);
        res.end();
      }else {
        res.send(html);
      }
    });
  }
});


//Endpoint to process login submission
app.post('/login', (req, res, next) => {
  //Tell Passport to check this user out
  passport.authenticate('local', (err, user, info) => {
    if(info) {return res.send(info.message)} //Return any error messages
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); } //Some problem in login, so redirect back to get page
    req.login(user, (err) => { //Process a successful login
      if (err) { return next(err); }
      return res.redirect('/isAuthenticated'); //Redirect when done
    });
  })(req, res, next);
});


//Page to show that a user is already logged in and saved
//You will be redirected here if you already logged in
app.get('/isAuthenticated', (req, res) => {
  if(req.isAuthenticated()) {
    res.send(`You are authenticated with session: ${req.sessionID}`);
    const info = new Vue({
      data: {
        sessionID: req.sessionID
      },
      template: `<div>You are authenticated with session: {{ sessionID }}</div>`
    });

    renderer.renderToString(info, (err, html) => {
      if(err) {
        console.log(err);
        res.end();
      }else {
        res.send(html);
      }
    });
  }else {
    res.redirect('/')
  }
})


//Listen to port 80
//Direct to localhost in the browser
app.listen(80, (err) => {
  if(err) {
    console.log(err);
  }else {
    console.log('App Started 80');
  }
});
