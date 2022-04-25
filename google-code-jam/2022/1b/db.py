import sys
import random

T = int(input())

def eprint(*args, **kwargs):
  # print(*args, file=sys.stderr, **kwargs)
  pass

POS = [0,1,2,3,4,5,6,7]
def makeGuess(ones):
  one_pos = random.sample(POS, ones)
  return ''.join(map(str, [
    1 if idx in one_pos else 0 for idx in range(8)
  ]))

def runOne():
  res = None
  ress = []

  def guess():
    if res is None:
      g = "00000000"
    else:
      g = makeGuess(res)
    # eprint("guess {}".format(g))
    # g = "00000000"
    print(g)
    sys.stdout.flush()

  while True:
    guess()
    res = input().strip()
    ress.append(res)
    res = int(res)
    if res == 0:
      eprint("yes, last few",ress[-2])
      break
    elif res == -1:
      # eprint("failed")
      return True

for _ in range(T):
  stop = runOne()
  if stop:
    break
