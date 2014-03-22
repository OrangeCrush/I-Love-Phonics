#!/usr/local/bin/node

var request = require('request');
var jsdom   = require('jsdom');
var jquery  = require('jquery');


function makeRequest(query, next){
   request('http://dictionary.reference.com/browse/' + query + '?s=t', function(error, response, body){
         if(!error && response.statusCode == 200){
            next(body);
         }else{
            console.log(error); //no cb
         }
   });
}

makeRequest(process.argv[2], function(html){
   jsdom.env(html, [jquery], function(errors, window){
      console.log(window);
      console.log(window.jquery('a').length);
   });
});
