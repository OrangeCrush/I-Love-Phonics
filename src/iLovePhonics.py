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
   syn_regex = re.compile('<td valign="top">Synonyms:</td>\n<td><span>')
  syns = syn_regex.search(html)



# Parse the HTML and get the definition
def get_def(html):
   pass

def main():
   pass

if __name__ == '__main__':
   print make_request('enter')
