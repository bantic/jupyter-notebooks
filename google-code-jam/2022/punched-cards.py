import sys
lines = [line for line in sys.stdin]

def solve(r,c):
  out = []
  out.append(".." + "+-" * (c-1) + "+")
  out.append(".." + "|." * (c-1) + "|")
  for _ in range(r-1):
    out.append("+-"*c + "+")
    out.append("|."*c + "|")
  out.append("+-"*c + "+")
  return "\n".join(out)

idx = 0
T = int(lines[idx])
idx += 1
for CASE in range(1,T+1):
  R,C = list(map(int, lines[idx].split(" ")))
  idx += 1
  print("Case #{}:".format(CASE))
  print(solve(R,C))
  
