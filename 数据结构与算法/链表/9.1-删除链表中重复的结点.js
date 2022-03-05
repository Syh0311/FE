function ListNode(x) {
  this.val = x;
  this.next = null;
}

function deleteDuplication(pHead) {
  if (!pHead)
    return null;
  let dummy = new ListNode(-1);
  let tail = dummy;
  while (pHead !== null) {
    if (pHead.next == null || pHead.val !== pHead.next.val) {
      tail.next = pHead;
      tail = pHead;
    }
    while (pHead.next != null && pHead.val == pHead.next.val) pHead = pHead.next;
    pHead = pHead.next;
  }
  tail.next = null
  return dummy.next
}
module.exports = {
  deleteDuplication: deleteDuplication
};