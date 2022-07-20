const name = "外部name";
const AAAA = {
  name: "AAAA",
  sayHello: function () {
    let name = "里边name"; // 迷惑用的，就没在this上
    console.log("sayHello内---" + this.name);

    function other() {
      console.log("other内---" + this.name);
    }
    other();

    return other;
  },
};
const BBBB = { name: "BBBB" };

// // case1 ————————————————————————
// AAAA.sayHello.call(BBBB)();

// // case2 ————————————————————————
// AAAA.sayHello().call(BBBB);

// // case3 ————————————————————————
const case3 = AAAA.sayHello;
case3()();
