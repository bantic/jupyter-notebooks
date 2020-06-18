#!/usr/bin/env python
# coding: utf-8

# In[5]:


from math import sqrt

def solve(n):
    # 2*x*(x+1) = n for some x
    # x**2+x-(n/2) = 0
    # a=1,b=1,c=-n/2
    # x = (-1 + sqrt(1-n**2/4))/2
    k = (-1 + sqrt(1+2*n))/2
    assert(round(k) == k)
    k = 1
    cur_n = 2 * k * (k+1)
    cells = {(0, 1),
     (0, 2),
     (1, 0),
     (1, 1),
     (1, 2),
     (1, 3),
     (2, 0),
     (2, 1),
     (2, 2),
     (2, 3),
     (3, 1),
     (3, 2)
    }
    edge = {(0, 1),
     (0, 2),
     (1, 0),
     (1, 1),
     (1, 2),
     (1, 3),
     (2, 0),
     (2, 1),
     (2, 2),
     (2, 3),
     (3, 1),
     (3, 2)
    }
    while cur_n < n:
        # expand edge
        next_edge = set()
        for (x,y) in edge:
#             print(x,y)
            if not ((x-1,y) in cells):
                next_edge.add((x-1,y))
            if not ((x+1,y) in cells):
                next_edge.add((x+1,y))
            if not ((x,y-1) in cells):
                next_edge.add((x,y-1))
            if not ((x,y+1) in cells):
                next_edge.add((x,y+1))
        edge = next_edge
        # update n
        k += 1
        cur_n = 2 * k * (k+1)
        # update cells
        for (x,y) in edge:
            cells.add((x,y))
    assert(cur_n == n)
#     print(k,cur_n,n)
    print(len(cells))
    for (x,y) in cells:
        print("%d %d" % (x,y))

# solve(4)


# In[6]:


def main():
    n = int(input())
    solve(n)


# In[8]:


main()


# In[ ]:




