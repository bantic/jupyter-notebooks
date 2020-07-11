import functools


@functools.lru_cache(maxsize=None)   
def factor(n, startFrom=2):
    """returns a list of prime factors of n,
    knowing min possible >= startFrom."""
    if n <= 1:  return [ ]
    d = startFrom
    factors = [ ]
    while n >= d*d:
      if n % d == 0:
        factors.append(d)
        n = n/d
      else:
        d += 1 + d % 2  # 2 -> 3, odd -> odd + 2
    factors.append(n)
    return factors

def product(xs):
    prod = 1
    for x in xs:
        prod *= x
    return prod

def largest_proper_factor(n):
    factors = factor(n)
    if len(factors) > 1:
        return product(factors[1:])
    else:
        return 1

def solve(n):
    if n % 2 == 0:
        return [n//2,n//2]
    else:
        max_factor = int(largest_proper_factor(n))
        return [max_factor, n-max_factor]

def format_solve(n):
    return ' '.join(map(str,solve(n)))

def main():
    t = int(input())
    for _ in range(t):
        n = int(input())
        print(format_solve(n))
        
main()