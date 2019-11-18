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
`<script>`标签中是这个组件的js代码。我们目前写的都是单文件组件（以后会具体介绍这个名词），所以整个标签主要由一个`export default {...}`构成，用于将这个组件暴露出去。接下来我们将依次介绍这个对象中的内容。

### 其他
#### name
这个组件的名字。命名规范是kebab-case(短横线分隔命名)或PascalCase(首字母大写命名)，当你使用后者时，引用这个自定义元素时两种命名法都可以使用。

例如，name是`my-component-name`，你只能以`<my-component-name>`来引用；而name是`MyComponentName`时，`<my-component-name>`和`<MyComponentName>`都是可接受的。

#### components
一般就是一个`List`，用于列出所有可用的组件。也可以是一个`Object`，key是别名，value是组件。

### 数据
#### data
这个组件内部所有的变量。需要注意的是，`data`必须是一个函数，这样每个实例才可以维护一份被返回对象的独立的拷贝。否则当你在一个组件A内复用了多个组件B时，这多个组件B会共享同一个`data`。

在里面声明的变量var，既可以在其他的函数中以`this.$data.var`的方式访问，也可以更方便地以`this.var`的方式访问。但是以`_`或`$`开头的属性*不会*被Vue实例代理，只能用前一种方式访问。

#### props
我们使用html标签时，可能会为它们添加一些属性，比如`<a href="www.pku.edu.cn">PKU</a>`。如果想在自定义的组件上实现类似这里的`href`这种传入的参数，就需要`props`来定义。

`props`可以是一个`List`，也可以是一个`Object`。`Object`会提供更多详细的配置：
* type: 可以是下列原生构造函数中的一种：String、Number、Boolean、Array、Object、Date、Function、Symbol、任何自定义构造函数、或上述内容组成的数组。
* default: 为该`prop`指定一个默认值。
* required: Boolean，是否是必需的。
* validator: Function，返回一个Boolean，用于验证传入的数据的有效性。

#### computed
计算属性。可以基于其他变量来计算出这个变量。

比如：
```vue
computed: {
  aDouble: vm => vm.a * 2,
  aTriple: function () {
    return this.a * 3
  }
}
```

计算属性的结果会被缓存，除非依赖的响应式属性变化才会重新计算。

#### methods
其他的函数都可以写在这里，比如事件的handler、被调用的函数等等。

需要注意的是，这里写的函数不能像上面那样声明成箭头函数了。因为那样的话会导致`this`并没有绑定到Vue实例上，从而无法正确访问其他的函数或者`data`。

#### watch
当被监视的变量改变时会被调用。和`props`类似，你可以直接写一个函数作为handler，也可以写一个`Object`，定义如下：
* handler: Function(val, oldVal)。发生变化时被调用的函数。
* deep: 为true时，当被监视对象是个`Object`时，无论多深的嵌套发生了变化，都会触发handler。默认为false。
* immediate: 为true时，handler在侦听开始之后被立即调用。默认为false。

与`methods`相同，这里不能使用箭头函数。

### 生命周期钩子
下面定义的函数将会在Vue组件运行到相应的生命周期时触发。与`methods`相同，这里不能使用箭头函数。
目前我们只列出一些被用到的周期。

#### created
在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，`watch/event`事件回调。

然而，挂载阶段还没开始，也就是说，绝大多数数据都能够被访问到了，但是你还无法操作DOM和其他子组件，无法访问`$refs`。

> `ref`被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的`$refs`对象上。如果在普通的`DOM`元素上使用，引用指向的就是`DOM`元素；如果用在子组件上，引用就指向组件实例。这是我们操作`DOM`元素的一个重要手段。

#### mounted
挂载阶段已经完成，但是`mounted`不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用`vm.$nextTick`替换掉`mounted`：

```vue
mounted: function () {
  this.$nextTick(function () {
    // Code that will run only after the
    // entire view has been rendered
  })
}
```

#### beforeDestroy
实例销毁之前调用。在这一步，实例仍然完全可用。

## <style>标签
`<style>`标签中是这个组件的css代码。我们留到以后再讲。

## 我们以后会讲的内容
* 第三方组件的安装与配置
* element-ui、axios
* css、动态class与style
* 响应式属性
* 组件的基本知识、生命周期、单文件组件、组件注册与复用
* 父子组件之间的通信
* 全局状态管理

## 前后端协同
### 跨域问题
接下来我们需要处理的是跨域问题。

跨域指的就是"跨域资源共享（Cross-Origin Resource Sharing, CORS）"，当一个资源从与该资源本身所在的服务器的不同域或者不同端口请求一个资源时，就会发起一个跨域HTTP请求。

当<域名, 端口, 协议>三者完全相同才会被认为是"同源"请求，否则浏览器会拒绝请求，防止用户信息被窃取。

跨域问题是需要在后端服务器层面进行解决的，即让后端服务器认可你这个前端页面。在django rest framework下很容易解决这个问题，我们采用`django-cors-headers`这个插件来进行配置。

在安装了`django-cors-headers`后，在`settings.py`中进行下列修改：

* 在`INSTALLED_APPS`中添加`corsheaders`
* 在`MIDDLEWARE`的最上层添加`corsheaders.middleware.CorsMiddleware`
* 添加配置`CORS_ORIGIN_WHITELIST`，加入你前端地址和端口
* 添加配置`CORS_ALLOW_CREDENTIALS`，设置为`True`，以便我们日后实现登录等功能。

以上改动可以在[dcac7b7cb8a3401abfc44dfc3a3e29d93ceed412](https://github.com/FireBrother/DCServerTutorial/commit/dcac7b7cb8a3401abfc44dfc3a3e29d93ceed412)看到。

### 为Vue添加http请求的能力
我个人比较习惯用`axios`这个第三方库。`axios`是一个基于`promise`的异步通信库，我们用它来实现向后端服务器的请求。

在我们的Vue项目的根目录执行

```bash
npm install --save axios
```

然后在`main.js`中全局引入这个库，并挂载到Vue实例原型上，就可以在任意地方使用它了。我们之后章节会详细说明如何进行个性化配置，使其更易于使用。

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
> * https://cn.vuejs.org/v2/api/
> * https://www.cnblogs.com/goloving/p/8693189.html
