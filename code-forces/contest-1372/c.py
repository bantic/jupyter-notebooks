def trim_start(xs):
    i = 0
    while i < len(xs):
        if xs[i] != i+1:
            return (xs[i:],i)
        i += 1
    return (xs[i:], i)

def trim_end(xs):
    i = len(xs)
    while i > 0:
        if xs[i-1] != i:
            return xs[:i]
        i -= 1
    return xs[:i]

def in_place_count(xs, offset):
    count = 0
    for i,v in enumerate(xs):
        if i+1+offset == v:
            count += 1
    return count


def solve(xs):
    xs = trim_end(xs)
    xs, offset = trim_start(xs)
    if len(xs) == 0:
        return 0
    count = in_place_count(xs, offset)
    if count == 0:
        return 1
    else:
        return 2
        
assert(solve([3,2,4,5,1,6,7])==2)
assert(solve([1, 5, 3, 4, 2, 6])==2)
assert(solve(list(map(int,"1 5 3 4 6 2".split(' ')))) == 2)
assert(solve([2,3,1]) == 1)

def main():
    t = int(input())
    for _ in range(t):
        n = int(input())
        xs = list(map(int, input().split(' ')))
        print(solve(xs))
        
main()