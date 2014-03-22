#!/usr/local/bin/node

var request = require('request');
var jsdom   = require('jsdom');
var fs      = require('fs');
var jquery  = fs.readFileSync('./jquery.js', 'utf-8');

var thesHttpStr   = 'http://thesaurus.com/browse/';
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

   jsdom.env({
      url: thesHttpStr + word,
      src: [jquery],
      done: function (errors, window) {
         if(!errors){
            console.log(getSyns(window));
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
      return 'Error parsing definition\n' + err;
   }
}

function getSyns(window){
   try {
      //TODO make it only take the first relevancy list
      var ary = window.$('.relevancy-list:first-child > ul > li > a > .text');
      for(var i =0 ; i < ary.length; i++){
         ary[i] = window.$(ary[i]).html();
      }
      return aryToTextTable(ary);
   } catch(err) {
      return 'Error parsing synonymns\n' + err;
   }
}

/*
 * turns an array of strings into a cute little text table
 */
function aryToTextTable(ary){
   var num_cols = Math.floor(Math.sqrt(ary.length));
   var padsize = maxStrLen(ary);
   ary.sort();
   var rval = '';
   for(var i = 0; i < ary.length; i += num_cols){
      for(var j = 0; j < num_cols && (i + j) < ary.length; j++){
         rval += ary[i + j] + ' '.repeat(padsize - ary[i + j].length + 1) + ((j + 1) == num_cols ? '\n' : '');
      }
   }
   return rval;
}

/*
 * Needs to be at least 1 element long otherwise [0] fails
 */
function maxStrLen(aryOfStr){
   var maxLen = aryOfStr[0].length;
   for(var i = 1; i < aryOfStr.length; i++){
      if(maxLen < aryOfStr[i].length){
         maxLen = aryOfStr[i].length;
      }
   }
   return maxLen;
}

String.prototype.repeat = function(num){
   return new Array(isNaN(num) ? 1 : ++num).join(this);
}

//entry point
main(process.argv[2]);
