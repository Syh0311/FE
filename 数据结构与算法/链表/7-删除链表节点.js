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
 * @param head ListNode类 
 * @param val int整型 
 * @return ListNode类
 */
function deleteNode(head, val) {
  // write code here
  //1.先判断极端条件
  if (!head) return head;
  if (head.val === val) return head.next;
  //2.正常情况
  //2.1 prev和cur都【只】是指针！！【谨记！！！】
  let prev = null,
    cur = head;
  //注：此处的while直接判断 【cur.val !== val】 即可
  while (cur.val !== val) {
    prev = cur;
    cur = cur.next
  }
  //2.2 while终止时，prev指针指向的是cur指向的节点的上一个！！
  //此时让上一个节点的next等于下一个节点即可，即
  prev.next = cur.next
  return head
}
module.exports = {
  deleteNode: deleteNode
};