import { argumentError, isValid } from "./utils";
import { post } from "./post";
import { postAll } from "./postAll";
import { register } from "./register";
import { unregister } from "./unregister";

// 可能的错误信息
const options = (actions) => {
  return {
    expected: "an array of objects",
    received: actions,
    extraInfo: "Every action should be an object containing two fields:\n* message\n* func",
  };
};

/**
 * @param {array} actions 通过actions初始化对象
 * @returns {object} 返回对象
 */
export const create = (actions = []) => {
  // 如果通过校验 返回对象
  if (isValid(actions)("actionsArray")) {
    return {
      actions: actions, //加到$worker上，让postAll方便获取
      postMessage: post(actions), // 接受arr，返回function
      postAll: postAll, // 执行postMessage
      register: register(actions), // 新增函数到actions
      unregister: unregister(actions), // 取消函数
    };
  }
  console.error(argumentError(options(actions)));
  return null;
};
