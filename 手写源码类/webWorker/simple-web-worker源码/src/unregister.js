import { argumentError, isValid } from "./utils";

const removeFrom = (actions) => (msg) => {
  const index = actions.findIndex(({ message }) => message === msg); // 直接结构出message

  index === -1 ? console.warn(`WARN! Impossible to unregister action with message "${msg}".\nIt is not a registered action for this worker.`) : actions.splice(index, 1);
  return actions;
};

const makeOptions = (msg) => {
  return {
    expected: "an array of strings or a string",
    received: msg,
  };
};

/**
 * @param {Array} actions 【Array||Object】
 * @returns {number} 删除后 actions的长度
 */
export const unregister =
  (actions) =>
  (msg = null) => {
    if (isValid(msg)(["string", "stringsArray"])) {
      if (Array.isArray(msg)) {
        return msg.reduce((actions, message) => {
          removeFrom(actions)(message); // 复用
          return actions;
        }, actions).length;
      }
      return removeFrom(actions)(msg).length;
    }

    console.error(argumentError(makeOptions(msg)));
    return null;
  };
