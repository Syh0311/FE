// 直接返回结果即可

function myReject(reason) {
  return new Promise((resolvee, reject) => reject(reason));
}
