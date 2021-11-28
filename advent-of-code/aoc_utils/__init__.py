import pathlib
import hashlib
import re
import math
from functools import reduce


BASE_DATA_DIR = (pathlib.Path(__file__).parent.parent / "data").resolve()
SESSION_COOKIE_PATH = BASE_DATA_DIR / "session_cookie.secret"
SESSION_COOKIE = SESSION_COOKIE_PATH.open().readlines()[0].strip()

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
NUMERIC = "0123456789"

DEBUG_ENABLED = True


def disable_debug():
    DEBUG_ENABLED = False


def debug_print(*args):
    if DEBUG_ENABLED:
        print(*args)


def md5(s):
    return hashlib.md5(s.encode()).hexdigest()


def _data_path(dayNum, year):
    p = BASE_DATA_DIR / str(year)
    p.mkdir(parents=True, exist_ok=True)
    return p / f"{dayNum}.input"


def start_timer():
    import time
    start_time = time.perf_counter()

    def stop_timer():
        return time.perf_counter() - start_time
    return stop_timer


def submit_answer(dayNum, year, level, answer):
    import subprocess
    url = f"https://adventofcode.com/{year}/day/{dayNum}/answer"
    cmd = f"curl '{url}' -H 'content-type: application/x-www-form-urlencoded' -H 'cookie: session={SESSION_COOKIE}' --data-raw 'level={level}&answer={answer}'"
    proc = subprocess.run(cmd, capture_output=True, shell=True)
    if b"not the right answer" in proc.stdout:
        return proc.stdout
    elif b"That\'s the right answer" in proc.stdout:
        return True
    else:
        return proc

# UTILS


def get_input(dayNum, year=2020):
    data_file = _data_path(dayNum, year)
    if not data_file.exists():
        download_input(dayNum, year, data_file=data_file)
    return [line.strip() for line in data_file.open().readlines()]


def download_input(dayNum, year, data_file=None):
    import subprocess
    url = f"https://adventofcode.com/{year}/day/{dayNum}/input"
    cmd = f"curl -H 'Cookie: session={SESSION_COOKIE}' {url} > {data_file}"
    subprocess.run(cmd, capture_output=True, shell=True)


def manhattan_distance(pointA, pointB):
    return abs(pointA[0] - pointB[0]) + abs(pointA[1] - pointB[1])

def neighbors(point, only_positive=True, only_cardinal=True):
  x,y = point
  possible = [
    (x+1,y),
    (x-1,y),
    (x,y+1),
    (x,y-1)
  ]
  if not only_cardinal:
    possible += [
      (x+1,y+1),
      (x+1,y-1),
      (x-1,y+1),
      (x-1,y-1),
    ]
  if only_positive:
    possible = filter(lambda c: c[0]>=0 and c[1]>=0, possible)
  return list(possible)

assert sorted(neighbors( (0,0), only_positive=False, only_cardinal=True)) == [ (-1,0), (0,-1),(0,1),(1,0) ]
assert sorted(neighbors( (0,0), only_positive=True, only_cardinal=True)) == [ (0,1), (1,0) ]
assert sorted(neighbors( (1,1), only_positive=True, only_cardinal=True)) == [ (0,1), (1,0), (1,2), (2,1)]
assert sorted(neighbors( (0,0), only_positive=False, only_cardinal=False)) == [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
assert sorted(neighbors( (0,0), only_positive=True, only_cardinal=False)) == [(0,1),(1,0),(1,1)]

# input is e.g. [0,1,0,0]
# output is e.g 0b0100 -> 4


def bits_to_int(bits):
    return int("0b" + "".join([str(b) for b in bits]), base=2)


assert(bits_to_int([0, 1, 0, 0]) == 4)

# https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm#Example


def extended_gcd(a, b):
    (old_r, r) = (a, b)
    (old_s, s) = (1, 0)
    (old_t, t) = (0, 1)

    i = -1
    while r != 0:
        i += 1
        quotient = old_r // r
        (old_r, r) = (r, old_r - quotient * r)
        (old_s, s) = (s, old_s - quotient * s)
        (old_t, t) = (t, old_t - quotient * t)

    return {'bezout': (old_s, old_t), 'gcd': old_r, 'quotients': (t, s)}


def bezout_coeff(a, b):
    return extended_gcd(a, b)['bezout']


assert(bezout_coeff(3, 4) == (-1, 1))
assert(bezout_coeff(4, 3) == (1, -1))


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


assert(to_bin_bits(11, 6) == [0, 0, 1, 0, 1, 1])


def split_list(seq, sep=''):
    chunk = []
    for v in seq:
        if v == sep:
            if len(chunk) > 0:
                yield chunk
            chunk = []
        else:
            chunk.append(v)
    if len(chunk) > 0:
        yield chunk


assert list(split_list(['a', 'b', '', 'd', 'f'])) == [['a', 'b'], ['d', 'f']]
assert list(split_list(['a', 'b', 'd', 'f'])) == [['a', 'b', 'd', 'f']]
assert list(split_list(['a', 'b', 'd', 'f', ''])) == [['a', 'b', 'd', 'f']]
assert list(split_list(['', 'a', 'b', 'd', 'f', ''])) == [['a', 'b', 'd', 'f']]


def findindex(haystack, needle_fn):
    for idx, v in enumerate(haystack):
        if needle_fn(v):
            return idx


assert findindex([1, 2, 3, 4], lambda x: 8 - x == 4) == [1, 2, 3, 4].index(4)


def mapints(s):
    return list(map(int, re.findall(r"-?\d+", s)))
getnums = mapints
assert getnums("ab1sd3ghij-4") == [1,3,-4]

def chinese_remainder(n, a):
    sum = 0
    prod = reduce(lambda a, b: a*b, n)
    for n_i, a_i in zip(n, a):
        p = prod // n_i
        sum += a_i * mul_inv(p, n_i) * p
    return sum % prod
 
 
def mul_inv(a, b):
    b0 = b
    x0, x1 = 0, 1
    if b == 1: return 1
    while a > 1:
        q = a // b
        a, b = b, a%b
        x0, x1 = x1 - q * x0, x0
    if x1 < 0: x1 += b0
    return x1
