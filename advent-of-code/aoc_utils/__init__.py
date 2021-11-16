import pathlib

BASE_DATA_DIR = (pathlib.Path(__file__).parent.parent / "data").resolve()
SESSION_COOKIE_PATH = BASE_DATA_DIR / "session_cookie.secret"

def _data_path(dayNum, year):
  p = BASE_DATA_DIR / str(year)
  p.mkdir(parents=True, exist_ok=True)
  return p / f"{dayNum}.input"

### UTILS
def get_input(dayNum, year=2020):
    data_file = _data_path(dayNum, year)
    if not data_file.exists():
        download_input(dayNum, year, data_file=data_file) 
    return [line.strip() for line in data_file.open().readlines()]

def download_input(dayNum, year, data_file=None):
    import subprocess
    session = SESSION_COOKIE_PATH.open().readlines()[0].strip()
    url = f"https://adventofcode.com/{year}/day/{dayNum}/input"
    cmd = f"curl -H 'Cookie: session={session}' {url} > {data_file}"
    subprocess.run(cmd, capture_output=True, shell=True)

def manhattan_distance(pointA,pointB):
    return abs(pointA[0] - pointB[0]) + abs(pointA[1] - pointB[1])
    
# input is e.g. [0,1,0,0]
# output is e.g 0b0100 -> 4
def bits_to_int(bits):
    return int("0b" + "".join([str(b) for b in bits]), base=2)

assert(bits_to_int([0,1,0,0]) == 4)

# https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm#Example
def extended_gcd(a, b):
    (old_r, r) = (a,b)
    (old_s, s) = (1,0)
    (old_t,t)  = (0,1)

    i = -1
    while r != 0:
        i += 1
        quotient = old_r // r
        (old_r, r) = (r, old_r - quotient * r)
        (old_s, s) = (s, old_s - quotient * s)
        (old_t, t) = (t, old_t - quotient * t)
    
    return {'bezout': (old_s, old_t), 'gcd': old_r, 'quotients': (t, s)}

def bezout_coeff(a,b):
    return extended_gcd(a,b)['bezout']

assert(bezout_coeff(3,4) == (-1,1))
assert(bezout_coeff(4,3) == (1,-1))

def to_bin_bits(decimal, size=36):
    """
    Input: 11, size = 6
    output = [0,1,0,1,1]
    """
    bits = [0] * size
    idx = 0
    while decimal > 0:
        bits[idx] = decimal % 2
        decimal = decimal // 2
        idx += 1
    return list(reversed(bits))

assert(to_bin_bits(11,6) == [0,0,1,0,1,1])

def split_list(seq, sep=''):
    chunk = []
    for v in seq:
        if v == sep:
            if len(chunk) > 0: yield chunk
            chunk = []
        else:
            chunk.append(v)
    if len(chunk) > 0: yield chunk
    
assert list(split_list(['a','b','','d','f'])) == [ ['a','b'], ['d','f']]
assert list(split_list(['a','b','d','f'])) == [ ['a','b','d','f']]
assert list(split_list(['a','b','d','f',''])) == [ ['a','b','d','f'] ]
assert list(split_list(['','a','b','d','f',''])) == [ ['a','b','d','f'] ]

def findindex(haystack, needle_fn):
    for idx,v in enumerate(haystack):
        if needle_fn(v):
            return idx
        
assert findindex([1,2,3,4], lambda x: 8 -x == 4) == [1,2,3,4].index(4)
