#! /usr/bin/env python

from simplejson import dumps as encode_json, loads as decode_json
from time import sleep, time
from traceback import print_exc
from urllib import urlopen
from xml.etree import ElementTree

# ------------------------------------------------------------------------------
# Constants
# ------------------------------------------------------------------------------

output = 'website/js/metrics.js'

github = 'http://github.com/api/v2/json/user/show/tav'

feedburner = "http://feedburner.google.com/api/awareness/1.0/GetFeedData?id=pel7nkvcgomc4kvih3ue7su4dg"

twitter = "http://api.twitter.com/1/users/show/tav.json"

# ------------------------------------------------------------------------------
# Get Info
# ------------------------------------------------------------------------------

def main():
    data = {}
    info = ElementTree.fromstring(urlopen(feedburner).read())
    data['rss'] = int(info.find('feed/entry').get('circulation'))
    info = decode_json(urlopen(twitter).read())
    data['twitter'] = info['followers_count']
    info = decode_json(urlopen(github).read())
    data['github'] = info['user']['followers_count']
    for key, val in data.items():
        if val > 1000:
            val = '%s,%03d' % divmod(val, 1000)
        else:
            val = str(val)
        data[key] = val
    js = open(output, 'wb')
    js.write('loadMetrics(')
    js.write(encode_json(data))
    js.write(');\n')
    js.close()
    print time(), data

# ------------------------------------------------------------------------------
# Run Loop
# ------------------------------------------------------------------------------

while 1:
    try:
        main()
    except Exception:
        print_exc()
    sleep(60 * 15)
