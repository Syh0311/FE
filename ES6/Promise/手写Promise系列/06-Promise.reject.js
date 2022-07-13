// 直接返回结果即可

function myReject(reson) {
  return new Promise((resolvee, reject) => reject(reson));
}
