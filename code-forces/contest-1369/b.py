import re
from functools import cmp_to_key

def memoize(f):
    memo = {}
    def helper(x):
        if x not in memo:            
            memo[x] = f(x)
        return memo[x]
    return helper

def compare(x,y):
    if len(x) < len(y):
        return -1
    elif len(y) < len(x):
        return 1
    else:
        for idx in range(len(x)):
            i_x = int(x[idx])
            i_y = int(y[idx])
            if i_x < i_y:
                return -1
            elif i_y < i_x:
                return 1
    return 0

def solve_old(s):
    stack = [s]
    out = []
    while len(stack) > 0:
        s = stack.pop()
        if s.count('10') == 0:
            out.append(s)
        else:
            new_s = [replacer(s, match.span(), '0') for match in re.finditer('1+0+', s)]
            stack.extend(new_s)
    return sorted(out, key=cmp_to_key(compare))[0]

def solve_old2(s):
    while s.count('10') > 0:
        *_, last_match = re.finditer('1+0+', s)
        s = replacer(s, last_match.span(), replacement='0')        
    return s

def solve(xs):
    prefix = 0
    suffix = 0
    middle = ''
    for idx in range(len(xs)):
        if xs[idx] != 0:
            break
        else:
            prefix += 1
    for idx in range(len(xs)-1,-1,-1):
        if xs[idx] != 1:
            break
        else:
            suffix += 1
    if len(xs) > prefix + suffix:
        middle = '0'
    return '0'*prefix + middle + '1' * suffix
            

def replacer(s, span, replacement='0'):
    return s[:span[0]] + replacement + s[span[1]:]

def main():
    T = int(input())
    for _ in range(T):
        l = int(input())
        s = list(map(int, input()))
        print(solve(s))
        
main()