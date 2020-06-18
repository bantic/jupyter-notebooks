#!/usr/bin/env python
# coding: utf-8

# In[6]:


def solve(s,l,m):
    s = sorted(set(s))
    slots = [None for _ in range(l)]
    while any([slot is None for slot in slots]):
        m_indices = []
        for (idx,v) in enumerate(m):
            if v == 0 and slots[idx] is None:
                slots[idx] = s[-1]
                m_indices.append(idx)
        s = s[0:-1]
        for idx in range(l):
            if slots[idx] is None:
                diffs = [abs(idx-other_idx) for other_idx in m_indices]
                m[idx] -= sum(diffs)
    return ''.join(slots)

solve('abac', 3, [2,1,0])
# solve('abc', 1, [0])
# solve('abba', 3, [1,0,1])
# solve('ecoosdcefr', 10, [38, 13, 24, 14, 11, 5, 3, 24, 17, 0])


# In[7]:


def main():
    T = int(input())
    for _ in range(T):
        s = input()
        l = int(input())
        m = list(map(int, input().split(' ')))
        print(solve(s,l,m))


# In[ ]:


main()

