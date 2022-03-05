//抽象思维，把链表抽象成线！！！


/*function ListNode(x){
    this.val = x;
    this.next = null;
}*/
function EntryNodeOfLoop(pHead) {
  // write code here
  //1.如果为空或只有一个元素【同时也是让下边fast能走两步！！】，返回null
  if (!pHead || !pHead.next) return null;

  //2.利用不同前进速度--找到相遇节点
  let fast = pHead,
    slow = pHead;
  while (fast) {
    fast = fast.next.next; //fast速度为2【最开始的判断确保了fast能走两步】
    slow = slow.next;
    //2.1找到相遇点之后【fast（slow）处】
    if (fast == slow) {
      let start = pHead,
        encounterPoint = fast;
      //encounterPoint不设置也行，因为fast就是相遇点
      while (start !== encounterPoint) {
        start = start.next;
        encounterPoint = encounterPoint.next;
      }
      return start
    }
  }
  //不存在环，即while(fast)能从while自身条件打破，而不是内部return打破
  //此时返回null
  return null
}
module.exports = {
  EntryNodeOfLoop: EntryNodeOfLoop
};