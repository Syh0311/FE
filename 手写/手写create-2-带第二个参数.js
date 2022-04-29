function myCreate(proto, props) {
  if (typeof proto != "object" || typeof proto == null) {
    throw `${proto} must be object`;
  }

  function F() {}
  F.prototype = proto;
  const obj = new F();
  Object.defineProperties(obj, props);
  return obj;
}
//test
function Father() {}
let props = {
  property1: {
    value: "syh",
    writable: true,
  },
  property2: {
    value: "Hello",
    writable: false,
  },
};
let sonProto = myCreate(Father.prototype, props);
console.log(sonProto);
