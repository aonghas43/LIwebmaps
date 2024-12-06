from itertools import batched
import requests


class lookuppostcode:
    """Class to take a list of postcodes and return a list of coordinates"""
    default_infilename: str = 'infile.txt'
    default_outfilename: str = 'outfile.tsv'
    epoint = 'https://api.postcodes.io/postcodes'

    def __init__(self, inf=default_infilename, outf=default_outfilename):
        self.infile = inf
        self.outfile = outf
        return

    def run(self, back=False):
        fmt = '{}\t{}\t{}\t{}\t{}\t{}\n'
        with open(file=self.outfile, mode='w', encoding='utf-8') as w:
            header = str.format(fmt, 'Input', 'Result_address', 'GPS-north-lat',
                                'GPS-East-long', 'Eastings', 'Northings')
            w.write(header)
            with requests.Session() as s:
                s.headers.update({'Content-type': 'application/json'})
                with open(self.infile, encoding='utf-8') as r:
                    batches = []
                    # put postcodes into list
                    for line in r:
                        input = line.strip('\n')
                        batches.append(input)
                    # batch the list to be < 100 per batch
                    for batch in batched(batches, 99):
                        inputs = list(batch)
                        if back is False:
                            keyword = 'postcodes'
                        else:
                            keyword = 'geolocations'
                        payload = {keyword: inputs}
                        resp = s.post(url=self.epoint, json=payload)

                        if resp.status_code == 200:
                            j = resp.json()
                            print("num results = ", len(j['result']))
                            for item in j['result']:
                                if (item['result'] is None):
                                    if (item['query'] == ''):
                                        pcode = 'blank'
                                    else:
                                        pcode = item['query']
                                    outline = str.format(fmt, pcode, 'not found', 0, 0, 0, 0)
                                else:
                                    print(item)
                                    result = item['result']
                                    print(result)
                                    outline = str.format(fmt, result['postcode'], result['postcode'],
                                                         result['latitude'], result['longitude'], result['eastings'],
                                                         result['northings'])
                                w.write(outline)
                        else:
                            print(resp.text)
