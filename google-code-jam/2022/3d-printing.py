import sys
lines = [line for line in sys.stdin]

def solve(printers):
  mins = [min(p[i] for p in printers) for i in range(4)]
  c,m,y,k = mins
  if sum([c,m,y,k]) < 10**6:
    return "IMPOSSIBLE"
  else:
    rem = 10**6
    out = [c]
    rem -= c
    out.append(max(0,min(rem,m)))
    rem -= out[1]
    out.append(max(0,min(rem,y)))
    rem -= out[2]
    out.append(max(0,min(rem,k)))
    return " ".join(map(str,out))

idx = 0
T = int(lines[idx])
idx += 1
for CASE in range(1,T+1):
  printers = []
  for _ in range(3):
    c,m,y,k = list(map(int, lines[idx].split(" ")))
    printers.append([c,m,y,k])
    idx += 1
  print("Case #{}: {}".format(CASE, solve(printers)))

# 10 10 7 6 7 4 4 5 7 4
# 4 4 4 5 6 7 7 10 10
