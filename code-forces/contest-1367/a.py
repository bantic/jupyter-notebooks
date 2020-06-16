#!/usr/bin/env python
# coding: utf-8

# In[11]:


def expand(s):
    idx = 0
    out = []
    while idx < len(s) - 1:
        out.append( s[idx:idx+2] )
        idx += 1
    return ''.join(out)

expand('abac')

assert(expand('abac') == 'abbaac')
assert(expand('ac') == 'ac')
assert(expand('bcdaf') == 'bccddaaf')
assert(expand('zzzzzz') == 'zzzzzzzzzz')


# In[19]:


def contract(s):
    if len(s) == 2:
        return s
    out = [s[idx] for idx in range(0,len(s)) if idx % 2 == 0]
    if len(s) % 2 == 0:
        out.append(s[-1])
    out = ''.join(out)
    assert(expand(out) == s)
    return out

assert(contract('abbaac') == 'abac')
assert(contract('ac') == 'ac')
assert(contract("bccddaaf" ) == 'bcdaf')
assert(contract('zzzzzzzzzz') == 'zzzzzz')


# In[20]:


def main():
    T = int(input())
    for _ in range(T):
        s = input()
        print(contract(s))


# In[22]:


main()


# In[ ]:




