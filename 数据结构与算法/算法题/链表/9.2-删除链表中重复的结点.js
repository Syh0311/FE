function ListNode(x) {
  this.val = x;
  this.next = null;
}

function deleteDuplication(pHead) {
  var s = new Set();
  var cur = pHead;
  var head = new ListNode(null); //设置一个最前方的头节点【空，有时，在链表的第一个节点之前会额外增设一个节点，该节点的数据域一般不存放数据（有些情况下也可以存放链表的长度等信息），此节点被称为头节点】
  head.next = cur;
  var pre = head;
  while (pHead) {
    //只判断相邻的两个节点
    if (pHead.next && pHead.val == pHead.next.val) {
      s.add(pHead.val);
    }
    pHead = pHead.next;
  }
  while (cur) {
    if (s.has(cur.val)) {
      pre.next = cur.next;
      cur = cur.next;
    } else {
      pre = cur;
      cur = cur.next;
    }

  }
  return head.next;
}
module.exports = {
  deleteDuplication: deleteDuplication
};