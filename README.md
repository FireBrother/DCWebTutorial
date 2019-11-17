# dc-web-tutorial

## 安装基本工具
### node.js与npm
`node.js`是在服务器后端运行js代码的运行环境，但我们并不打算用它来开发后端服务器，因为我们已经有一个用`python`写的服务器了。

我们只是利用它的`npm`来对前端项目进行管理和构建。
我们需要用`npm`来安装`vue`，它是`node.js`的包管理工具。

### vue.js与vue-cli
`vue.js`是一个只关注视图层的用于构建用户界面的框架。Vue 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。

在安装了`node.js`之后，可以用
```bash
npm install --global vue-cli
```
来安装vue的命令行工具。

### webpack
webpack是一个模块打包器。webpack的主要目标是将JavaScript文件打包在一起，打包后的文件用于在浏览器中使用。

我们项目的最终构建本质上是通过`webpack`进行的。但是因为`vue-cli`可以帮助我们生成默认的配置文件，并将其注册到`npm`的命令中，我们其实并不需要在这个工具上倾注过多的关注。在整个开发过程中，我只在区分开发环境与生产环境的配置，和利用cdn进行分包时对它进行了了解和修改。

它也不需要进行额外的安装，在接下来进行初始化的时候会被自动安装。

## 初始化
在安装了vue.js后，可以使用`vue-init`命令来创建项目。
```bash
vue-init webpack DCWebTutorial
```

这个命令将会自动完成项目框架的构建，构建完成后的目录树如本项目所示：
```
build/
  这个目录中是构建用的脚本。当我们执行`npm run xxxx`的时候，其实执行的就是里面的脚本，一般不再需要改动了。
config/
  这个目录中是一些配置，可以看到`dev.env.js`和`prod.env.js`两个分别用于开发和生产环境的配置。
  当需要修改监听端口，打包输出路径及命名时，可以修改这里的配置。
node_modules/
  node安装的依赖包，我们与它最常见的交互是构建出问题的时候把它删干净。。。
  当我们执行npm install xxxx的时候，就会安装在里面。

index.html
  主页面入口。这里定义了网站的主页面内容。当需要加入全局的html代码时，可以修改它，比如在<head>中添加<title>标签，或是通过<script>与<link>标签引入cdn资源等。
  这个页面一般只定义一个空的<div>节点，页面内容将会通过下面的main.js中定义的实例挂载上去。
src/  这是我们最重要的文件夹，我们的项目代码主要就在这里面，下面会介绍这个目录中的子目录和文件。
  assets/ 一些资源，比如图片等等。
  components/ 组件。其实我们写的"页面"就是一个一个的组件，所以这里包含了最多代码。
  router/ vue本身是一个单页面应用框架，当我们需要对路由进行处理的时候，就会在这里进行配置。
  App.vue 根组件，我们整个网站都是建立在这一个组件上的。
  main.js 页面配置。在这里定义的组件将会被挂载到index.html中。当我们引入其他依赖包，需要对其进行配置时，一般也在这里面进行。

package.json
  依赖包信息，`npm install --save`时才会在这里留下记录，且只记录大版本号。
package-lock.json 
  每次install都会记录并锁定小版本号。
```

具体的文件内容解释请看各文件的注释。

## .vue文件的结构
一个vue文件包含三个标签，`<template>`, `<script>`和`<style>`。

* `<template>`标签内是html代码。要注意的是，`<template>`只允许包含一个子标签。
* `<script>`标签内是js代码。
* `<style>`标签内是css代码。如果希望里面的内容只在这个组件下起作用，需要写`<style scope>`。
    * 这里的一个大坑是，不知道`element-ui`做了什么奇怪的操作，在scope内对它的组件的样式进行修改是无效的，只能写成全局样式。所以一定要注意不要污染其他组件的样式。

我们接下来几节将会介绍这三个标签和相关的语法。

## `<template>`标签
`<template>`标签中是这个组件的html代码。整体来说与普通的html文件相同，在此之上加入了一些vue的语法。我们常用的有如下几个：

### 模板语法
#### 字符串
与其他的模板引擎语法类似，通过双大括号(`{{ }}`)，我们可以在里面添加变量名甚至简单的js代码，例如

```vue
<span>Message: {{ msg }}</span>
```

当变量`msg`的值发生变化时，这里显示的内容也会相应变化。

#### 属性
而对于html标签中的属性，我们不用这种语法进行插值，而是通过`v-bind:`的语法将变量绑定在属性上，例如

```vue
<div v-bind:id="dynamicId"></div>
```

这时，这个div标签的id属性将会与dynamicId变量保持一致。

特别的，对于布尔变量，当变量值为`null`、`undefined` 或 `false`时，这个标签则不会被渲染。

这里`v-bind:`可以直接缩写成一个冒号`:`，例如，上面的例子等同于

```vue
<div :id="dynamicId"></div>
```

对于事件，用`v-on:`进行绑定，其缩写为`@`，值可以是一个函数名、函数调用或是一个语句。例如

```vue
<a v-on:click="func">...</a>

<a @click="clickHandler">...</a>
<a @click="clickHandler(1, 2)">...</a>
<a @click="someVar=10">...</a>
```

#### 表达式
只能使用单个的表达式，而不能使用更复杂的语句，比如赋值、控制流语句等等。
```vue
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

#### class与style
class与style也是可以动态绑定的，但是因为这里主要是涉及到样式的内容，我们留待以后再讨论。

### 条件渲染
`v-if`指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回真的时候被渲染。例如

```vue
<h1 v-if="awesome">Vue is awesome!</h1>
```

与其他的语言一样，现在的vue包含了`v-if`, `v-else-if`和`v-else`一套完整的分支语句。

```vue
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

除此之外，还有一个`v-show`标签。与`v-if`相比，`v-if`更像是"真正"的条件渲染：只有条件*第一次*为真时才发生内容/组件的渲染；而`v-show`则是在初始化时就完成了渲染，仅仅是通过css来控制内容的可见与否。

一般来说，`v-if`有更高的切换开销，而`v-show`有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用`v-show`较好；如果在运行时条件很少改变，则使用`v-if`较好。

### 列表渲染
#### 目标是一个数组时
vue也可以循环渲染多个标签。用`v-for`语句可以实现列表渲染。其写法是`item in items`，也可以写为`(item, index) in items`。

实际上，由于我们被要求为每一个循环产生的标签赋予一个`key`，我们几乎一直都需要用这种写法来捕获`index`。

```vue
<ul id="example">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>
```

```vue
parentMessage: 'Parent',
items: [
  { message: 'Foo' },
  { message: 'Bar' }
]
```

#### 目标是一个对象时
如果是对象的话，就涉及到对key（或者说property）的获取，你可以写成`value in object`, `(value, name) in object`或者`(value, name, index) in object`。

#### 关于`key`
vue是利用`key`的值来判断标签的身份的。如果两个组件的`key`相同，vue将会复用，而不是重新渲染这个组件。

这个特性在我们判断一个组件何时会被重新加载/渲染时非常重要。以及在编写动画效果时，当数组/对象内容发生了变化，这个元素到底是"移动"到了下一个位置，还是这个元素"离开"、一个新的元素"进入"，都是根据`key`的值判断的。

#### 关于对数组/对象内容的变更检测
这也是一个很容易坑的地方。受JavaScript引擎的限制，我们并不能监测到对数组内容的*直接*修改和对长度的*直接*修改，比如下面的例子

```vue
items: ['a', 'b', 'c']

items[1] = 'x' // 不是响应性的
items.length = 2 // 不是响应性的
```

我们可以采用下面的方法来使vue能够监测到这两种变化：

```vue
Vue.set(items, indexOfItem, newValue)

items.splice(indexOfItem, 1, newValue)
```

set也可以用于为对象添加新属性，而如果你想一次添加多个属性则更为tricky，你直接合并出一个新的对象，覆盖到原来的对象上：

```vue
userProfile: {
      name: 'Anika'
    }

userProfile = Object.assign({}, userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```

### 表单输入绑定
到目前为止，我们基本实现了在页面上展示数据的功能。接下来，要让人可以在页面上进行交互/输入。

无论是输入框、按钮、单选/复选框等等，都是表单的元素，对于这样的表单元素，可以用`v-model`来将一个变量绑定在组件上，这个组件的输入内容就会与这个变量建立起双向绑定。

如果你对传统的html/js有所了解，会知道这些标签有着各自对应的数据域，比如`value`、`checked`、`selected`，然后无论是获取还是修改，都要修改这个DOM节点的相应属性。

Vue将他们统一成了`v-model`，所以你应该声明`data`时为其赋一个初始值（`data`我们会在下一节`<script>标签`中讲到）。并且实现了双向绑定，即变量的值与显示的内容是同步修改的。

因为我们在项目中用了element-ui，表单组件几乎都用了它们进一步封装的组件。所以具体的标签和功能在之后的章节介绍它的时候再展开讲，这里只要有基本的html知识+`v-model`就够了。

## `<script>`标签
`<script>`标签中是这个组件的js代码。

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Reference
> * https://cn.vuejs.org/v2/guide/
> * https://www.cnblogs.com/goloving/p/8693189.html
