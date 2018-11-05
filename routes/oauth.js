const express = require('express');
const router = express.Router();

//import settings
const settings = require('../lib/settings');

//import library
const ajax = require('../lib/ajax');

//create /redirect endpoint
router.get('/redirect', function(req, res, next) {
    //access token will be processed here
    ajax.setOptions({
        url : settings.ubp.url + '/convergent/v1/oauth2/token', //set the url
        headers: {  //set the headers
            'content-type' : '	application/x-www-form-urlencoded',
            'accept': 'text/html'
        },
        method: 'POST', //set request to POST
        form: { //create the form body of the request
            client_id: settings.ubp.client_id,          //client ID of Application
            code: req.query.code,                       //put the code we receive from UnionBank Online Login
            redirect_uri: settings.ubp.redirect_uri,    //this must be same with the redirect URI we used initially
            grant_type: settings.ubp.grant_type         //set the grant type to authorization_code
        }
    }).post().then(data=>{
        //if there we got token
        //save it to session
        if(typeof data.body.access_token != "undefined"){
            //save to session
            req.session.token = data.body.access_token;

            //redirect to transfer form again
            res.redirect('/');
        }
        //if we dont get access token show the body of message
        res.render("oauth", //render /views/oauth.ejs
            //pass data to oauth.ejs
            {
                title: "Oauth Page",
                body: data.body
            }
        );
    }).catch(error=>{
        res.render("oauth", //render /views/oauth.ejs
            //pass data to oauth.ejs
            {
                title: "Oauth Page",
                body: error
            }
        );
    });
});
module.exports = router;