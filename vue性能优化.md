## 暂存

1. [前端常见问题和技术解决方案](https://juejin.cn/post/7088144745788080142)

   

## 项目优化



## [性能优化](https://juejin.cn/post/6979172700254109709) - 首屏优化

性能优化和首屏优化可以一块说 也可以分开说，

但性能优化更偏向于Vue全家桶具体的性能问题和webpack的便是时长【上线前】，

首屏优化更偏向于webpack结合http



### 三、框架的选择

- SSR 服务器端渲染
  - Nuxt.js
  - Next.js
- SPA 单页面应用
- SSG 静态站点生成方案



## 总结 -- 优化

### 一、框架方面 - Vue全家桶

SSR 服务器端渲染

- Nuxt.js
- Next.js

[揭秘 Vue.js 九个性能优化技巧](https://juejin.cn/post/6922641008106668045)

### 二、webpack方面

**`摘自【webpack相关.md -> webpack干的事】`**

#### 一、优化编译时长

#### 二、减小包体积；

#### 三、分包

### 三、网络方面

**`摘自【计网 xxx.md】`**

网络方面主要就是**两方面**

- 一、请求的`文件数量`与`单个文件大小`
- 二、请求`提前或延缓`



#### 一、文件数量与大小

**1.1 文件数量**

1. 精灵图
2. 合理的splitChunk
3. 不过现在可以用HTTP2多路复用加载多个小文件

**1.2 单个文件大小**

1. splitChunk适当分包
   - minSize，maxSize，cacheGroups【分组条件】
2. vue路由懒加载，分包

#### 二、请求提前或延缓

1. 提前
   - preFetch？？？
   - 强/协商缓存【关联缓存策略，cache-control】
   - iframe放到promise.then里 【vue-friendly-iframe】
   - HTTP2主动推送
2. 延缓
   - 路由懒加载
   - async/defer

## 参考

1. [前端性能优化小结](https://juejin.cn/post/6979172700254109709)
2. [Vue2知识点总结：结合面试题](https://juejin.cn/post/7088305435370848263)
3. [揭秘 Vue.js 九个性能优化技巧](https://juejin.cn/post/6922641008106668045)

## 体验层面来看

**[前端优化做两件事](https://juejin.cn/post/6844904183917871117#heading-4)**

- 优化用户体验
  - 减少首屏加载时间
  - 提升各项交互的流畅度，如表单验证和页面切换
- 优化开发体验
  - 减少构建耗时
  - 自动化完成一些重复工作，解放生产力，脚手架是代表性产物
