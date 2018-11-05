const path = require('path');

//express
const express = require('express');

//session
const session = require('express-session');

//create instance
const app = express();

//middleware to process POST data
const bodyParser = require('body-parser');

//sample routes
const oauth = require('./routes/oauth');

//transfer route
const transfer = require('./routes/transfer');

//import settings
const settings = require('./lib/settings');

//set the template engine into ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// serve the files out of ./public as our main files
app.use(express.static(path.join(__dirname, 'public')));

//declare session middleware
app.use(session({
    secret: 'this.is.super.secret.key', //make this unique and keep it somewhere safe
    saveUninitialized: false,
    resave: false
}));


/**
 * Sample Routes
 * 
 * GET (index page)     /
 * GET                  /oauth/redirect
 */
app.get('/', function(req, res){
    //create redirect link
    let redirect_link = `${settings.ubp.url}/convergent/v1/oauth2/authorize?client_id=${settings.ubp.client_id}&scope=${settings.ubp.scope}&response_type=${settings.ubp.request_type}&redirect_uri=${settings.ubp.redirect_uri}`;

    //check if there is session token
    let has_token = false;
    if(typeof req.session.token != "undefined"){
        has_token = true;   //set the token to true
    }
    //display hello world
    res.render('index', //render /views/index.ejs
        //pass data to index.ejs
        {
            title: 'Index Page',
            has_token: has_token,
            redirect_link: redirect_link
        }
    );
});

app.get('/send', function(req, res) {
    res.send(`
        <html>
            <head>
                <link rel="stylesheet" href="/css/index.css">
                <link rel="stylesheet" href="/css/buttons.css">
            </head>
            <body>
                <div class="user">
                    <header class="user__header">
                        <h1 class="user__title">
                            Payment Verified!
                        </h1>
                        <br>
                        <img src="https://img.icons8.com/ios/1600/ok.png" width="128" height="128">
                        </img>
                        <br><br>
                        <a class="button button-royal button-pill button-normal" href="http://aboitiz2018.gigamike.net/member">
                            Return to Dashboard
                        </a>
                    </header>
                </div>
            </body>
        </html>
    `);
});

app.use('/oauth', oauth);
app.use('/transfer', transfer);

module.exports = app;