//法一：过于高级的方法！！！【找最小公倍数？？？】

/*function ListNode(x){
    this.val = x;
    this.next = null;
}*/
function FindFirstCommonNode(pHead1, pHead2) {
  // write code here
  let p1 = pHead1,
    p2 = pHead2;
  while (p1 !== p2) {
    //看哪个先到头，到头了的话就让其等于另一个链表，
    //从头再来，此方法可能复杂度更大点
    p1 = p1 ? p1.next : pHead2;
    p2 = p2 ? p2.next : pHead1;
  }
  return p1
}
module.exports = {
  FindFirstCommonNode: FindFirstCommonNode
};