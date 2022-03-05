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
  if (!pHead) return null;
  let list = [],
    current = pHead;
  while (current) {
    list.push(current);
    current = current.next;
  }
  if (list.length >= k) {
    return list[list.length - k];
  };
  return null;
}
module.exports = {
  FindKthToTail: FindKthToTail
};