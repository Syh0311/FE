## px

px 是绝对大小 这个绝对是在 css 内的绝对
对于设备来说

若设备像素比(devicePixelRatio)为 2 的，则一个 px 等于两个像素

## 设备像素比（DPR）

设备像素比表示 1 个 CSS 像素等于几个物理像素。
计算公式：DPR = 物理像素数 / 逻辑像素数；

## em

em 是相对大小：

1. font-size 的 em 是相对于父元素的 font-size；
2. 其他属性的 em 则是相对于当前元素的 font-size 的大小；
3. em 是相对于父元素的 div { font-size: 2em; }
   p { font-size: 2em; } 此时 p 的大小为 64px

## rem

rem 是相对于根元素的大小

## vw/vh

vw 和 vh 分别是相对于屏幕视口宽度和高度而言的长度单位：

1vw = 视口宽度均分成 100 份中 1 份的长度；
1vh = 视口高度均分成 100 份中 1 份的长度；
