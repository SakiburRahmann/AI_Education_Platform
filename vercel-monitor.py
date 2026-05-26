import os, json, urllib.request, time

os.chdir('/home/sakiburrahman/code/AI_Education_Platform')
with open('.env.local') as f:
    for line in f:
        if line.startswith('VERCEL_TOKEN='):
            token = line.strip().split('=', 1)[1]
            break

while True:
    req = urllib.request.Request('https://api.vercel.com/v6/deployments?limit=1')
    req.add_header('Authorization', 'Bearer ' + token)
    resp = urllib.request.urlopen(req)
    data = json.load(resp)
    dep = data['deployments'][0]
    url = dep['url']
    state = dep['state']
    created = dep['createdAt']
    print(f'{url[:70]:70s} {state:10s} {created}')
    if state == 'READY':
        break
    time.sleep(10)
