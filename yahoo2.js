var YAHOO_CONSUMER_KEY = "dj0yJmk9YkNFalE2QlFrb3J3JmQ9WVdrOVNGSjZNRmx5TlRJbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD1hYg--";
var YAHOO_CONSUMER_SECRET = "ed4bc8eb6399732f3f75fb3bca0d00f2ab4b1c2c";


var path = require('path');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var request = require('request');
var YantasySports = require('yahoo-fantasy-without-auth');
var passport = require('passport');
var YahooStrategy = require('passport-yahoo-oauth2').Strategy;

var yf = new YantasySports();

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new YahooStrategy({
        consumerKey: YAHOO_CONSUMER_KEY,
        consumerSecret: YAHOO_CONSUMER_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/yahoo/callback"
    },
    function(token, tokenSecret, profile, done) {
        // User.findOrCreate({ yahooId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
        var data = profile._json;

        var userObj = {
            id: profile.id,
            name: data.profile.nickname,
            avatar: data.profile.image.imageUrl,
            dateJoined: new Date().getTime(),
            lastUpdated: new Date().getTime(),
            lastVisit: new Date().getTime(),
            accessToken: token,
            tokenSecret: tokenSecret,
            sessionHandle: profile.oauth_session_handle
        };

        yf.setUserToken(userObj.accessToken, userObj.tokenSecret);

        return done(null, userObj);
    }
));

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',
    passport.authenticate('yahoo')
);

app.get('/auth/yahoo/callback',
    passport.authenticate('yahoo', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        console.log('Hi!');
        res.end("Hi!");
    }
);

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});