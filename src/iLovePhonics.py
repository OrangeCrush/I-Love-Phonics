#!/usr/bin/env python
# Python 2.7.3

# Provide a CLI interface to http://thesaurus.com/
# git@github.com:OrangeCrush/I-Love-Phonics.git
# Max Friederichs

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
   rval = []
   if !not_found(html):
      html  = html.split("\n")
      start = html.index("<td valign=\"top\">Synonyms:</td>")
      html  = html[start:]
      end   = html.index("</span></td>")
      html  = html[:end]
      html  = html[2:]
      html  = "\n".join(html)

      linked_words = re.compile(("<a.*>(.*)</a>"))
      words = linked_words.findall(html)
      other_words_regex = re.compile("(?:\s*([\sa-z]+),)|(?:,\s([\sa-z]+))", re.IGNORECASE)
      other_words  = other_words_regex.findall(html)

      other_words = map(lambda x: x[1] if (x[0] == '') else x[0], other_words)
      rval = words + other_words
   else:
      rval = ['NOT FOUND']
   return rval

# Print the suggestions if the word was not found
def not_found(html):
   not_found_regex = re.compile("No results found for")


# Parse the HTML and get the definition
def get_def(html):
   pass

def main():
   pass

if __name__ == '__main__':
   print get_syn(make_request('enter'))
