export default class Dialog extends EventTarget {
  constructor(options) {
    super();
    // console.log(options);

    // 默认配置
    let defalultOptions = {
      width: "30%",
      height: "250px",
      title: "测试标题",
      content: "测试内容",
      dragable: true, //是否可拖拽
      maskable: true, //是否有遮罩
      isCancel: false, //是否有取消
      success() {},
      cancel() {},
    };
    // 合并配置；
    //方法一：
    // this.opts = Object.assign(defalultOptions,options);
    //方法二:
    this.opts = { ...defalultOptions, ...options };
    //方法三：
    // this.opts = {
    //     width,
    //     height,
    //     title,
    //     content,
    //     dragable,
    //     maskable,
    //     isCancel,
    //     success,
    //     cancel
    // }
    // console.log(this.opts);
    this.init();
  }
  // 初始化组件方法
  init() {
    this.createElement();
    // this.addEvent("success",this.opts.success);
    this.addEventListener("success", this.opts.success);
    this.addEleEvent();
    if (!this.opts.maskable) {
      this.divEles.querySelector(".k-wrapper").style.display = "none";
    }
    if (this.opts.dragable) {
      this.drag();
    }
  }
  // 创建节点
  createElement() {
    // console.log(this.opts.width)
    let divEles = document.createElement("div");
    divEles.innerHTML = `<div class="k-wrapper"></div>
      <div class="k-dialog" style="width:${this.opts.width};height:${this.opts.height}">
          <div class="k-header">
              <span class="k-title">${this.opts.title}</span><span class="k-close">X</span>
          </div>
          <div class="k-body">
              <span>${this.opts.content}</span>
          </div>
          <div class="k-footer">
              ${this.opts.isCancel ? '<span class="k-default">取消</span>' : ""}
              <span class="k-primary">确定</span>
          </div>
      </div>`;
    divEles.style.display = "none"; //先设置为none
    document.body.appendChild(divEles);
    this.divEles = divEles;
  }
  // 添加事件
  addEleEvent() {
    // let closeEle = this.divEles.querySelector(".k-close");
    // closeEle.addEventListener("click",()=>{
    //     this.close();
    // })
    // let cancelEle = this.divEles.querySelector(".k-default") ;
    // console.log(cancelEle)
    // cancelEle &&  cancelEle.addEventListener("click",()=>{
    //     console.log("close")
    // })
    // 事件委托
    let kDialog = this.divEles.querySelector(".k-dialog");
    kDialog.addEventListener("click", (e) => {
      //    console.log(e.target);
      let className = e.target.className;
      //  console.log(className);
      switch (className) {
        case "k-close":
          this.close();
          break;
        case "k-default":
          this.opts.cancel();
          this.close();
          break;
        case "k-primary":
          // this.opts.success();
          // this.trigger("success");
          this.sure();
          this.close();
          break;
        default:
          console.log("未点中");
          break;
      }
    });
  }
  sure(value) {
    let success = new CustomEvent("success", {
      detail: value, //事件初始化时传入的参数
    });
    this.dispatchEvent(success);
  }
  // 关闭组件
  close() {
    this.divEles.style.display = "none";
  }
  // 打开组件
  open() {
    // console.log("open");
    this.divEles.style.display = "block";
  }
  drag() {
    let kDialog = this.divEles.querySelector(".k-dialog");
    kDialog.onmousedown = function (e) {
      let x = e.clientX - this.offsetLeft,
        y = e.clientY - this.offsetTop;
      this.onmousemove = function (e) {
        let xx = e.clientX,
          yy = e.clientY;
        this.style.left = xx - x + "px";
        this.style.top = yy - y + "px";
      };
    };
    kDialog.onmouseup = function () {
      this.onmousemove = "";
    };
    // kDialog.onmouseup = () => {
    //   this.onmousemove = ""; //箭头函数的this指向定义这个箭头函数的作用域外部的this--此处是构造函数的实例
    // };
  }
}
// 通过继承扩展功能；
export class InputDialog extends Dialog {
  constructor(options) {
    super(options);
    this.createInput();
  }
  createInput() {
    let myInput = document.createElement("input");
    myInput.classList.add("input-inner");
    this.divEles.querySelector(".k-body").appendChild(myInput);
    this.myInput = myInput; //挂载到this上
  }
  sure() {
    let value = this.myInput.value;
    super.sure(value);
  }
}
class ShowDialog extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<button>按钮</button>`;
    let dialog = new Dialog({
      title: this.title,
      success: (e) => {
        // console.log("点击了确定")
        this.dispatchEvent(new CustomEvent("success"));
      },
    });
    // this.title = this.getAttribute("title")
    this.onclick = function () {
      dialog.open();
    };
  }
  get title() {
    return this.getAttribute("title") ?? "默认标题";
  }
}
customElements.define("show-dialog", ShowDialog);
