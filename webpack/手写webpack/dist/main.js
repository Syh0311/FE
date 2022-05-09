
      (function (depsGraph) {
        // require目的：为了加载入口文件
        function require(module) {
          // 定义模块内部的require函数
          function localRequire(relativePath) {
            // 为了找到要引入模块的绝对路径，通过require加载
            return require(depsGraph[module].deps[relativePath]);
          }
          // 定义暴露对象（将来我们模块要暴露的内容）
          var exports = {};

          (function (require, exports, code) {
            eval(code);
          })(localRequire, exports, depsGraph[module].code);
          
          // 作为require函数的返回值返回出去
          // 后面的require函数能得到暴露的内容
          return exports;
        }
        // 加载入口文件
        require('./src/index.js');

      })({"./src/index.js":{"code":"\"use strict\";\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nvar _minus = _interopRequireDefault(require(\"./minus.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log((0, _add[\"default\"])(1, 3));\nconsole.log((0, _minus[\"default\"])(1, 3));","deps":{"./add.js":"C:\\Users\\Syh\\Desktop\\新建文件夹\\手写webpack\\src\\add.js","./minus.js":"C:\\Users\\Syh\\Desktop\\新建文件夹\\手写webpack\\src\\minus.js"}},"C:\\Users\\Syh\\Desktop\\新建文件夹\\手写webpack\\src\\add.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nfunction add(a, b) {\n  return a + b;\n}\n\nvar _default = add;\nexports[\"default\"] = _default;","deps":{}},"C:\\Users\\Syh\\Desktop\\新建文件夹\\手写webpack\\src\\minus.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nfunction minus(a, b) {\n  var c = (0, _add[\"default\"])(a, b); // console.log(\"[ c ]\", c);\n\n  console.log(\"minus(a,b)返回的还是a\");\n  return c - b; // 返回的还是a\n}\n\nvar _default = minus;\nexports[\"default\"] = _default;","deps":{"./add.js":"C:\\Users\\Syh\\Desktop\\新建文件夹\\手写webpack\\src\\add.js"}}})
    