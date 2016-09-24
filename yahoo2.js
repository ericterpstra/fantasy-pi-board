require('dotenv').config();

var path = require('path');
var _ = require('lodash');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var request = require('request');
var YantasySports = require('yahoo-fantasy-without-auth');
var passport = require('passport');
var YahooStrategy = require('passport-yahoo-oauth2').Strategy;

var yf = new YantasySports();
var intervalId;
var selectedLeagueKey;
var selectedTeamId = 0;
var allMatchups = [];

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new YahooStrategy({
        consumerKey: process.env.YAHOO_CONSUMER_KEY,
        consumerSecret: process.env.YAHOO_CONSUMER_SECRET,
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

app.get('/login',
    passport.authenticate('yahoo')
);

app.get('/auth/yahoo/callback',
    passport.authenticate('yahoo', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    }
);

app.get('/leagues', function(req, res) {
    yf.user.game_leagues('nfl', function(err, data){
        if (err) {
            console.log(err);
            res.status(500).send(err.description);
        } else {
            res.json(data.leagues);
        }
    });
});

app.post('/league', function(req, res) {
    console.log("New league Key: " + req.body.leagueKey);
    selectedLeagueKey = req.body.leagueKey;


    // Otherwise try to return the latest grab from the yahoo api
    if (intervalId && allMatchups.length) {
        return res.json(allMatchups);
    } else  {
        //  If the loop hasn't started yet, start the loop
        startLoop(function() {
            res.json(allMatchups);
        });
    }


});

app.post('/team', function(req, res) {
    console.log("New team ID: " + req.body.teamId);
    selectedTeamId = req.body.teamId;
    res.json(req.body);
});

// route to handle all other requests (serves angular frontend index)
app.get('*', function(req, res) {
    res.sendFile('./public/index.html');
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));

    // Start Johnny Five
});

function startLoop(callback) {
    fetchScoreboard(callback);

    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(fetchScoreboard, (30 * 60 * 1000));
}

function fetchScoreboard(callback) {
    console.log('Fetching scoreboard for ', selectedLeagueKey);
    yf.league.scoreboard(
        selectedLeagueKey,
        function(err, data) {
            if (err) {
                res.status(404).send(err.description);
            } else {
                extractTeamsFromMatchups(matchups);
                if (callback) callback();
            }
        }
    );
}

function extractTeamsFromMatchups(matchups) {

    let allteams = matchups.map( (matchup) => {
        return [
            {
                home: {
                    name: matchup.teams[0].name,
                    manager: matchup.teams[0].managers,
                    score: matchup.teams[0].points.total,
                    id: matchup.teams[0].team_id

                },
                away: {
                    name: matchup.teams[1].name,
                    manager: matchup.teams[1].managers,
                    score: matchup.teams[1].points.total,
                    id: matchup.teams[1].team_id
                }
            },
            {
                home: {
                    name: matchup.teams[1].name,
                    manager: matchup.teams[1].managers,
                    score: matchup.teams[1].points.total,
                    id: matchup.teams[1].team_id

                },
                away: {
                    name: matchup.teams[0].name,
                    manager: matchup.teams[0].managers,
                    score: matchup.teams[0].points.total,
                    id: matchup.teams[0].team_id
                }
            }
        ]
    });

    allMatchups = _.flatten(allteams);

    if( selectedTeamId ) {
        let selectedTeamObj = _.find(allMatchups, (matchup) =>  matchup.home.id === selectedTeamId );
        selectedTeamObj.home.selected = true;
    }

    return allMatchups;
}