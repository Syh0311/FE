## ES6新加

### let、const

### function新写法

```js
// example1
printNamw(firstName='S',lastName='yh'){
	console.log(`${firstName}${lastName}`)
}，
// example2
scrollTo(x,y,time=300){
   console.log(x,y,time)
}
//调用函数时可以不加time！！！
scrollTo(1,5) //1,5,300
```



### Promise

#### 为什么要有Promise【好处？？？】

promise把请求过程和请求结果的处理过程进行了分割

#### Promise 新建后`立即执行`

```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```



函上面代码中，Promise 新建后立即执行，所以首先输出的是`Promise`。然后，`then`方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以`resolved`最后输出。数

#### async await



#### 题

##### 1.五分钟说结果-微信群题

```js
console.log(1);

setTimeout(() =>{
    console.log(2);
    setTimeout(() =>{
        console.log(14);
        new Promise((resolve, reject) =>{
            console.log(15);
            resolve()
        }).then(res =>{
            console.log(16);
        })
    }) 
    new Promise((resolve, reject) =>{
        console.log(3);
        resolve()
    }).then(res =>{
        console.log(4);
    })
})

new Promise((resolve, reject) =>{
    resolve()
}).then(res =>{
    console.log(5);
}).then(res =>{
    console.log(6);

})

new Promise((resolve, reject) =>{
    console.log(7);
    resolve()
}).then(res =>{
    console.log(8);
}).then(res =>{
    console.log(9);

})

setTimeout(() =>{
    console.log(10);
    new Promise((resolve, reject) =>{
        console.log(11);
        resolve()
    }).then(res =>{
        console.log(12);
    })
})

console.log(13);
```



##### 2.不同之处

```js
new Promise(function(resolve){
    resolve();
    console.log(1)
}).then(console.log(2))
console.log(3)
```

```js
new Promise(function(resolve){
    resolve();
    console.log(1)
}).then(()=>console.log(2))
console.log(3)
```

.then里只有是函数的时候，才是微任务，要不还是同步代码！！【应该是个大坑！！】

##### 3.事件循环顺序-区别

```js
console.log(1);

async function async1() {
  await async2();
  console.log(2);
}
async function async2() {
  console.log(3);
}
async1();

setTimeout(function () {
  console.log(4);
}, 0);

new Promise((resolve) => {
  console.log(5);
  resolve();
})
  .then(function () {
    console.log(6);
  })
  .then(function () {
    console.log(7);
  });

console.log(8);
```



```js
console.log(1);

async function async1() {
  await async2();
  console.log(2);
}
async function async2() {
  console.log(3);
}
await async1();  //加了await

setTimeout(function () {
  console.log(4);
}, 0);

new Promise((resolve) => {
  console.log(5);
  resolve();
})
  .then(function () {
    console.log(6);
  })
  .then(function () {
    console.log(7);
  });

console.log(8);
```

```js
//结果
//1,3,5,8,2,6,7,4
//1,3,2,5,8,6,7,4
// async函数在await之前的代码都是同步执行的，可以理解为await之前的代码属于new Promise时传入的代码，await之后的所有代码都是在Promise.then中的回调
```

##### 4.[嵌套Promise](https://stackoverflow.com/questions/58270410/how-to-understand-this-promise-execution-order)【没懂！！！？？？】

```js
new Promise(resolve => {
  resolve()
})
.then(() => {
  new Promise(resolve => {
      resolve()
    })
    .then(() => {
      console.log(1)
    })
    .then(() => {
      console.log(2)
    })
    .then(() => {
      console.log(3.1)
    })
})
.then(() => {
  console.log(1.1)
  new Promise((resolve => {
      resolve()
    }))
    .then(() => {
      new Promise(resolve => {
          resolve()
        })
        .then(() => {
          console.log(4)
        })
        .then(() => {
          console.log(6)
        })
    }).then(() => {
      console.log(5)
    })
}).then(() => {
  console.log(3)
})
console.log(0)
```

任务队列`FIFO`

```js
main [4] logs: 0 // main code executed, one executor added to FIFO (4)
4 [8,18] // executor at line 4 runs, two executors added to FIFO (8, 18)
8 [18,11] logs: 1 // etc etc
18 [11,23,36] logs: 1.1
11 [23,36,14] logs: 2
23 [36,14,27,33] 
36 [14,27,33] logs: 3
14 [27,33] logs: 3.1
27 [33,30] logs: 4
33 [30] logs: 5
30 logs: 6
```

as you can see its first in first out order: `[4,8,18,11,23,36,14,27,33,30]` but it stores executors (callbacks for promises that were fulfilled or rejected), not promises. In other words: the time when promise is fulfilled or rejected decides when its added to FIFO not the time the promise is created.

##### 5.嵌套Promise

```js
new Promise((resolve) => {
  resolve();
})
  .then(() => {
    new Promise((resolve) => {
      resolve();
    })
      .then(() => {
        console.log(111);
      })
      .then(() => {
        console.log(222);
      });
  })
  .then(() => {
    new Promise((resolve) => {
      resolve();
    })
      .then(() => {
        new Promise((resolve) => {
          resolve();
        })
          .then(() => {
            console.log(333);
          })
          .then(() => {
            console.log(444);
          });
      })
      .then(() => {
        console.log(555);
      });
  })
  .then(() => {
    console.log(666);
  });


//1,2,6,3,5,4

```

##### 6.嵌套Promise

在执行栈中，从上往下执行，遇到promise就推进微任务队列，链式调用的`then回调执行完毕`后，会将`该条链的下一个then`推入队列中，这个过程搞懂了以后是很清晰的，多少层都不用怕。 // 代码有点长，我又加了一层

```js
new Promise((resolve) => {
  resolve();
})
  .then(() => {
    console.log("then1");
    console.log("推1-1入队");
    new Promise((resolve) => {
      resolve();
    })
      .then(() => {
        console.log("then1-1");
        console.log("推1-2入队");
      })
      .then(() => {
        console.log("then1-2");
      });
    console.log("推2入队");
  })
  .then(() => {
    console.log("then2");
    console.log("推2-1入队");
    new Promise((resolve) => {
      resolve();
    })
      .then(() => {
        console.log("then2-1");
        console.log("推2-1-1入队");
        new Promise((resolve) => {
          resolve();
        })
          .then(() => {
            console.log("then2-1-1");
            console.log("推2-1-2入队");
          })
          .then(() => {
            console.log("then2-1-2");
          });
        console.log("推2-2入队");
      })
      .then(() => {
        console.log("then2-2");
        console.log("推2-3入队");
      })
      .then(() => {
        console.log("then2-3");
      });
    console.log("推3入队");
  })
  .then(() => {
    console.log("then3");
    console.log("推3-1入队");
    new Promise((res) => {
      res();
    })
      .then(() => {
        console.log("then3-1");
        console.log("推3-2入队");
      })
      .then(() => {
        console.log("then3-2");
      });
  });
```

##### 7.[要就来45道Promise面试题一次爽到底](https://juejin.cn/post/6844904077537574919)

### 构造函数-new

用new 进行函数的`构造调用`时，js做了些什么【暂存于此！！！】

那么用new的时候 做到函数的`构造调用`后，js帮我们做了什么工作呢:

1. 创建一个新对象。

2. 把这个新对象的`__proto__`属性指向 原函数的`prototype`属性。(即继承原函数的原型)【foo.\__proto__ == Foo.prototype  //true】

3. **将这个新对象绑定到 此函数的this上** 。

4. 如果这个函数没有返回其他**对象**，`返回这个新对象`。

   ```js
   function Syh() {
       this.name = function () { console.log('syh') };
       return this;
   }
   Foo()  //window
   new Foo()  //Foo的实例化对象
   //1.构造函数中无返回值时返回实例化对象；
   //2.有返回值时：
   //2.1 若返回值为基本类型（string,number,boolean,null,undefined）则与无返回值相同，实际返回其实例化对象。
   //2.2返回值为引用类型，则返回这个引用类型；
   
   本例子中返回this，`【在构造函数中，this指向实例化对象】`，即还是返回实例化对象！
   
   ```

   

### 函数的两种创建方式

#### 函数声明-结合变量提升

```js
f('superman');
function f(name){
    console.log(name);
}
```

运行上面的程序，控制台能打印出`supemran`。 

#### 函数表达式

```js
f('superman');   //f is not a function
var f= function(name){
    console.log(name);
}
```

#### 为什么需要名字？

函数的名字可以被用于从函数的内部调用自身。这在递归函数中很有用。

```js
var thingsToDoToday = function flyToTheMoon() {
    if(!onTheMoon)
       flyToTheMoon();
     else
alert("One small step for a man..");
}
thingsToDoToday();
```

### 函数提升

1. 函数声明

   ```js
   function foo() {
       console.log('foo1');
   }
   
   foo();  // ？？
   
   function foo() {
       console.log('foo2');
   }
   foo(); // ？？
   ```

   实际上：

   ```js
   function foo() {
       console.log('foo1');
   }
   function foo() {
       console.log('foo2');
   }
   foo();  // foo2
   foo();  // foo2
   ```

2. 函数表达式

   ```js
   f('superman');   //f is not a function
   var f= function(name){
       console.log(name);
   }
   ```

3. 结合`函数声明`与`函数表达式`

   ```js
   var getName = function(){
       console.log(2);
   }
   function getName (){
       console.log(1);
   }
   getName();   //??
   ```

   实际运行代码：

   ```js
   var getName;    //变量声明提升
   function getName(){    //函数声明提升到顶部
       console.log(1);
   }
   getName = function(){    //变量赋值依然保留在原来的位置
       console.log(2);
   }
   getName();    // 最终输出：2
   ```

### 箭头函数



## class

```js
Object.__proto__ === Function.prototype === Function.__proto__
//随便两个都是true
```

JavaScript的对象模型是基于原型实现的，特点是简单，缺点是理解起来比传统的类－实例模型要困难，最大的缺点是继承的实现需要编写大量代码，并且需要正确实现原型链。

因此新的关键字**`class`从ES6开始正式被引入到JavaScript中**。`class`的目的就是让定义类更简单。

构造函数的`prototype`属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的`prototype`属性上面。

### 类的实例--函数

```javascript
class Point {
  constructor() {
    // ...
  }
  toString() {
    // ...
  }
  toValue() {
    // ...
  }
}
// 等同于
Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```

上面代码中，`constructor()`、`toString()`、`toValue()`这三个方法，其实都是定义在`Point.prototype`上面。

### class继承-extends、super

```js
class PrimaryStudent extends Student {
    constructor(name, grade) {
        super(name); // 记得用super调用父类的构造方法!
        this.grade = grade;
    }
    myGrade() {
        alert('I am at grade ' + this.grade);
    }
}
```

### `class`的作用及好处

就是让JavaScript引擎去**实现原来需要我们自己编写的原型链代码**。

`class`的好处就是极大地**简化了原型链代码**。

### class与ES5中Function区别

1. class中定义的函数不可以枚举

   ```js
   class Point {
     constructor(x, y) {}
     toString() {}
   }
   Object.keys(Point.prototype)  
   // []
   Object.getOwnPropertyNames(Point.prototype)
   // ["constructor","toString"]
   
   //ES5中Function可以
   var Point = function (x, y) {};
   Point.prototype.toString = function () {};
   
   Object.keys(Point.prototype)
   // ["toString"]
   Object.getOwnPropertyNames(Point.prototype)
   // ["constructor","toString"]
   ```

2. class必须加new，不加报错，ES5中可以当作正常函数执行

3. class不存在变量提升

   ```js
   new Foo(); // ReferenceError
   class Foo {}
   ```

4. 与 ES5 一样，实例的属性除非显式定义在其本身（即定义在`this`对象上），否则都是定义在原型上（即定义在`class`上，class就算是原型了，因为`Point === Point.prototype.constructor`）。

### \__proto__ 

**已废弃:** 该特性已经从 Web 标准中删除，虽然一些浏览器目前仍然支持它，但也许会在未来的某个时间停止支持，请尽量不要使用该特性。为了更好的支持，建议只使用 [`Object.getPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf)。



`__proto__能够获取实例对象的原型` ，但并不是语言本身的特性，这是各大厂商具体实现时添加的`私有属性`，虽然目前很多现代浏览器的 JS 引擎中都提供了这个私有属性，但依旧不建议在生产中使用该属性，避免对环境产生依赖。生产环境中，我们可以使用 `Object.getPrototypeOf` 方法来获取实例对象的原型，然后再来为原型添加方法/属性。

```js
//使用getPrototypeOf获取当前实例的原型--同手写instanceof
const proto = Object.getPrototypeOf(foo)
//通过Object.assign添加方法
Object.assign(proto,{
	toString()
	,syh()
})
```

### 类中this指向

类的方法内部如果含有`this`，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。

```javascript
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

上面代码中，`printName`方法中的`this`，默认指向`Logger`类的实例。但是，如果将这个方法提取出来单独使用，`this`会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是`undefined`），从而导致找不到`print`方法而报错。

#### 构造方法中绑定`this`

一个比较简单的解决方法是，在构造方法中绑定`this`，这样就不会找不到`print`方法了。

```javascript
class Logger {
  constructor() {
    this.printName = this.printName.bind(this);
  }

  // ...
}
```

### 静态方法

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上`static`关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

`静态方法中的this指向类本身而不是实例对象`

#### 箭头函数

另一种解决方法是使用箭头函数。

```javascript
class Obj {
  constructor() {
    this.getThis = () => this;
  }
}

const myObj = new Obj();
myObj.getThis() === myObj // true
```

箭头函数内部的`this`总是指向定义时所在的对象。上面代码中，箭头函数位于构造函数内部，它的定义生效的时候，是在构造函数执行的时候。这时，箭头函数所在的运行环境，肯定是实例对象，所以`this`会总是指向实例对象。

#### 使用`Proxy`

还有一种解决方法是使用`Proxy`，获取方法的时候，自动绑定`this`。

```javascript
function selfish (target) {
  const cache = new WeakMap();
  const handler = {
    get (target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== 'function') {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    }
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}

const logger = selfish(new Logger());
```

### 兼容性

不是所有的主流浏览器都支持ES6的class。如果一定要现在就用上，就需要一个工具把`class`代码转换为传统的`prototype`代码，可以试试[Babel](https://babeljs.io/)这个工具。

##  this指向

### 1. 分类【总结】

`【没全明白！！！？？？】`

总的来说分为四类（3、4待看？？？）：

1. 函数的this指向；
2. 箭头函数的this指向；
3. 使用new构造调用时的this指向；
4. 原型链【prototype】中的this指向。

#### 1.1. 普通函数

1. 谁调用函数，函数的this就是谁，
2. 没有调用的，非严格模式下是window，严格模式下是undefined

#### 1.2. 箭头函数

【箭头函数没有this，它的this`继承自`  定义这个箭头函数的作用域，（也就是说箭头函数中的this是定义这个箭头函数的作用域外部的this）】

`举个栗子`

```js
//1.
let obj = {
	a:()=>{
		console.log(this)
	}
}
obj.a()  //window  因为`对象没有作用域`，到了外部script的this，是window

//2.
function fn2(){
    return c = ()=>console.log(this)
}
fn2()()  //window,  fn2n的this，即window, 函数有作用域

//3.
let obj2 = {
	fn3:function (){
    	return c = ()=>console.log(this)
	}
}
obj2.fn3()()  //obj2
let temp = obj2.fn3()
temp()		  //还是obj2，   不受影响！！
```

##### 复杂的说法

对于箭头函数，this 关键字始终**表示定义箭头函数的对象**

箭头函数完全修复了`this`的指向，`this`总是指向**词法作用域**【由上下文确定】

**箭头函数中的this和函数的this有本质区别**，箭头函数中的this**是函数外最近的那个this**【`可以是窗口、文档、按钮或其他任何东西`】，因此，`apply`、`call`方法其实并不会起作用。

#### 1.3. new 



### 讲解

[面试官问：JS的this指向](https://juejin.cn/post/6844903746984476686)

[深入理解 js this 绑定](https://segmentfault.com/a/1190000011194676)

[从这两套题，重新认识JS的this、作用域、闭包、对象](https://segmentfault.com/a/1190000010981003)

### 考题

#### 1、 [小小沧海：一道常被人轻视的前端JS面试题](https://link.juejin.cn/?target=https%3A%2F%2Fwww.cnblogs.com%2Fxxcanghai%2Fp%2F5189353.html)

`涉及到的知识点：`

1. 函数（此时还只是函数）的静态属性：Foo.getName = function () { alert (2);};【getName存储在Foo的prototype的constructor里】；

2. 函数的原型对象创建函数：【getName存储在Foo的prototype里】【关联：原型链，还没看？？？】

   ```js
   Foo.prototype.getName = function () { alert (3);};
   ```

3. var的变量提升；

   ```js
   console.log(a)
   var a = 10;
   console.log(a)
   //相当于
   var a
   console.log(a)
   a = 10
   console.log(a)
   ```

4. 函数的两种`创建`方式：
   1、函数声明：function name(){}
   2、函数表达式：var name =  function (){}

5. `函数声明`的提升【与var的提升类似，区别：函数声明提升整个函数，使用var函数表达式创建的函数只提升var变量，之后再赋值！！！，见（函数声明的提升.html）】

6. `new`构造函数与普通函数的`return`问题【关联-用new 进行函数的`构造调用`时，js做了些什么】

   ```js
   function Syh() {
       this.name = function () { console.log('syh') };
       return this;
   }
   Foo()  //window
   new Foo()  //Foo的实例化对象
   //1.构造函数中无返回值时返回实例化对象；
   //2.有返回值时：
   //2.1 若返回值为基本类型（string,number,boolean,null,undefined）则与无返回值相同，实际返回其实例化对象。
   //2.2返回值为引用类型，则返回这个引用类型；
   
   本例子中返回this，`【在构造函数中，this指向实例化对象】`，即还是返回实例化对象！
   
   ```

   

7. 运算符优先级【暂存？？？】

后三个先跳过！！【涉及到（运算符优先级）】

![image-20211213202323425](image-20211213202323425.png)

#### 2、[从这两套题，重新认识JS的this、作用域、闭包、对象](https://link.juejin.cn/?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000010981003)



#### 3、[深入理解 js this 绑定](https://segmentfault.com/a/1190000011194676)

对比不同！

3.1 var a = foo(1); 【关联-全局污染】

```js
function foo(arg){
    this.a = arg;
    return this
};

var a = foo(1);

console.log(a)       // ?
console.log(a.a);    // ?
```

3.2 let a = foo(1)   【关联-let和const声明的变量到底去哪里了？】let、const、class命令(`三个命令均为ES6新增！！！`)声明的全局变量，不属于顶层对象的属性。

```js
function foo(arg){
    this.a = arg;
    return this
};

var a = foo(1);

console.log(a)       // ?
console.log(a.a);    // ?
```

3.3 var b = foo(10);

```js
function foo(arg){
    this.a = arg;
    return this
};

var b = foo(100);

console.log(b)       // ?
console.log(b.a);    // ?
```

3.4 let b = foo(10);

```js
function foo(arg){
    this.a = arg;
    return this
};

var b = foo(100);

console.log(b)       // ?
console.log(b.a);    // ?
```



#### 4、口述结果

##### 4.1

```js
var name = '外部name'
var AAAA = {
    name: 'A',
    sayHello: function() {
        let name = 'inner'
        console.log(this);      //??
        let m = function() {
            console.log(this);  //??
        }
        m()
        //let s = function() {
        //   console.log(this);  //??
        //   }
        let s = () => console.log(this.name); 	
        return s;
    }
};
//AAAA是对象，sayHello()称为对象的方法
let sayHello = AAAA.sayHello(); //?? 赋值了就会打印
sayHello();						//??
var B = {
    name: 'B'
};
sayHello.call(B, 'SYH');        //??
```

**`解析`**

```js
var name = '外部name'
var AAAA = {
    name: 'A',
    sayHello: function() {
        console.log(this); //不call是AAAA，call还是AAAA	
        // name = this.name   //此时window.name == 'A'
        let m = function() {
            console.log(this); //window【为啥是window？？【严格模式下为undefined】】
        }
        m()
        let s = function() {
            console.log(this); //不call是window，call是B 【为啥是window？？【严格模式下为undefined】】
            }
            // let s = () => console.log(this); //不call是AAAA，call还是AAAA 【箭头函数完全修复了this的指向，this总是指向词法作用域】
        return s; //return的是s，也就是说实际上call的时候是s.call(B),所以sayHello里第一行打印的this不管是否call(B)都是指向AAAA
    }
};
//AAAA是对象，sayHello()称为对象的方法
let sayHello = AAAA.sayHello();
sayHello(); //AAAA中总共有三个打印，此函数全部打印
var B = {
    name: 'B'
};
sayHello.call(B, 'SYH'); //call是用sayHello的返回值【即s】去call，所以只打印最后一个【s中的打印结果】
```

##### 4.2

```js
var person = {
    name: '张三',
    say1() {
        console.log(`我是法外狂徒${this.name}`);
    },
    say2() {
        setTimeout(function() {
            console.log(`我是法外狂徒${this.name}`);  //this指向
        }, 1000);
    },
    say3() {
        setTimeout(() => {
            console.log(`我是法外狂徒${this.name}`);
        }, 1000);
    }
}

person.say1() // ??
person.say2() // ??
person.say3() // ??
```

解析

```js
person.say1() //我是法外狂徒张三
person.say2() //我是法外狂徒undefined
person.say3() //我是法外狂徒张三，箭头函数
```

##### 4.3

```js
var name = 'name';
var A = {
    name: 'A',
    sayHello: function() {
        //1.
        console.log(this.name);
        //2.
        let arrow = ()=>console.log(this.name);
        arrow()
        //3.
        let s = () => console.log(this.name);
        return s;
    },
    sayHello2:()=>console.log(this.name),   //name
    sayHello3:function(){
        let s = function(){
            console.log(this.name)
        }
        return s
    },
    sayHello4:function(){
        console.log(this.name)
    }
};

A.sayHello(); //  A,A
A.sayHello()(); //  A,A,A
A.sayHello2(); //name
A.sayHello3()(); //  A,A,A
A.sayHello4(); //A

let func = A.sayHello()

var B = {
name: 'B'
};
sayHello.call(B);   //A,因为call对箭头函数不起作用【箭头函数完全修复了this的指向，this总是指向词法作用域】
```

## 作用域链

### 关联

1. js预编译
2. 静态作用域 【词法作用域】
3. 执行上下文 - 执行栈
4. js的执行过程
5. 闭包
6. 作用域链

### 作用域

作用域是指程序源代码中定义变量的区域。

作用域规定了`如何查找变量`，也就是确定当前执行代码对变量的访问权限。

JavaScript 采用`词法作用域(lexical scoping)`，也就是`静态作用域`。

### 静态作用域与动态作用域

JavaScript 采用的是`词法作用域`【静态的】，函数的作用域在`函数定义`的时候就决定了【就像是`箭头函数`中的this】

```js
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();

// 结果是 ???
```

bash就是动态作用域，上述函数如果在bash中运行，则打印2【了解即可】

### 词法作用域

## 原型链

### 关联

1. Object.create()
2. Object,getPrototypeOf(obj)
3. for...in
4. 继承  
5. class 的extend 干了啥
6. 手写instanceof
7. 私有属性
8. new的时候，js干了啥，四步

### 总结

```js
Foo.prototype.constructor === Foo //true
foo.__proto__ === Foo.prototype   //true 【关联-new的时候，js干了啥，四步】
foo.__proto__.constructor ===Foo  //true

？？？Object.__proto__ === Function.prototype === Function.__proto__  //随便两个都是true
Function.prototype === Object.__proto__
Function.prototype === Array.__proto__
Function.prototype === Function.__proto__
//Function是所有函数的构造函数
```



### 易错题

```js
var A = function() {};
A.prototype.n = 1;
var b = new A();
A.prototype = { n: 2, m: 3 };
var c = new A();
console.log(b.n);    // ??
console.log(b.m);    // ??
console.log(c.n);    // ??
console.log(c.m);    // ??

console.log(b==c);    // false
```

`解析：`

```js
var A = function() {};
A.prototype.n = 1;
var b = new A(); 
//b是A的实例化对象，直接指向A的原型对象【关联-new的时候】b.__proto__ ==A.prototype

A.prototype = { n: 2, m: 3 };  //重写了A.prototype，即A.prototype的指向变了
var c = new A();

console.log(b.n);    // 1
console.log(b.m);    // undifined

console.log(c.n);    // 2
console.log(c.m);    // 3

console.log(b==c);    // false
```

！！！！`理解指针`！！！:

1. b.\_\_proto\_\_       c.\_\_proto\_\_           A.prototype这三个都只是指针，指向了`堆内存`中的对象，

2. b是A的实例化对象，则 【 b.\__proto__  == A.prototype  】 ，即b的`隐式原型`【b.\_\_proto__】指针指向了堆内存中的某个对象，

3. A.prototype = { n: 2, m: 3 }后将【A.prototype】这个指针指向了新的对象，但是【b.\_\_proto__】还是指向了原来的，所以b中没有m属性

4. 举个栗子：

   ```js
   let a = [1,2,3];
   let b = a;  //[1,2,3]
   
   let a = [3,2,1]
   
   console.log(b); //[1,2,3]  ,因为b还是指向堆内存中那个对象  【关联-js垃圾回收，如果[1,2,3]这个对象没有指针指向了，就会被回收掉】
   ```

5. 所以说A.prototype = { n: 2, m: 3 }这个方法不能跟一个一个来混用！！【关联-JavaScript设计模式前几页】

### 1.原型

#### 1.1. 为什么要设计原型对象？

**【为了解决`工程模式`下不能`共享公共属性`的问题】**

```js
function Foo(){}; // 工厂模式
f1 = new Foo();
f2 = new Foo()
```

上述这样的原型设计有一个致命的缺点就是无法共享公共属性。

因为我们知道，每 `new` 一个对象，生成的`实例`是两个不同的对象。所以共有的属性也不是共享的，如果我们改动一个对象的 type 属性，但是另一个不会改变，因为这个属性没有共享。

要想让构造函数生成的所有实例对象都能够共享属性，那么我们就给构造函数加一个属性叫做`prototype`，用来`指向原型对象`，

1. 我们把所有实例对象`共享`的属性和方法都放在这个构造函数的`prototype`属性指向的原型对象中，
2. `不需要共享的属性和方法放在构造函数中`。

#### 1.2. 获取原型的方法

1. `Object.getPrototypeOf(obj)`

   ```js
   const proto = Object.getPrototypeOf(obj) //手写instanceof
   ```

2. 通过`构造函数的prototype属性`拿到原型；
   prototype属性是[只有函数才特有的属性](https://segmentfault.com/a/1190000016364830)，当你创建一个函数时，js会自动为这个函数加上prototype属性，值是一个空对象】

   ```js
   function Foo(){};
   console.log(Foo.prototype.constructor === Foo);//true,
   ```

3. `Object.prototype.__proto __ `不推荐  [原因](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)：

   - **已废弃**
     该特性已经从` Web 标准中删除`，虽然一些浏览器目前仍然支持它，但也许会在未来的某个时间停止支持，请尽量不要使用该特性。
   - **影响性能:** 
     1. 修改对象的[[Prototype]]非常慢且影响性能，因为性能消耗的时间不是简单的花费在 `obj.__proto__ = ...` 语句上, 它还会**影响到所有继承来自该 `[[Prototype]]` 的对象**，
     2. 若要修改,可创建一个新的且可以继承 `[[Prototype]]` 的对象，推荐使用 [`Object.create()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)。
        - Object.create()  返回新对象，使用【`传入参数`】作为新对象的`__proto__`
   - **使用Object.getPrototypeOf()代替:** 
     当`Object.prototype.__proto__` 已被大多数浏览器厂商所支持的今天，其存在和确切行为仅在ECMAScript 2015规范中被`标准化为传统功能`，以确保Web浏览器的兼容性。为了更好的支持，建议只使用 [`Object.getPrototypeOf()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)。

### 2.原型继承

#### 2.1. ES5原型继承

见   原型继承.md

#### 2.2. ES6 class原型继承

可转换为babel 具体见 原型继承.md

```js
class PrimaryStudent extends Student {
    constructor(name, grade) {
        super(name); // 记得用super调用父类的构造方法!
        this.grade = grade;
    }
    myGrade() {
        alert('I am at grade ' + this.grade);
    }
}
```

### 原型链

![jsobj_full](D:\Sync\typora图片\jsobj_full.jpg)

### [深入理解javascript原型和闭包](https://www.cnblogs.com/wangfupeng1988/p/3977924.html)

[深入理解javascript原型和闭包（1）——一切都是对象](http://www.cnblogs.com/wangfupeng1988/p/3977987.html)

[深入理解javascript原型和闭包（2）——函数和对象的关系](http://www.cnblogs.com/wangfupeng1988/p/3978035.html)

[深入理解javascript原型和闭包（3）——prototype原型](http://www.cnblogs.com/wangfupeng1988/p/3978131.html)

[深入理解javascript原型和闭包（4）——隐式原型](http://www.cnblogs.com/wangfupeng1988/p/3979290.html)

[深入理解javascript原型和闭包（5）——instanceof](http://www.cnblogs.com/wangfupeng1988/p/3979533.html)

[深入理解javascript原型和闭包（6）——继承](http://www.cnblogs.com/wangfupeng1988/p/3979985.html)

[深入理解javascript原型和闭包（7）——原型的灵活性](http://www.cnblogs.com/wangfupeng1988/p/3980065.html)

[深入理解javascript原型和闭包（8）——简述【执行上下文】](http://www.cnblogs.com/wangfupeng1988/p/3986420.html)上

[深入理解javascript原型和闭包（9）——简述【执行上下文】下](http://www.cnblogs.com/wangfupeng1988/p/3987563.html)

[深入理解javascript原型和闭包（10）——this](http://www.cnblogs.com/wangfupeng1988/p/3988422.html)

[深入理解javascript原型和闭包（11）——执行上下文栈](http://www.cnblogs.com/wangfupeng1988/p/3989357.html)

[深入理解javascript原型和闭包（12）——简介【作用域】](http://www.cnblogs.com/wangfupeng1988/p/3991151.html)

[深入理解javascript原型和闭包（13）-【作用域】和【上下文环境】](http://www.cnblogs.com/wangfupeng1988/p/3991995.html)

[深入理解javascript原型和闭包（14）——从【自由变量】到【作用域链】](http://www.cnblogs.com/wangfupeng1988/p/3992795.html)

[深入理解javascript原型和闭包（15）——闭包](http://www.cnblogs.com/wangfupeng1988/p/3994065.html)

[深入理解javascript原型和闭包（16）——完结](http://www.cnblogs.com/wangfupeng1988/p/3994950.html)



## 事件循环-Event Loop

讲的不错的

[你真的理解$nextTick吗](https://juejin.cn/post/6844903843197616136)

在`JavaScript`中，任务被分为两种，一种宏任务（`MacroTask`）也叫`Task`，一种叫微任务（`MicroTask`）。

### 栈-队列-自己的解读

#### 栈-一个字

先进后出，后进先出，因为栈只能在一端进行操作，所以肯定是先进的后出---【一端操作，栈刚好是一个字！！】

LIFO (Later-In,First-Out)

#### 队列-两个字

先进先出，插入操作在队列的一端进行，删除操作在另一端进行，所以肯定是先进先出--【两个字可以记忆成两端操作！！】

FIFO（First-In，First-Out）

### 渲染机制【存疑】

宏任务A->渲染>宏任务A的微任务>渲染>宏任务B->渲染>宏任务B的微任务>...

### MacroTask（宏任务）

- `script`全部代码、`setTimeout`、`setInterval`、`setImmediate`（浏览器暂时不支持，只有IE10支持，具体可见[`MDN`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWindow%2FsetImmediate)）、`I/O`、`UI Rendering`。

### MicroTask（微任务）

- `Process.nextTick（Node独有）`、`Promise`、`Object.observe(废弃)`、`MutationObserver`（具体使用方式查看[这里](https://link.juejin.cn/?target=http%3A%2F%2Fjavascript.ruanyifeng.com%2Fdom%2Fmutationobserver.html)）

### 执行顺序

执行栈在执行完**同步任务**后，查看**执行栈**是否为空，如果执行栈为空，就会去检查**微任务队列**(`microTask`)是否为空，如果为空的话，就执行`Task`（宏任务），否则就一次性执行完所有微任务。
 每次单个**宏任务**执行完毕后，检查**微任务**(`microTask`)队列是否为空，如果不为空的话，会按照**先入先出**的规则全部执行完**微任务**(`microTask`)后，设置**微任务**(`microTask`)队列为`null`，然后再执行**宏任务**，如此循环。

另一个说法--微任务是JS级别的，宏任务是宿主级别的，是包含关系，不是先后关系【】



![image-20211217152301581](../typora%E5%9B%BE%E7%89%87/image-20211217152301581.png)

### 题--Promise里

## 深拷贝

### [「JavaScript」带你彻底搞清楚深拷贝、浅拷贝和循环引用](https://segmentfault.com/a/1190000015042902)【带图！！】

栈内存、堆内存

```js
  object的属性名【键】有两种类型：
    一. 字符串类型
    二. Symbol类型  【独一无二】  Symbol(obj)调用obj.toString()

  object【属性名-键】对应的值【或者说obj本身，因为要递归】情况分为
    1. 基本数据类型
      - null undefined number bignit string symbol boolean
    2. 基本数据类型的包装类型与【Error RegExp Date】 
      - 共六种 -- return new obj.constructor(obj);
      - Number String Boolean
      - new Number(1)      Object(1);
      - new String('syh')  Object('syh')
      - new Boolean(true)  Object(true)
    3. WeakMap WeakSet 
      - 无法遍历 无法复制 直接返回
    4. Map Set
      - 作为object 需要对其进行【循环引用检查】
      - cloneObj = new Set()/Map(); 后马上加到【checkMap内】
      - forEach时将其【value,?key】赋值给 cloneObj
    5. 普通的 Array Object
      - 1. 以Symbol()作为键的情况 【Reflex.ownKeys】
      - 2. 循环引用检查
    6. 函数类型
      - new Function(`return ${obj.toString()}`)();
      - eval(`(${fn.toString()})`); //需要加括号
      - 涉及到curry化，this，闭包等问题，无法克隆相等价值的函数
    7. 奇特的Object(Symbol('syh')) 平时应该用不到
      - Object(Symbol('syh')).constructor===Symbol
      - return Object(Symbol(obj.description))
```



## [函数式编程](https://juejin.cn/post/6844903936378273799)【不懂？？？】

### 纯函数

概念

- **不依赖外部状态（无状态）：** 函数的的运行结果不依赖全局变量，this 指针，IO 操作等。
- **没有副作用（数据不变）：** 不修改全局变量，不修改入参。

意义

**便于测试和优化**：这个意义在实际项目开发中意义非常大，由于纯函数对于相同的输入永远会返回相同的结果，因此我们可以轻松断言函数的执行结果，同时也可以保证函数的优化不会影响其他代码的执行。这十分符合**测试驱动开发 TDD（Test-Driven Development )** 的思想，这样产生的代码往往健壮性更强。

**可缓存性**：因为相同的输入总是可以返回相同的输出，因此，我们可以提前缓存函数的执行结果，有很多库有所谓的 `memoize` 函数，下面以一个简化版的 `memoize` 为例，这个函数就能缓存函数的结果，对于像 `fibonacci` 这种计算，就可以起到很好的缓存效果。

**自文档化**：由于纯函数没有副作用，所以其依赖很明确，因此更易于观察和理解（配合后面介绍的 [类型签名](#hindly-milner 类型签名）更佳)。

**更少的 Bug**：使用纯函数意味着你的函数中**不存在指向不明的 this，不存在对全局变量的引用，不存在对参数的修改**，这些共享状态往往是绝大多数 bug 的源头。




似乎是fibonacci的题解！！！？？？【没懂！！！】

```js
function memoize(fn) {
  const cache = {};
  return function () {
    console.log(arguments);
    const key = JSON.stringify(arguments);
    console.log(key);
    var value = cache[key];
    if (!value) {
      value = [fn.apply(null, arguments)];  // 放在一个数组中，方便应对 undefined，null 等异常情况
      cache[key] = value;
    }
    return value[0];
  }
}

const fibonacci = memoize(n => n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2));
console.log(fibonacci(4))  // 执行后缓存了 fibonacci(2), fibonacci(3),  fibonacci(4)
// console.log(fibonacci(10)) // fibonacci(2), fibonacci(3),  fibonacci(4) 的结果直接从缓存中取出，同时缓存其他的
```



### 函数柯里化

在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

举个例子：

```js
function add(a, b) {
    return a + b;
}

// 执行 add 函数，一次传入两个参数即可
add(1, 2) // 3

// 假设有一个 curry 函数可以做到柯里化
var addCurry = curry(add);
addCurry(1)(2) // 3
```

curry 的这种用途可以理解为：参数复用。本质上是降低通用性，提高适用性。

缺点

参数过多时，返回多个函数，同时闭包太多！！

### 部分函数应用 vs 柯里化

经常有人搞不清柯里化和**部分函数应用** ( Partial Function Application )，经常把他们混为一谈，其实这是不对的，在维基百科里有明确的定义，部分函数应用强调的是固定一定的参数，返回一个**更小元的函数**。通过以下表达式展示出来就明显了：

```
// 柯里化
f(a,b,c) → f(a)(b)(c)
// 部分函数调用
f(a,b,c) → f(a)(b,c) / f(a,b)(c)
复制代码
```

**柯里化**强调的是**生成单元函数**，**部分函数应用**的强调的**固定任意元参数**，而我们平时生活中常用的其实是**部分函数应用**，这样的好处是可以固定参数，降低函数通用性，提高函数的适合用性。





**可以用高级柯里化去实现部分函数应用，但是柯里化不等于部分函数应用**

### 函数组合

## 其他

### for  ... of 与for ... in

总结：用`for ... of`，更好方法是用`forEach`



你可能会有疑问，`for ... of`循环和`for ... in`循环有何区别？

`for ... in`循环由于`历史遗留问题`，它遍历的**实际上是对象的属性名称**。一个`Array`数组实际上**也是一个对象**，它的每个元素的索引被视为一个属性。

当我们手动给`Array`对象添加了额外的属性后，`for ... in`循环将带来意想不到的意外效果：

```js
var a = ['A', 'B', 'C'];
a.name = 'Hello';
for (var x in a) {
    console.log(x); // '0', '1', '2', 'name'  当成对象来遍历了
}
```

`for ... in`循环将把`name`包括在内，但`Array`的`length`属性却不包括在内。

`for ... of`循环则完全修复了这些问题，它**只循环集合本身的元素**：【下例子不遍历name】

```js
var a = ['A', 'B', 'C'];
a.name = 'Hello';
for (var x of a) {
    console.log(x); // 'A', 'B', 'C'
}
```

这就是为什么要引入新的`for ... of`循环。

然而，更好的方式是**直接使用iterable内置的【forEach】方法**，它接收一个函数，每次迭代就自动回调该函数。

## Promise -- async/await

### Promise

1. promise本身的执行器代码是同步的；

2. promise通过then链式调用，通过catch处理错误【`错误穿透`，catch只放最后一个就行】；

3. promise的then接收两个参数【onResolve，onReject】，不过一般只用第一个，因为onReject可用catch穿透接收处理；

4. catch是Promise.prototype.then(null,onReject)的语法糖；

5. finally不接收来自resolve或者reject的参数，因为finally`压根就不知道`到底是resolve还是reject了【不知道promise的最终状态】；

6. `终止链式调用`的方法：
    promise.then(() => new Promise(()=>{}))，
    `返回【pending】状态的promise继续终止链式调用；
    
7. Promise.all 与Promise.allSellted;

    ```js
    //all要全resolve才行，一个reject就catch；
    Promise.all([p1,p2,p3]).then(values=>{
        //三个的结果
    }).catch(err=>{
        //出错的那一个
    });
    
    //allSellted不管对错，返回带有promise状态的arr对象
    Promise.all([p1,p2,p3]).then(values=>{
        console.log(values)
    })
    //outcome
    [
      {status: "fulfilled", value: 1},
      {status: "fulfilled", value: 2},
      {status: "rejected", value: 3},
    ]
    ```

    

8. Promise.any  只要有一个成功，就返回那个已经成功的promise；

9. Promise.race 返回第一个有结果的【无论对错-resolve，reject】；

10. then函数中的`参数期待的是函数`,如果不是函数的话会发生`透传`

### async/await

1. async / await是promise的语法糖，所以async函数`也返回Promise`；
2. async内部第一个await【`await后表达式是Promise才行，若后是同步代码，则依然同步执行`】之前的代码都是同步的【跟class很像-constructor和原型上方法都写在class里】；
2. await的`promise状态没有变化`，还是【pending】，则`不再执行await之后代码 `-- promise中第六条；
3. await得到的是promise成功【resolve】的结果；
4. await`没法得到【reject】结果`，await会把异常抛出，此时需要在await外 `套try/catch`，通过catch捕获异常【reject的reson】；
5. 若await后表达式的值不是Promise，则`返回该值本身`，且`该行代码是同步运行的`；

## 高程-第八章

对象、类与面向对象编程

### 一、对象

1. 四个集合【Object,Array,Set,Map---Object无序】；
2. 对象属性的类型：1.数据属性，2.访问器属性【getter,setter】;
3. 数据属性的四个内部特性【Configurable、Enumerable、Writable、value】，默认为true；
4. Object.defineProperty(obj,property)【内部特性默认false】；
5. Object.defineProperties(obj,{{},{},{}})【第二个参数还是对象】；
6. Object.getOwnPropertyDescriptor(obj,property)【对应  4】；
7. Object.getOwnPropertyDescriptors(obj)【对应-- 5】；
8. Object.assign(obj,obj2)【对象的混入(mixin)无法回滚】；
9. Object.is() 与 === 【NaN，+0 -0】；
10. 剩余操作符 【P213,P295】;
11. 可计算属性作为属性名；

### 二、创建对象

1. 工厂模式【对象标识问题】；
2. 构造函数模式【不能共用方法】；
3. new做了什么？
4. 原型模式【共享所有属性】；
5. Object.create()；
6. Object.hasOwnProperty(property)  -->Boolean;
7. in、Object.keys()、hasOwnPropertyNames、hasOwnPropertySymbols   P232；

### 三、继承

1. 原型链【拿父类实例当子类原型对象---问题：1.实例属性变味了原型属性，2.不能给父类构造函数传参】；
2. 盗用构造函数【只继承实例的属性】；
3. 组合继承【调用两次构造函数】；
4. 原型式继承，原型链进阶版【const SonProto = Object.create(Father.prototype);
console.log(SonProto.__proto__ = Father.prototype)
Son.prototype. = SonProto【可以理解为SonProto是Father的一个实例，但又不完全是】，Object.create(obj,properties),第二个参数跟defineProperties一样，可用于扩展SonProto】；
5. 寄生式继承，类似于4；
6. 寄生式组合继承【最优解】。

### 四、类

1. 类不会提升；
2. 类为块级作用域；
3. 抽象基类【new.target，如果是new的，指向构造函数自身】；
4.[Symbol.species]，extends时问题；

## 计算机基础

### 进程与线程

https://www.bilibili.com/video/BV1Wr4y1P7Yr?t=152.6

1. 硬盘中文件点击运行则该程序运行在内存中；
2. 系统为每个程序分配一块独立的内存空间，每个程序都以为自己【独占了】整个内存；
3. 程序可能有多个操作，比如在打字的时候会同时保存内容到硬盘上，此时就有两个线程，视图渲染线程和保存到硬盘线程；
4. 保存在本地操作、交互操作都是操作同一个文档【即这两个线程在同一个进程之中，所以需要更轻量级的线程】；
5. 线程是并行的最小单位【单核CPU一次只能执行一个线程，则需要对每个线程轮流执行，即`时间片轮转`】；
6. 等待被执行的线程处于【就绪】状态，cpu来执行的时候为【运行】状态；
7.假设线程向硬盘发起访问请求，此时CPU空转，线程变为【阻塞】状态，CPU【转而】执行其他线程，线程请求到数据之后，变为【就绪】状态，等来被CPU【轮流执行-时间片轮转】；
8. CPU在内核中为每个线程提供各自虚拟的CPU，所以这些线程会认为自己【独占了】CPU。

#### 区别

1. 进程`可以占用系统`，文件，内存等资源，`不同进程不共享资源`，
2. 而线程`不占用资源`，线程可以使用进程的资源，`同一进程内不同线程共享资源`。

详解：
进程是系统进行资源分配和调度的一个独立单位；
线程是CPU调度和分派的基本单位,它是比进程更小的能独立运行的基本单位；
一个进程至少由一个线程组成。
线程自己基本上不拥有系统资源,只拥有一点在运行中必不可少的资源(如程序计数器,一组寄存器和栈),但是它可与同属一个进程的其他的线程共享进程所拥有的全部资源。

#### 进程间通信

1. 管道通信
2. 消息队列通信
3. 信号量通信
4. 共享内存通信
5. 套接字通信

### 栈和堆

![image-20220224162428618](D:\Sync\typora图片\image-20220224162428618.png)

#### 区别

堆与栈实际上是操作系统对进程占用的内存空间的两种管理方式,主要有如下几种区别:

(1)管理方式不同。栈由操作系统自动分配释放,无需我们手动控制;堆的申请和释放工作由程序员控制,容易产生内存泄漏;

(2)空间大小不同。每个进程拥有的栈的大小要远远小于堆的大小。理论上,程序员可申请的堆大小为虚拟内存的大小,进程栈的大小64bits的Windows默认1MB, 64bits的Linux默认10MB;

(3)生长方向不同。堆的生长方向向上,内存地址由低到高;栈的生长方向向下,内存地址由高到低。

(4)分配方式不同。堆都是动态分配的,没有静态分配的堆。栈有2种分配方式:静态分配和动态分配。静态分配是由操作系统完成的,比如局部变量的分配。动态分配由alloca函数进行分配,但是栈的动态分配和堆是不同的,他的动态分配是由操作系统进行释放,无需我们手工实现。



#### 栈堆数据结构

##### 栈数据结构

栈是一种特殊的列表，栈内的元素只能通过列表的一端访问，这一端称为栈顶。 栈被称为是一种后入先出（LIFO，last-in-first-out）的数据结构。 由于栈具有后入先出的特点，所以任何不在栈顶的元素都无法访问。 为了得到栈底的元素，必须先拿掉上面的元素。



这种乒乓球的存放方式与栈中存取数据的方式如出一辙。 处于盒子中最顶层的乒乓球 5，它一定是最后被放进去，但可以最先被使用。 而我们想要使用底层的乒乓球 1，就必须将上面的 4 个乒乓球取出来，让乒乓球1处于盒子顶层。 这就是栈空间先进后出，后进先出的特点。

##### 堆数据结构

堆是一种经过排序的树形数据结构，每个结点都有一个值。 通常我们所说的堆的数据结构，是指二叉堆。 堆的特点是根结点的值最小（或最大），且根结点的两个子树也是一个堆。 由于堆的这个特性，常用来实现优先队列，堆的存取是随意，这就如同我们在图书馆的书架上取书， 虽然书的摆放是有顺序的，但是我们想取任意一本时不必像栈一样，先取出前面所有的书， 我们只需要关心书的名字。

#### 栈内存和堆内存的优缺点

在JS中，基本数据类型变量大小固定，并且操作简单容易，所以把它们放入栈中存储。

 引用类型变量`大小不固定`，所以把它们分配给堆中，让他们申请空间的时候`自己确定大小`，这样把它们分开存储能够使得程序运行起来占用的内存最小。

栈内存由于它的特点，所以它的系统效率较高。 堆内存需要分配空间和地址，还要把地址存到栈中，所以`效率低于栈`。

#### 栈内存和堆内存的垃圾回收

栈内存中变量一般在它的当前执行环境结束就会被销毁被垃圾回收制回收， 而堆内存中的变量则不会，因为不确定其他的地方是不是还有一些对它的引用。 堆内存中的变量只有在所有对它的引用都结束的时候才会被回收。

[关于垃圾回收详细内容参见另一篇文章(JS中的内存管理)](https://juejin.cn/post/6844903869525262349)

#### 闭包与堆内存

闭包中的变量并不保存中栈内存中，而是保存在堆内存中。 这也就解释了函数调用之后之后为什么闭包还能引用到函数内的变量。

## 内存泄漏

`不再用到的内存,没有及时释放`,就叫做内存泄漏

### 常见形式

1. 意外的全局变量；

   ```js
   function foo() {
       bar1 = 'some text'; // 没有声明变量 实际上是全局变量 => window.bar1
       this.bar2 = 'some text' // 全局变量 => window.bar2
   }
   foo();
   ```

2.  setInterval未清除

3. 闭包

4. DOM 引用

   ```js
   var elements = {
       image: document.getElementById('image')
   };
   function doStuff() {
       elements.image.src = 'http://example.com/image_name.png';
   }
   function removeImage() {
       document.body.removeChild(document.getElementById('image'));
       // 这个时候我们对于 #image 仍然有一个引用, Image 元素, 仍然无法被内存回收.
   }
   
   ```

   上述案例中，即使我们对于 image 元素进行了移除，但是仍然有对 image 元素的引用，依然无法对齐进行内存回收。

   另外需要注意的一个点是，对于一个 Dom 树的叶子节点的引用。 举个例子: 如果我们引用了一个表格中的td元素，一旦在 Dom 中删除了整个表格，我们直观的觉得内存回收应该回收除了被引用的 td 外的其他元素。 但是事实上，`这个 td 元素是整个表格的一个子元素，并保留对于其父元素的引用`。 这就会导致对于`整个表格，都无法进行内存回收`。所以我们要小心处理对于 Dom 元素的引用。

### 如何避免内存泄漏

记住一个原则：不用的东西，及时归还。

1. 减少不必要的全局变量，使用严格模式避免意外创建全局变量。
2. 在你使用完数据后，及时解除引用（闭包中的变量，dom引用，定时器清除）。
3. 组织好你的逻辑，避免死循环等造成浏览器卡顿，崩溃的问题。



## js操作动画

通过Animation API操作transition

```js
var whiteRabbit = document.getElementById("rabbit");

var rabbitDownKeyframes = new KeyframeEffect(
    whiteRabbit, 
    [
      { transform: 'translateY(0%)' }, 
      { transform: 'translateY(100%)' }
    ], 
    { duration: 1000, fill: 'forwards' }
  );

var rabbitDownAnimation = new Animation(rabbitDownKeyframes, document.timeline);

var rabbitUpKeyframes = new KeyframeEffect(
    whiteRabbit, 
    [
      { transform: 'translateY(100%)' },
      { transform: 'translateY(0%)' },
    ], 
    { duration: 1000, fill: 'forwards' }
  );

var rabbitUpAnimation = new Animation(rabbitUpKeyframes, document.timeline);

// whiteRabbit.addEventListener("mousedown", downHeGoes, false);
whiteRabbit.addEventListener("mouseenter", downHeGoes, false);
whiteRabbit.addEventListener("mouseleave", out, false);
function out(event){
  rabbitUpAnimation.play()
  console.log(event)
  // whiteRabbit.removeEventListener("mousedown", out, false);
}
// Trigger a single-fire animation
function downHeGoes(event) {

  // Remove those event listeners
  // whiteRabbit.removeEventListener("mouseenter", downHeGoes, false);

  // Play rabbit animation
  rabbitDownAnimation.play();
    
}
```

## 前端安全

### XSS类型

![image-20220225150327119](D:\Sync\typora图片\image-20220225150327119.png)

### XSS防范

1. 对输入过滤

2. 对输出过滤

3. Cookie设置为http-only【设置后JavaScript拿不到cookie】

4. 总之，后端不能相信前端的任何输入


### CSRF get 

在【黑客网站】中的img、script【等没有跨域限制】上附上要伪造的地址，诱导用户点击黑客网站，点击后触发【请求】，浏览器自动携带cookie；



### CSRF post

在【黑客网站】中内嵌【iframe】，iframe内又【post】表单，在script内获取iframe表单，执行【submit】操作。

![image-20220320213522384](D:\Sync\typora图片\image-20220320213522384.png)

## 异常捕获

https://juejin.cn/post/6844904143891464200?share_token=b0103476-9be0-4dbb-86a1-edc09ca14463

https://juejin.cn/post/6844903582672650253?share_token=b88a5ced-ac23-40fb-b4f7-d40275e19784



两个目的：
1. 对错误逻辑进行兜底处理；
2. 对原生的js错误做出场景化的描述，创建一个包含更具体信息的错误对象【对错误进行场景化的包装】，并将其抛出；

为什么promise不抛出错误？
因为promise在内部对错误进行了处理；
那为什么在内部进行处理？
因为promise早于async，promise是异步操作的，try catch只能捕获在try内部运行的代码，碰到promise就直接进微任务队列了，整个try内部是不报错的，也就捕获不到错误。
同理，对于setTimeout，加入的宏任务了，也没办法捕获。

## diff

### diff新老节点替换的规则

1. 如果新老节点不是同一个节点名称，那么就暴力删除旧的节点，创建插入新的节点
2. 只能同级比较、不能跨层比较。如果跨层那么就暴力删除旧的节点，创建插入新的节点
3. 如果是相同节点，又分为很多种情况：

- 新节点没有children

 如果新的节点没有children，那就证明新节点是文本，那直接把旧的节点替换成新的文本

- 新节点有children，旧的没有：则创建元素添加（把旧的内容删除清空掉，增加新的）
- 新的节点有children，旧的也有children（diff算法核心）下面进行细讲

### diff算法核心

```
新的节点有children，旧的节点也有children
```

> 1.旧前 和 新前
>
> 匹配的话：旧前指针++ 新前的指针++
>
> 2.旧后 和 新后
>
> 匹配的话：旧后的指针– 新后的指针–
>
> 3.旧前 和 新后
>
> 匹配的话：旧前的指针++ 新后的指针–
>
> 4.旧后 和 新前
>
> 匹配的话：旧后的指针– 新前的指针++
>
> 5.以上都不满足条件（查找）
>
> 新的指针++ 新的添加到页面上并且旧的中有，要给旧的赋值成undefined
>
> 6.创建或者删除




## placeholder

