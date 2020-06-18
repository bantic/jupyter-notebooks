#!/usr/bin/env python
# coding: utf-8

# In[12]:


def mult(arr):
    out = 1
    for i in arr:
        out *= i
    return out

def solve(k):
    repeats = [1 for _ in range(len('codeforces'))]
    next_idx = -1
    while k > mult(repeats):
        next_idx += 1
        next_idx = next_idx % len('codeforces')
        repeats[next_idx] += 1
    repeats = [i*'codeforces'[idx] for (idx,i) in enumerate(repeats)]
    return ''.join(repeats)


# In[13]:


def main():
    k = int(input())
    print(solve(k))


# In[14]:


main()


# In[ ]:




