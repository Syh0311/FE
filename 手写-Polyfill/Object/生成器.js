// 生成器---还没全搞明白！！！
// yield的两种作用：1.暂停生成器对象；2.作为参数
const temFn = (a) => {
  console.log("temFn中---" + a);
};
function* generator() {
  console.log("生成--生成器对象时不调用，第一次next才调用----");

  yield 1;

  temFn(yield); //不报错，因为yield此时作为参数传入temFn函数,直接在生成器函数中yield
  (() => {
    // yield; //报错,yield先在箭头函数中查找,箭头函数中没定义这个,不往上查找--高程p195，yield只能在生成器函数中使用
    console.log("下一个yield之前的都执行，即下次next()");
  })();

  console.log(yield);

  yield* [4, 5, 6];
}
// const generatorFn = generator();
// generatorFn.next(111); //第一次传参无用
// generatorFn.next(222); //第二次被temFn接收

// //6.1
// generatorFn.next(333);
// generatorFn.next();
// generatorFn.next();

// //6.2
// // const aa = generatorFn.next(333);
// // const bb = generatorFn.next();
// // const cc = generatorFn.next();
// // const dd = generatorFn.next();
// // console.log(aa, bb, cc, dd);

// //6.3
// // yield* [4, 5, 6];的
// // for (const iterator of generatorFn) {
// //   console.log(iterator);
// // }
