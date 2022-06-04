function RandomListNode(x) {
  this.label = x;
  this.next = null;
  this.random = null;
}

function Clone(pHead) {
  // 都是啥！！！？？
  if (!pHead) {
    return null;
  }
  var head = new RandomListNode(pHead.label);
  head.random = pHead.random;
  head.next = Clone(pHead.next);
  return head;
}
module.exports = {
  Clone: Clone,
};
