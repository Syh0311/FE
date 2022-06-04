import { argumentError, isValid } from "./utils";

const isActionOf = (actions) => (newAction) => actions.some((action) => action.message === newAction.message);

const warnMsg = (action) => `WARN! An action with message "${action.message}" is already registered for this worker`;

const pushInto = (actions) => (action) => {
  if (isActionOf(actions)(action)) {
    console.warn(warnMsg(action));
    return actions.length;
  }
  return actions.push(action);
};

const makeOptionsFor = (action) => {
  return {
    expected: "an array of actions or an action",
    received: action,
    extraInfo: "Every action should be an object containing two fields:\n* message\n* func",
  };
};

/**
 * @param {Array} actions 【Array||Object】
 * @returns {number} 新actions的长度
 */
export const register =
  (actions) =>
  (action = null) => {
    if (isValid(action)(["action", "actionsArray"])) {
      // 1.
      if (Array.isArray(action)) {
        return action.reduce((actions, action) => {
          pushInto(actions)(action); // 复用函数
          return actions;
        }, actions).length;
      }

      return pushInto(actions)(action);
    }
    console.error(argumentError(makeOptionsFor(action)));
    return null;
  };
