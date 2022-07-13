import { ajax1, ajax2, ajax3, ajax4 } from "./00-baseData.mjs";

function myAllSettled(promises) {
  const data = [];
  return new Promise(async (resolve, reject) => {
    //async  加到箭头函数上
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];
      try {
        const res = await promise;
        data.push({ status: "fullfilled", value: res });
      } catch (err) {
        data.push({ status: "rejected", reason: err });
      }
    }
    resolve(data);
  });
}

myAllSettled([ajax1(), ajax2(), ajax3(), ajax4()])
  // myAllSettled([ajax1, ajax2, ajax3, ajax4])
  .then((data) => {
    console.log("[ data ]", data);
  });
