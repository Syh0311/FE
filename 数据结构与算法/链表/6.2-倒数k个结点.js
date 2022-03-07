//空间复杂度 O(1)，时间复杂度 O(n)



function ListNode(x) {
  this.val = x;
  this.next = null;
}

/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * 
 * @param pHead ListNode类 
 * @param k int整型 
 * @return ListNode类
 */
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * 
 * @param pHead ListNode类 
 * @param k int整型 
 * @return ListNode类
 */
function FindKthToTail(pHead, k) {
  if (!pHead) {
    return pHead
  }
  if (!k) {
    return null
  }
  let count = 0,
    pre = pHead,
    cur = pHead;
  //【秒在了】在while里的if里又加上了else！！！  所以里边的if其实也是执行了while的次数！！！
  while (pre) {
    if (count == k) {
      cur = cur.next
    } else {
      count++
    }
    pre = pre.next //控制while次数，然后通过count++直到等于k，然后cur = cur.next。
    //总的cur = cur.next的次数和count++的次数等于链表成都
  }
  if (count < k) {
    return null
  }
  return cur
}
module.exports = {
  FindKthToTail: FindKthToTail
};