//空间复杂度 O(n)，时间复杂度 O(n)

/*
 * function ListNode(x){
 *   this.val = x;
 *   this.next = null;
 * }
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
  // write code here
  function getLinkedLiseLength(pHead) {
    let i = 0;
    while (pHead) {
      pHead = pHead.next;
      i++;
    }
    return i
  };

  //1.空链表
  if (!pHead) {
    return null
  };
  //2.非空
  let len = getLinkedLiseLength(pHead);
  if (len < k) return null;
  else {
    let j = len - k
    while (j-- > 0) {
      pHead = pHead.next
    }
    return pHead
  };
}
module.exports = {
  FindKthToTail: FindKthToTail
};