/*function ListNode(x){
    this.val = x;
    this.next = null;
}*/
function FindFirstCommonNode(pHead1, pHead2) {
  // write code here
  //0. 如果本身就相等，直接返回
  if (pHead1 === pHead2) return pHead1;

  //不相等--再做之后操作
  //1.获得链表长度的函数
  function getLinkedListLength(LinkedList) {
    let i = 0;
    while (LinkedList) {
      LinkedList = LinkedList.next;
      i++;
    }
    return i;
  }

  //2.链表往前走n步
  function moveForward(LinkedList, n) {
    let j = 0;
    while (j++ < n) {
      LinkedList = LinkedList.next;
    }
    return LinkedList
  }

  //3.分别获得pHead1和pHead2的长度，比较长度，让较长的先走【差值】步
  let l1 = getLinkedListLength(pHead1),
    l2 = getLinkedListLength(pHead2);
  let difference = l1 - l2;
  //3.2 注意pHead1或者pHead2的【重新赋值】！！！
  if (difference > 0) pHead1 = moveForward(pHead1, difference);
  else pHead2 = moveForward(pHead2, -difference);
  //4.走完差值步数后，两个链表剩余长度相同，此时进行比较
  while (pHead1 !== pHead2) {
    pHead1 = pHead1.next;
    pHead2 = pHead2.next;
  }
  return pHead1
}
module.exports = {
  FindFirstCommonNode: FindFirstCommonNode
};