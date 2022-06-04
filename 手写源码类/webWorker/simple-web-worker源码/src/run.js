import { argumentError, isValid, makeResponse } from "./utils";
import { createDisposableWorker } from "./createDisposableWorker";

// SWorker.run(func, [args]?)

/**
 * @param {function} work 要运行的函数
 * @param {array} args 函数的参数
 * @returns {promise} 返回promise以链式调用
 */
export const run = (work = null, args) => {
  const validWork = isValid(work)("function");
  const validArgs = isValid(args)(["array", "undefined"]);

  if (validWork && validArgs) {
    const worker = createDisposableWorker(makeResponse(work));
    return worker.post({ args });
  }

  if (!validWork) console.error(argumentError({ expected: "a function", received: work }));
  if (!validArgs) console.error(argumentError({ expected: "an array", received: args }));
  return null;
};
