var express = require('express')
    , connect = require('connect')
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , morgan = require('morgan')
    , expressSession = require('express-session')
    , methodOverride = require('method-override')
    , static = require('serve-static')
    , passport = require('passport')
    , util = require('util')
    , path = require('path')
    , YahooStrategy = require('passport-yahoo-oauth').Strategy
    , YahooFantasy = require('yahoo-fantasy');

// you can get an application key/secret by creating a new application on Yahoo!
var yf = new YahooFantasy(
    "dj0yJmk9Wjc2V3FhMlBiNjFjJmQ9WVdrOWRXRkdjMkl5Tm1zbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD04OQ--",
    "4965eb4f004eebfaa0428a6515f0d9b531b10f08"
);


var YAHOO_CONSUMER_KEY = "dj0yJmk9Wjc2V3FhMlBiNjFjJmQ9WVdrOWRXRkdjMkl5Tm1zbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD04OQ--";
var YAHOO_CONSUMER_SECRET = "4965eb4f004eebfaa0428a6515f0d9b531b10f08";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Yahoo profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


// Use the YahooStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Yahoo profile), and
//   invoke a callback with a user object.
passport.use(
    new YahooStrategy({
        consumerKey: YAHOO_CONSUMER_KEY,
        consumerSecret: YAHOO_CONSUMER_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/yahoo/callback"
    },
    function(token, tokenSecret, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // To keep the example simple, the user's Yahoo profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Yahoo account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));




var app = express();

// configure Express

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(morgan('dev'));
//app.use(cookieParser);
app.use(bodyParser.json());
app.use(methodOverride);
app.use(expressSession({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
//app.use(static(__dirname + '/public'));



app.get('/', function(req, res){
    res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
    res.render('login', { user: req.user });
});

// GET /auth/yahoo
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Yahoo authentication will involve redirecting
//   the user to yahoo.com.  After authorization, Yahoo will redirect the user
//   back to this application at /auth/yahoo/callback
app.get('/auth/yahoo',
    passport.authenticate('yahoo'),
    function(req, res){
        // The request will be redirected to Yahoo for authentication, so this
        // function will not be called.
    });

// GET /auth/yahoo/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/yahoo/callback',
    passport.authenticate('yahoo', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.listen(3000);
console.log("Listening on 3000");

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}