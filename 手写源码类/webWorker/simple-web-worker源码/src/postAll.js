// import { invalidObjectsArray, isArrayOf, notArray, returnNull, wrongLength, wrongObjects } from './utils'
import { isValid, argumentError } from "./utils";

const makeOptionsFor = (arr) => {
  return {
    expected: "an array of arrays, an array of objects, or an array of strings",
    received: arr,
    extraInfo: "If an array of arrays, " + "it must have the same length as the actions registered for this worker.\n" + "If an array of objects, every object must containing two fields:\n* message\n* args",
  };
};

/**
 * @param {array} arr 可以再另外输入actions
 * @returns {promise} 执行后的postMessage【promise】
 */
export function postAll(arr = []) {
  if (isValid(arr)(["arraysArray", "postParamsArray", "stringsArray"])) {
    // 1. arr = []
    if (arr.length === 0) return Promise.all(this.actions.map(({ message }) => this.postMessage(message)));

    // 2. 传入的是string 返回Promise.all 少了判断条件
    if (arr.every((item) => typeof item === "string")) {
      return Promise.all(arr.map((msg) => this.postMessage(msg)));
    }

    // 3. 传入的message，少了判断条件
    if (arr.every((item) => typeof item === "object" && !Array.isArray(item))) {
      return Promise.all(arr.map(({ message, args }) => this.postMessage(message, args)));
    }

    if (arr.every((item) => Array.isArray(item)) && arr.length === this.actions.length) {
      return Promise.all(arr.map((args, index) => this.postMessage(this.actions[index].message, args)));
    }
  }

  console.error(argumentError(makeOptionsFor(arr)));
  return null;
}
