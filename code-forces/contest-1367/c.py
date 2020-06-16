#!/usr/bin/env python
# coding: utf-8

# In[30]:


def memoize(f):
    memo = {}
    def helper(s,k):
        if (s,k) not in memo:            
            memo[(s,k)] = f(s,k)
        return memo[(s,k)]
    return helper
    
@memoize
def avail_inner_slots(size, k):
    if size >= 2*k + 1:
        return 1 + avail_inner_slots(size - k - 1, k)
    else:
        return 0
    
for size in range(5,8):
    assert(avail_inner_slots(size,2) == 1)
for size in range(8,11):
    assert(avail_inner_slots(size,2) == 2)

assert(avail_inner_slots(11,3) == 2)


# In[31]:


# unbounded on one side
def avail_outer_slots(size, k):
    return avail_inner_slots(size+k,k)
    
# unbounded on both sides
def avail_double_outer_slots(size, k):
    return avail_inner_slots(size+2*k,k)

assert(avail_double_outer_slots(6,2) == 2)
assert(avail_outer_slots(3,1) == 1)


# In[32]:


def solve(s, k):
    sizes = [len(_s) for _s in s.split('1')]
    if len(sizes) == 1:
        assert(sizes[0] == len(s))
        return avail_double_outer_slots(len(s), k)
    else:
        return avail_outer_slots(sizes[0], k) +                sum([avail_inner_slots(sizes[i], k) for i in range(1,len(sizes) - 1)]) +                avail_outer_slots(sizes[-1], k)

assert(solve('100010', 1) == 1)
assert(solve('000000', 2) == 2)
assert(solve('10101', 1) == 0)
assert(solve('001', 1) == 1)
assert(solve('00', 2) == 1)
assert(solve('0', 1) == 1)


# In[34]:


def main():
    T = int(input())
    for _ in range(T):
        k = int(input().split(' ')[1])
        s = input()
        print(solve(s,k))


# In[ ]:


main()

