#!/usr/local/bin/node

var request = require('request');
var jsdom   = require('jsdom');
var fs      = require('fs');
var jquery  = fs.readFileSync('./jquery.js', 'utf-8');

var dictHttpStr   = 'http://dictionary.reference.com/browse/';
var dictSearchStr = '?s=t';

function main(word){
   jsdom.env({
      url: dictHttpStr + word + dictSearchStr, 
      src: [jquery],
      done: function (errors, window) {
         if(!errors){
            console.log(getDefn(window));
         } else {
            console.log(errors);
         }
      }
   });
}

function getDefn(window){
   try{
      return window.$('.dndata').html().replace(/<[^>]*?>/g,'');
   } catch(err) {
      return "Error parsing definition";
   }
}

function getSyns(window){

}

main(process.argv[2]);
