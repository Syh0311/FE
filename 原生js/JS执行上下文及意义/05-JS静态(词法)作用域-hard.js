/**
函数体存在堆内存中，执行上下文的词法环境也存在堆内存中
syaSthOut被调用后，生成词法环境中的saySth存在
一、预解析过程【parse】
  1. 从上往下依次解析；
  2. 遇到saySth，将其【函数体、父级作用域】保存到堆内存中；
  3. 遇到syaSthOut，同理，将其【函数体、父级作用域】保存到堆内存中；
  4. 结束预解析，将所有代码块添加到【调用栈】中。

二、代码执行
  1. 调用栈中的【全局执行上下文】从上往下依次执行，到了syaSthOut()，调用之；
  2. 调用syaSthOut()，根据保存在堆内存中的【函数体、父级作用域】生成【函数执行上下文 -- 父级作用域作为词法环境内的outer】，生成 函数执行上下文内部的 词法环境内、词法环境、变量环境；
  3. 将syaSthOut的函数执行上下文添加到调用栈，从上往下依次执行syaSthOut函数；
  4. 遇到saySth，调用之，与调用syaSthOut一样，根据其保存在堆内存中的【函数体、父级作用域】生成【函数执行上下文 -- 父级作用域作为词法环境内的outer】。所以，此时saySth【函数执行上下文中词法环境内outer】是【window，而不是syaSthOut】
  5. 将saySth的函数执行上下文添加到调用栈，从上往下依次执行saySth函数；
  6. 遇到了msg变量，去自身【词法环境与变量环境查找，发现都没有】，沿着作用域链往上找，找到外界的msg【SYH IS HANDSOME】，将其打印。如果没找到，node下报错，chrome下打印空值

*/

// let msg = "SYH IS HANDSOME";
function saySth() {
  console.log(msg);
}

function syaSthOut() {
  let msg = "YOU ARE TOTALLY RIGHT";
  saySth();
}
syaSthOut();
