#!/usr/bin/env python
# coding: utf-8

# In[4]:


def solve(a,b,n):
    count = 0
    while not (a>n or b>n):
        count += 1
        if a > b:
            b += a
        else:
            a += b
    return count

assert(solve(1,2,3)==2)
assert(solve(5,4,100)==7)


# In[5]:


def main():
    T = int(input())
    for _ in range(T):
        (a,b,n) = map(int, input().split(' '))
        print(solve(a,b,n))


# In[6]:


main()


# In[ ]:




