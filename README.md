# 基于协同过滤的组队社区移动端

课外开放性实验项目的移动端部分

# 技术栈
- Vue3
- TypeScript
- UnoCSS
- Axios
- Vite

# 组件库
- Vant4

# 图标集
- iconify/tabler

# 工程化工具
- Eslint
- Prettier
- husky
- commitlint

# 开发注意
## 1、字体
已经配置好了全局统一的中英文字体，建议不要再手动给某些地方设置`font-family`，除非确有必要

## 2、Vue API和组件引入
已经使用了`unplugin-auto-import`和`unplugin-vue-components`插件，来自动引入API和组件，所以`vue`的绝大多数API都可以直接使用，而不需要再手动按需`import`。同样的，`vant`组件库的**非函数组件**也是可以直接使用，不需要手动引入；函数组件的样式已经全局引入，不需要再手动引入，使用函数组件时只用按需引入函数即可。

> 但是`自定义的vue组件、路由组件`仍然应该使用`懒加载`的方式引入！
> `vue-router`、`pinia`相关的api改手动引入还是要手动引入

## 3、请求 API
先在`api/types/xxx.ts`中定义好其请求参数和响应参数类型，再去`api/requestAPI/xxx.ts`下封装对应场景的请求方法

## 4、hooks 和 utils
二者都是工具类方法，但utils不会触及响应性，只是一些场景的通用处理方法。而hooks一定是会操作响应式状态的，它会导致响应式更新，所以封装时候需要区分开。

## 5、axios功能拓展
目前封装的axios足够本项目基础需求，后期若有需要拓展axios功能, 请先二次封装相关类型, 并在对应的位置完成拓展功能需求的开发。

## 6、eslint和prettier
如果没生效，注意是否和自己IDE装的相关插件冲突了