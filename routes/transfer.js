const express = require('express');
const router = express.Router();

//import settings
const settings = require('../lib/settings');

//import library
const ajax = require('../lib/ajax');

//create /redirect endpoint
router.post('/', function(req, res, next) {
    
    //create redirect link
    let redirect_link = `${settings.ubp.url}/convergent/v1/oauth2/authorize?client_id=${settings.ubp.client_id}&scope=${settings.ubp.scope}&response_type=${settings.ubp.request_type}&redirect_uri=${settings.ubp.redirect_uri}`;

    //if no token yet redirect to UnionBank Online Login
    if(typeof req.session.token == "undefined"){
        res.redirect(redirect_link);
    }else{
        //if there is token
        //try to transfer
        ajax.setOptions({
            //URL of funds transfer
            url: `${settings.ubp.url}/online/v1/transfers/single`,
            headers: {
                "accept" : "application/json",
                "content-type" : "application/json",
                //add the session token we got from UnionBank Online Login
                "Authorization" : `Bearer ${req.session.token}`,

                //put client id and secret from our settings
                "x-ibm-client-id" : settings.ubp.client_id,
                "x-ibm-client-secret" : settings.ubp.client_secret
            }
        }).post({
            //unique sender ID if possible
            //save to db for record
            "senderTransferId": Math.ceil(Math.random() * 99999),   //demo only to randomize id
            //Date format should be 2017-12-29T02:29:36.852Z
            "transferRequestDate": new Date(),
            //account number to transfer (from request body)
            "accountNo": req.body.account_no,
            "amount": {
                "currency": "PHP",
                //amount to transfer
                "value": req.body.amount
            },
            //any remarks before transfer
            "remarks": "Transfer remarks",
            "particulars": "Transfer particulars",
            //if there is additional info to be added
            //for now we don't send any to make it simple
            "info": []
        }).then(data=>{
            switch(data.response.statusCode){
                case 401:   
                //unauthorized access due to
                //Token is expired or
                //Token is invalid

                //we can redirect again to UnionBank Online Login
                //or we can show an Error
                //in this case we redirect to UnionBank Online Login
                //to simplify things
                    res.redirect(redirect_link);
                break;
                case 200:   //transfer was a success show result
                    res.json(data.body);
                break;
                default:    //if internal server error or any other error show the message
                    res.json(data.body);
                break;
            }
        }).catch(error=>{
            //if there is an error in the server
            res.json(error);
        });
    }
});
module.exports = router;