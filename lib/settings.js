//environment settings
module.exports = {
    ubp: {
        //UnionBank API Base Path
        url: 'https://api-uat.unionbankph.com/partners/sb',

        //Application Credentials (id, secret and redirect uri)
        client_id : 'f2b0499e-7b40-4d3d-9c9d-4f26879e55be',
        client_secret: 'Q5cU5kI3hR2vV0gV6kA0yQ2fP7iL2jG6oD8gF3tK1sW5hB2lI3',
        redirect_uri : 'http://aboitiz2018.gigamike.net/member',

        //UnionBank Online Login has 3 scopes (payment, transfers, account_balances)
        scope: 'transfer', //we will be using scope since we are going to transfer funds
        request_type: "code",
        grant_type : "authorization_code"
    }
};