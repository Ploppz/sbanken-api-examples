'use strict';

const request =  require('superagent');
var Promise = require('promise');
var btoa = require('btoa');
var credentials = require('./credentials');

exports.getAccessToken = () => {
    var identityServerUrl = "https://auth.sbanken.no/identityserver/connect/token"; // access token endpoint
    
    var clientId = credentials.clientid; // application key received from API Beta in the internetbank
    var secret = credentials.secret; // password received from API Beta in the internetbank
     
    var basicAuth = btoa(clientId + ":" + secret); // create basicAuth header value according to Oauth 2.0 standard
     
    var accessToken;
      
    // request accessToken (the basic auth data is put on the request header prior to sending the request)

    let response;

    var promise = new Promise(function (resolve, reject) {
        request
        .post(identityServerUrl)
        .send('grant_type=client_credentials')
        .set('Authorization',  "Basic "+basicAuth)
        .set('Accept', 'application/json')
        .end(function(err, res){
          if (err || !res.ok) {
            console.log(err);
            reject();
          } else {
            console.log('yay got ' + JSON.stringify(res.body));
            resolve(res.body);
          }
        });
    });

    

    return promise;
}

exports.getAccountDetails = (accessToken) => {
    var accountServiceUrl = "https://publicapi.sbanken.no/apibeta/api/v1/accounts/";

    // use accessToken to request accounts (the bearer token (accessToken) is put on the request header prior to sending the request)

    var promise = new Promise(function (resolve, reject) {
        request
        .get(accountServiceUrl)
        .set('Authorization',  "Bearer "+accessToken)
        .set('Accept', 'application/json')
        .end(function(err, res){
          if (err || !res.ok) {
            console.log(err);
            reject();
          } else {
            console.log('yay got ' + JSON.stringify(res.body));
            resolve(res.body);
          }
        });
    });

    return promise;
}

exports.getAccountNumberDetails = (accountNumber, accessToken) => {
    var accountNumberDetailsUrl = "https://publicapi.sbanken.no/apibeta/api/v1/accounts/"+accountNumber; //

    // use accessToken to request accounts (the bearer token (accessToken) is put on the request header prior to sending the request)

    var promise = new Promise(function (resolve, reject) {
        request
        .get(accountNumberDetailsUrl)
        .set('Authorization',  "Bearer "+accessToken)
        .set('Accept', 'application/json')
        .end(function(err, res){
          if (err || !res.ok) {
            console.log(err);
            reject();
          } else {
            console.log('yay got ' + JSON.stringify(res.body));
            resolve(res.body);
          }
        });
    });

    return promise;
}


exports.getAccountTransactions = (accountNumber, accessToken) => {
    var requestUrl = "https://publicapi.sbanken.no/apibeta/api/v1/transactions/"+accountNumber; //

    // use accessToken to request accounts (the bearer token (accessToken) is put on the request header prior to sending the request)

    var promise = new Promise(function (resolve, reject) {
        request
        .get(requestUrl)
        .set('Authorization',  "Bearer "+accessToken)
        .set('Accept', 'application/json')
        .end(function(err, res){
          if (err || !res.ok) {
            console.log(err);
            reject();
          } else {
            console.log('yay got ' + JSON.stringify(res.body));
            resolve(res.body);
          }
        });
    });

    return promise;
}