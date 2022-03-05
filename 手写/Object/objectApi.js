const objectApi = (() => {
  //1.objectIs
  const objectIs = (x, y) => {
    if (x === y) {
      //判断x跟y是+0、-0、0三种清空
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // x!==y有可能是两者都是NaN。而NaN!==NaN  即x!==x则说明其本身为NaN
      return x !== x && y !== y; //俩都是NaN
      return isNaN(x) && isNaN(y); //使用现有API
    }
  };
  // console.log(objectIs(0, -0));
  // console.log(objectIs(0, +0));
  // console.log(objectIs(-0, -0));
  // console.log(objectIs(NaN, 0 / 0));

  //2.object类型转换原理
  const a = {
    value: 0,

    //1.最先尝试
    // [Symbol.toPrimitive]() {
    //   return 6; //7
    // },

    //2.object上没有Symbol.toPrimitive属性--【对象的Symbol.toPrimitive属性，指向一个方法】，使用valueOf()
    // valueOf() {
    //   return "5"; //'51'
    // },

    //3.对象上没有定义valueOf，尝试toString()
    toString() {
      return ++this.value;
      return (this.value += 1);
    },

    //4.上边三个全部注释掉
    //[object Object]1
  };
  // console.log(obj + 1);
  // console.log(a == 1 && a == 2); //true

  //3.手写instanceof
  const sInstanceof = (x, y) => {
    //基本数据类型直接返回false【即-不等于function且不等于object】
    if ((typeof x !== "function" && typeof x !== "object") || x === null) return false; //|| x === null是处理object情况下的特殊情况，也可以直接写|| !x

    //查找原型链
    let proto = Object.getPrototypeOf(x);
    while (proto) {
      if (proto === y.prototype) return true;
      proto = Object.getPrototypeOf(proto);
    }
    return false;
  };
  // console.log(sInstanceof("syh", String)); //false
  // console.log(sInstanceof(new String("syh"), String)); //true
  // console.log(sInstanceof(String, Function)); //true
  // console.log(sInstanceof(Object, Function)); //true
  // console.log(sInstanceof(Function, Object)); //true

  //4.instanceof判断基本数据类型
  class primitiveNumber {
    static [Symbol.hasInstance](x) {
      return typeof x === "number";
    }
  }
  // console.log(111 instanceof primitiveNumber); //true

  //5.原型链
  function Foo() {}
  const foo = new Foo();
  //5.1
  // console.log(foo.__proto__ === Foo.prototype);
  // console.log(Foo.__proto__ === Function.prototype);
  // console.log(Function.__proto__ === Function.prototype);
  // console.log(Object.__proto__ === null);
  // //5.2
  // console.log(Foo === Foo.prototype.constructor);
  // console.log();

  //6.生成器---还没全搞明白！！！
  //yield的两种作用：1.暂停生成器对象；2.作为参数
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

  const obj = {};

  //7.对象
  Object.defineProperty(obj, "m", {
    // writable: true,
    // configurable: false,
    // enumerable: true,
    value: "syh",
  });
  obj.m = "s";
  for (let i in obj) {
    console.log(obj[i]);
  }
  Object.defineProperties(obj, {
    f_: {
      // writable: true,
      // configurable: false,
      // enumerable: true,
      value: "syh",
    },
    b_: {
      value: "qq",
    },
    f: {
      get() {
        return this.f_;
      },
      set(value) {
        this.f_ = value;
        this.b_ = "sqq";
      },
    },
    b: {
      get() {
        return this.b_;
      },
    },
  });
  // obj.f;

  // function fn7(x, ...restt) {
  //   console.log(x);
  //   console.log(restt);
  // }
  // function fn7(x) {
  //   console.log(x);
  //   console.log(typeof arguments); //obj
  //   console.log(arguments);
  //   console.log(arguments[0]); //这的0是键，而不是索引
  //   //类数组转化为数组的方法
  //   var args = Array.prototype.slice.call(arguments, fn7.length);
  //   console.log(fn7.length); //形参个数
  //   console.log(Array.prototype.splice.length); //2
  //   console.log(args);
  // }
  // fn7(1, 2, 3);

  let objj = {
    name_: "syh",
    get name() {
      return this.name_;
    },
    set name(name) {
      this.name_ = name;
    },
  };
  // console.log(Object.getOwnPropertyDescriptors(objj));
  // console.log(Object.keys(objj));
  // console.log(Object.getOwnPropertyNames(objj));

  //8.类
  let Person = class PersonName {
    say() {
      console.log(Person, PersonName);
    }
  };
  let p = new Person();
  // p.say();

  function fib(n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
  }

  //fib的优化，等于是用了while，但这是用的尾调用优化的思想
  function fibYouhua(n) {
    return innerFib(0, 1, n);
  }
  function innerFib(a, b, n) {
    if (n === 0) return a;
    // let res = innerFib(b, a + b, n - 1);
    // return res;
    return innerFib(b, a + b, n - 1);
  }

  //9.手写new
  //new做了什么
  // 1. 创建新对象；
  // 2. 将对象的__proto__指向构造函数的prototype；
  // 3. 构造函数中this赋值为此对象；
  // 4. 执行构造函数；
  // 5. 如果构造函数本身就返回对象，则返回构造函数中对象，否则返回新对象。
  const myNew = (fn, ...args) => {
    //1.判断fn
    //1.1 传进来的是个函数
    if (typeof fn !== "function") {
      throw new Error(`${fn} is not a function`);
    }
    //1.2 传进来的不能是箭头函数
    if (fn.prototype == undefined) {
      throw new Error(`${fn.name} can not be a arrow function,cause arrow function has no prototype!`);
    }
    //步骤1
    let obj = {};
    //步骤2
    // obj.__proto__ = fn.prototype;
    obj = Object.create(fn.prototype); //更优雅的写法
    //步骤3、4
    const result = fn.call(obj, ...args);
    //步骤5--还要进行判断
    if (typeof result === "object" && typeof result !== null) {
      return result;
    } else {
      return obj;
    }
  };
  function testFn(name) {
    this.name = name;
  }
  const arrowFn = (name) => {
    this.name = name;
  };
  console.log(arrowFn.prototype); //undefined
  const myObj = myNew(testFn, "syh");
  console.log(myObj);
  console.log(myObj instanceof testFn); //true
  console.log(myNew(arrowFn, "sy"));
})();
