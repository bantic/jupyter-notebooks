def solve(l):
    return ' '.join(map(str, [1] * l))


def main():
    t = int(input())
    for _ in range(t):
        l = int(input())
        print(solve(l))


main()
