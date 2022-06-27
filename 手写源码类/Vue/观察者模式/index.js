class Subject {
  constructor(name = Date.now() + "") {
    this.name = name;
  }
  update() {
    console.log(`${this.name}更新了---`);
  }
}

class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(sub) {
    if (!(sub instanceof Subject)) {
      throw new Error("添加的不是指定subject");
    }
    this.subs.push(sub);
  }
  removeSub(sub) {
    const index = this.subs.indexOf(sub);
    if (index === -1) {
      throw new Error("收集器内没有此sub");
    }
    this.subs.splice(index, 1);
  }
  notify() {
    for (let sub of this.subs) {
      sub.update();
    }
  }
}

const sub1 = new Subject(1);
const sub2 = new Subject(2);

const dep = new Dep();

dep.addSub(sub1);
dep.addSub(sub2);
dep.notify();
// dep.addSub({});
