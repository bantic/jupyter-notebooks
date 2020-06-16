#!/usr/bin/env python
# coding: utf-8

# # B

# In[18]:


def bad_parity_indices(arr):
    bad = [idx for idx in range(len(arr)) if idx % 2 != arr[idx] % 2]
    return bad


def check_parity(arr):
    return len(bad_parity_indices(arr)) == 0


def solvable(arr):
    bad = bad_parity_indices(arr)
    parity_check = 0
    for idx in bad:
        if arr[idx] % 2 == 0:
            parity_check += -1
        else:
            parity_check += 1
    return parity_check == 0


assert(check_parity([0, 5, 2, 1]))
assert(check_parity([0, 17, 0, 3]))
assert(not check_parity([2, 4, 6, 7]))
assert(bad_parity_indices([2, 4, 6, 7]) == [1])
assert(not solvable([1, 1]))


# In[19]:


def solve(arr):
    if not solvable(arr):
        return -1
    bad = bad_parity_indices(arr)
    if len(bad) % 2 == 0:
        return len(bad) // 2
    else:
        return -1


assert(solve([3, 2, 7, 6]) == 2)
assert(solve([3, 2, 6]) == 1)
assert(solve([7]) == -1)
assert(solve([4, 9, 2, 1, 18, 3, 0]) == 0)
assert(solve([1, 1]) == -1)


# In[14]:


def main():
    T = int(input())
    for _ in range(T):
        arr_len = int(input())
        arr = list(map(int, input().split(' ')))
        print(solve(arr))


main()
