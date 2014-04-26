#! /usr/bin/env python

import hashlib
import requests
import time
import uuid

current_time = str(int(time.time()*1000))
public_key = 'northwestern-07'
random_string = str(uuid.uuid4())
# Note: DO NOT commit the private key to version control. Use
# environment variables or files that you specifically exclude
# from Git.
with open('privatekey') as f:
    private_key = f.read()

print private_key

hash_val = hashlib.md5(public_key + current_time +\
                       random_string + private_key).hexdigest()

api_url = 'https://northwestern.collegiatelink.net/api/'
resource = 'users'
params = {
    'time': current_time,
    'apikey': public_key,
    'random': random_string,
    'hash': hash_val
}

response = requests.get(api_url + resource, params=params)
with open('response.txt', 'w+') as f:
    f.write(response.text.encode('ascii', 'ignore'))


