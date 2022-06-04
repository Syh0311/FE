function RandomListNode(x) {
  this.label = x;
  this.next = null;
  this.random = null;
}

function Clone(pHead) {
  //啥情况，感觉莫名其妙的就复制了！！！？？

  // write code here
  //1.极端情况
  if (!pHead || !pHead.next) return pHead;
  //2.新建链表
  let newLinkedList = new RandomListNode();
  let h = newLinkedList;
  while (pHead) {
    h.label = pHead.label;
    h.next = pHead.next;
    h.random = pHead.random;
    h = h.next;
    pHead = pHead.next;
  }
  return newLinkedList;
}
module.exports = {
  Clone: Clone,
};
