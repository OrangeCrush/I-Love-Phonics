#!/usr/bin/env python
# Python 2.7.3

# Provide a CLI interface to http://thesaurus.com/
# git@github.com:OrangeCrush/I-Love-Phonics.git
# Max Friederichs

import re
import urllib
import urllib2
import sys

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
   return rval

# Returns if there are no suggestions
# and the word was not found.
def not_found_or_suggestions(html, word):
   rval = []
   no_sug = re.compile('Please\stry\sspelling\sthe\sword\sdifferently')
   no_sugs = no_sug.findall(html)
   if no_sugs == []:
      search = re.compile('<span\sclass="dyme">Did\syou\smean.*>(.*)</a></span>',re.DOTALL)
      words = search.findall(html)
      if words != []:
         rval = ['Did you mean {0}?'.format(words[0]), words[0]]
   else:
      rval = ['No Suggestions available, please try another spelling.']
   return rval

# Parse the HTML and get the definition
def get_def(html):
   pass

def column_print(lst):
   if len(lst) % 2 != 0:
      lst.append(" ")
   split = len(lst) / 2
   left  = lst[:split]
   right = lst[split:]
   for key,val in zip(left,right):
      print "{0:<20s} {1}".format(key, val)

def main():
   if len(sys.argv) == 2:
      html = make_request(sys.argv[1])
      result = not_found_or_suggestions(html, sys.argv[1])
      if result != []:
         print result[0]
      else:
         print "Synonyms for {0}-".format(sys.argv[1])
         column_print(get_syn(html))
   else:
      print "Usage : iLovePhonics <word>"

if __name__ == '__main__':
   main()
