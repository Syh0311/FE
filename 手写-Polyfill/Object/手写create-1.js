function myCreate(proto) {
  if (typeof proto != "object" || typeof proto == null) {
    throw `${proto} must be object`;
  }

  function F() {}
  F.prototype = proto;
  const obj = new F(); //obj.__proto__ = F.prototype = proto
  return obj;
}

function Father() {}
let sonProto = myCreate(Father.prototype);
console.log(sonProto);
