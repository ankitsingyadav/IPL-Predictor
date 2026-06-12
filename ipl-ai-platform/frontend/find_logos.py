import urllib.request, re

teams = {
    'LSG': 'https://www.espncricinfo.com/team/lucknow-super-giants-1298143',
    'GT': 'https://www.espncricinfo.com/team/gujarat-titans-1298136'
}

for team, url in teams.items():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        match = re.search(r'https://img1\.hscicdn\.com/image/upload/[^\"]+\.png', html)
        if match:
            print(f'{team}: {match.group(0)}')
        else:
            print(f'{team}: Not found')
    except Exception as e:
        print(f'{team}: Error {e}')
