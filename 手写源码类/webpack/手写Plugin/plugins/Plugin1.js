class Plugin1 {
  // new插件的时候会调用apply方法  传入compiler
  apply(compiler) {
    // 同步代码 回调的参数为 compilation
    compiler.hooks.emit.tap("Plugin1", (compilation) => {
      console.log("emit.tap ---");
    });

    // tapAsync异步钩子 多一个参数 【异步串行】
    // compiler.hooks.emit.tapAsync("Plugin1", (compilation) => {
    //   setTimeout(() => {
    //     console.log("emit.tapAsync ---");
    //   }, 1000);
    // });

    // tapPromise异步钩子  返回promise
    // compiler.hooks.emit.tapPromise("Plugin1", (compilation) => {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       console.log("emit.tapPromise ---");
    //       resolve();
    //     }, 1000);
    //   });
    // });

    compiler.hooks.afterEmit.tap("Plugin1", (compilation) => {
      console.log("afterEmit.tap ---");
    });

    compiler.hooks.done.tap("Plugin1", (compilation) => {
      console.log("done.tap ---");
    });
  }
}

module.exports = Plugin1;
