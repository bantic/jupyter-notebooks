def solve(n):
    if n % 4 == 0:
        return 'YES'
    else:
        return 'NO'


def main():
    T = int(input())
    for _ in range(T):
        print(solve(int(input())))


main()
