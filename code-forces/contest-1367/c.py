#!/usr/bin/env python
# coding: utf-8

# In[13]:


#!/usr/bin/env python
# coding: utf-8

# In[30]:


# In[31]:


def solve(s, k):
    s = '1'+'0'*k + s + '0'*k + '1'
    blocks = s.split('1')
#     print(blocks)
    total = 0
    for block in blocks:
        size = len(block)
        if size == 0:
            continue
        else:
            #             print(block,size,k,(size-k)//(k+1))
            total += max(0, (size-k)//(k+1))
    return total


# print(solve('100010', 1))
assert(solve('100010', 1) == 1)
assert(solve('000000', 2) == 2)
assert(solve('10101', 1) == 0)
assert(solve('001', 1) == 1)
assert(solve('00', 2) == 1)
assert(solve('0', 1) == 1)


# In[34]:


def main():
    T = int(input())
    for i in range(T):
        (l, k) = map(int, input().split(' '))
        s = input()
        try:
            print(solve(s, k))
        except Exception as e:
            print("exception test %s, k=%s: %s" % (i, k, str(e)))


# In[ ]:


main()


# In[ ]:
