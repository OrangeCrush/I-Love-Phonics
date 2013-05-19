#!/usr/bin/env python

# Provide a CLI interface to http://thesaurus.com/
# git@github.com:OrangeCrush/I-Love-Phonics.git

import re
import urllib
import urllib2

# Make a request to http://thesaurus.com/
# and return the result in html.
def make_request(word):
   url = 'http://thesaurus.com/browse/' + word
   values  = {'s' : 't'}
   data = urllib.urlencode(values)
   req = urllib2.Request(url, data, {})
   response = urllib2.urlopen(req)
   the_page = response.read()
   return the_page

# Parse the HTML and get the synonyms
def get_syn(html):
   html  = html.split("\n") #split the string by line to make it easier to slice down
   start = html.index("<td valign=\"top\">Synonyms:</td>")
   html  = html[start:]
   end   = html.index("</span></td>")
   html  = html[:end]
   html  = "\n".join(html)

   linked_words = re.compile(("<a.*>(.*)</a>")) #get the linked words that start each line
   words = linked_words.findall(html)
   other_words_regex = re.compile(",\s([\sa-z]+),?", re.IGNORECASE)
   other_words  = other_words_regex.findall(html)

   return words + other_words




# Parse the HTML and get the definition
def get_def(html):
   pass

def main():
   pass

if __name__ == '__main__':
   print get_syn(make_request('enter'))
