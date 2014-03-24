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
            console.log('\nDefinitions for: "' + word + '":');
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
            console.log('\nSynonyms for: "' + word + '":');
            console.log(getSyns(window));

            console.log('\nAntoynms for: "' + word + '":');
            console.log(getAnts(window));
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
      var ary = window.$('#synonyms-0 > .filters > .relevancy-block > .relevancy-list > ul > li > a > .text');
      for(var i = 0 ; i < ary.length; i++){

         //.text ends up being just a span
         ary[i] = window.$(ary[i]).html();
      }
      return aryToTextTable(ary);
   } catch(err) {
      return 'Error parsing synonyms\n' + err;
   }
}

function getAnts(window){
   try {
      var ary = window.$('#synonyms-0 > section.antonyms > .list-holder > .list > li > a');
      for(var i = 0 ; i < ary.length; i++){
         
         //They use js to render the links, so we need to actually
         //rip the words from the href on their anchor elements with the regex capture ([1])
         ary[i] = window.$(ary[i]).attr('href').match(/.*\/(.+)$/)[1];
      }
      return aryToTextTable(ary);
   } catch(err) {
      return 'Error parsing antonyms\n' + err;
   }
}

/*
 * Turns an array of strings into a cute little text table
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
for(var i = 2; i < process.argv.length; i++){
   main(process.argv[i]);
}
