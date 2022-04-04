import sys
lines = [line for line in sys.stdin]

def solve(n, s):
  s = list(sorted(s))
  l = 0
  for d in s:
    # print(d,l)
    if d > l:
      # print("l {}->{}".format(l,l+1))
      l += 1
  return l

idx = 0
T = int(lines[idx])
idx += 1
for CASE in range(1,T+1):
  N = int(lines[idx])
  idx += 1
  S = list(map(int, lines[idx].split(" ")))
  idx += 1
  print("Case #{}: {}".format(CASE, solve(N, S)))


# 10 10 7 6 7 4 4 5 7 4
# 4 4 4 5 6 7 7 7 10 10
# 1 2 3 4 5 6 7 - 8  9
