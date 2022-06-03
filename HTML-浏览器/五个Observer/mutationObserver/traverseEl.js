/**
 * 深度遍历 DOM 树
 * 算法分析
 * 首次调用为 traverseEl(body, 1, false);
 * @param element 节点
 * @param layer 层节点编号，从上往下，依次表示层数
 * @param identify 表示每个层次得分是否为 0
 * @returns {number} 当前DOM变化得分
 */
function traverseEl(element, layer, identify) {
  // 窗口可视高度
  const height = win.innerHeight || 0;
  let score = 0;
  const tagName = element.tagName;

  if (tagName !== "SCRIPT" && tagName !== "STYLE" && tagName !== "META" && tagName !== "HEAD") {
    const len = element.children ? element.children.length : 0;

    if (len > 0) {
      for (let children = element.children, i = len - 1; i >= 0; i--) {
        score += traverseEl(children[i], layer + 1, score > 0);
      }
    }

    // 如果元素高度超出屏幕可视高度直接返回 0 分
    if (score <= 0 && !identify) {
      if (element.getBoundingClientRect && element.getBoundingClientRect().top >= height) {
        return 0;
      }
    }
    score += 1 + 0.5 * layer;
  }
  return score;
}

export default traverseEl;
