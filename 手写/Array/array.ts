// export default SArray;

class SArray extends Array {
  //static 静态方法。不能在类的实例上调用静态方法，只能通过类本身调用
  // static syhForEach()

  //1.first
  first() {
    return this[0];
  }
  //2.last
  last() {
    return this.at(-1); //es6新增语法,at是个函数
  }
  //3.forEach
  // SyhForEach(callback: (value: unknown, index: number, array: readonly unknown[]) => void, thisArg?: any) {
  syhForEach(callback, thisArg?: any) {
    thisArg = thisArg || this;
    if (callback instanceof Function) {
      for (let i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
        // callback.apply(thisArg, [this[i], i, this]);
      }
    } else {
      throw new Error(`"${callback}"不是回调函数！！`);
    }
  }

  //4.map
  syhMap(callback, thisArg) {
    if (callback instanceof Function) {
      thisArg = thisArg || this;

      const newArr = new SArray(thisArg.length);
      // console.log(newArr);

      for (let i = 0; i < thisArg.length; i++) {
        newArr[i] = callback(thisArg[i], i, thisArg);
      }
      return newArr;
    } else {
      throw new Error(`"${callback}"不是回调函数！！`);
    }
  }

  //5.find
  syhFind(callback, thisArg) {
    if (callback instanceof Function) {
      thisArg = thisArg || this;
      for (let i = 0; i < thisArg.length; i++) {
        const flag = callback(thisArg[i], i, thisArg);
        if (flag) return thisArg[i];
      }
      return undefined;
    } else {
      throw new Error(`"${callback}"不是回调函数！！`);
    }
  }
  //6.reduce
  syhReduce(callback, initial) {
    if (callback instanceof Function) {
      if (initial) {
        let result = initial;
        for (let i = 0; i < this.length; i++) {
          result = callback(result, this[i], i, this);
        }
        return result;
      } else {
        let result = this[0];
        for (let i = 1; i < this.length; i++) {
          result = callback(result, this[i], i, this);
        }
        return result;
      }
    } else {
      throw new Error(`"${callback}"不是回调函数！！`);
    }
  }

  syhFlat(recursiveTime: number) {
    recursiveTime = recursiveTime || 1;

    let res = SArray.from(this); //深拷贝
    //法一
    // while (recursiveTime > 0) {
    //   for (let i = 0; i < res.length; i++) {
    //     if (res[i] instanceof Array) {
    //       //先加再删，注意加的位置【i+1】
    //       res.splice(i + 1, 0, ...res[i]);
    //       res.splice(i, 1);
    //     }
    //   }
    //   recursiveTime--;
    // }
    // return res;

    //法二--更好点-因为当输入无限大时，不要while那么多次，使用arr中嵌套次数作为while条件，保证了while都是必要的！！
    let i = 1;
    while (res.some((item) => Array.isArray(item))) {
      // res = [].push(...res);//push返回的是添加的数组数列---所以报错
      res = [].concat(...res);
      i++;
      if (i > recursiveTime) break;
    }
    return res;
  }

  //splice
  syhSplice() {}
}
