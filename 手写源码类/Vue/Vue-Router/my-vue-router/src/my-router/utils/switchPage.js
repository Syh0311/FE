function switchPage(router, to) {
  if (router.history.current == to) {
    console.warn("跳转页面与当前页面相同");
  } else {
    router.history.current = to;
  }
}

export default switchPage;
