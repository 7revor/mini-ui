# 小程序PC端UI组件库
## 使用
### 安装 
```
npm install py-mini-ui --save
```
### 引入
在页面json中文件中进行注册，如framework组件的注册如下所示：
```js
{
  "usingComponents": {
    "py-framework": "py-mini-ui/es/framework/framework"
  }
}
```
**转译后的代码存放于es目录下，可直接用于打包发布。源码存放于src目录下，可用于调试。**
   
在axml文件中进行调用：
```
  <py-framework config="{{framework_config}}"/>
```
## 组件文档
### button
基础按钮组件
#### props
- `onTap`:点击事件
- `className`:外部类名
- `style`: 外部内联样式
- `type`:按钮类型（default,primary,danger）
#### slot
- `default`:按钮内容
#### eg.
```
<py-button onTap="save" type="danger" className="save-btn">保存</py-button>
```
### radio
单选组件，可结合grop使用，基本用法和移动端一致
**单独使用**
#### props
- `onTap`:点击事件
- `checked`:是否选中
- `className`
- `style`
- `value`:选项值（结合group使用）
- `parent`:group id(配合group的id属性)
#### slot
- `default`:内容插槽
#### eg.
```
<py-radio onTap="{{optionChange}}" checked="{{checked==='OptionA'}}">OptionA</py-radio>
```

**group**
#### props
- `onChange`:选项切换事件
- `value`:选中值
- `identify`:选项标识键
- `id`:选项组id，配合radio的parent
#### slot
- `default`:any
#### eg.
```
<py-radio-group onChange="{{radioChange}}" value="{{checkedValue}}">
    <py-radio value="A">OptionA</py-radio>
    <py-radio value="B">OptionB</py-radio>
    <py-radio value="C">OptionC</py-radio>
</py-group>
```
### checkbox
复选组件，可结合grop使用，基本用法和移动端一致
**单独使用**
#### props
- `onTap`:点击事件
- `checked`:是否选中
- `className`
- `style`
- `value`:选项值（结合group使用）
- `parent`:group id(配合group的id属性)
#### slot
- `default`:内容插槽
#### eg.
```
<py-checkbox onTap="{{optionChange}}" checked="{{checked==='OptionA'}}">OptionA</py-radio>
```

**group**
#### props
- `onChange`:选项切换事件
- `checkedValue`:选中值（数组）
- `identify`:选项标识键
- `id`:选项组id，配合radio的parent
#### slot
- `default`:any
#### eg.
```
<py-checkbox-group onChange="{{radioChange}}" checkedValue="{{checkedValue}}">
    <py-checkbox value="A">OptionA</py-radio>
    <py-checkbox value="B">OptionB</py-radio>
    <py-checkbox value="C">OptionC</py-radio>
</py-checkbox-group>
```
### pagenation
分页器
#### props
- `total`:记录总数
- `pageSize`:每页记录条数
- `pageNo`:当前页
- `size`:分页器展示数量
- `onChange`:页码切换事件
#### slot
- `default`:any
#### eg.
```
<pagenation total="{{total}}" 
            pageSize="{{pageSize}}"
            pageNo="{{pageNo}}" 
            size="5" 
            onChange="pageChange" />
```
```
Component({
    /**
     * 翻页
     * @param page_no 页码
     */
    pageChange(page_no) {       //  页码
        this.setData({ page_no });
        this.getData();
    },
    /**
     * 获取数据
     */
    getData() {
      const { page_no, page_size } = this.data;
      const param = { page_no, page_size};
      service.getData(param).then(({ data, total }) => { 
        this.setData({                                // 赋值页面数据
          activities: data,                           // 活动数据
          total                                       // 页面总数
        })
      })
    },
})
   
```
### tabbar
tabbar组件，和移动端用法一致
#### props
- `tabs`:tabs数组
- `activeKey`:当前激活的tabs
- `onChange`:切换事件
#### slot
- `[name]`:tab页内容，**slot name 需和 tabs 中的 key 一一对应**
#### eg.
```
<tabbar tabs="{{tabs}}" active-key="{{active_key}}">
    <view slot="onsale">出售中</view>
    <view slot="inventory">仓库中</view>
</tabbar>
```
```js
Component({
    data:{
        tabs:[
            {
                name:'出售中',
                key:'onsale'
            },
            {
                name:'仓库中',
                key:'inventory'
            }
        ],
        active_key:'onsale'
    }
    onChange(active_key) {      
        this.setData({ active_key });
    }
})
   
```
### dialog（定制）
基础弹窗定制，和移动端用法一致
- `header`:头部
- `default`:内容
- `footer`:底部
#### eg.
```
<py-dialog ref="dialog">
    <goods-list />
</py-dialog>
```

```js
Component({
    methods:{
        dialog(ref){
            this.$dialog = ref;
        },
        showList(){
            this.$dialog.show(); // 呼起定制弹窗
        }
    }
})
```
### framework
导航框架（结合py-router使用）
#### props
- `config`:框架配置

完整示例：
```
{
  info: {
    logo: 'xxx.png', // logo图片地址
    name: '普云商品',// app 名称
    memo: '由  杭州邻商网络科技提供' // 副标题
  },
  routes: [         // 路由配置（在py-router配置的基础上新增了一些选项）
    {
      path: '/',        // path
      component: 'home',// 组件名称，需和 router 中的 slot 一一对应，若不设置则自动匹配path值去掉斜杠
      name: '首页',     // 名称
      isBreadcrumb: false, // 是否出现在面包屑导航中（首页需设为false）
      isNavigator:false,  // 是否出现在左侧导航菜单中（首页默认点击app logo 跳转）
      commonHeader:false  // 右侧内容区是否采用公共header（包括面包屑导航，页面标题或者子路由tabbar）
    },
    {
      path: '/routeA',
      icon: 'icon-dianpushoucang', // 导航栏图标
      name: '子路由A',
      children: [                  // 子路由
        {
          path: '/childA',
          name: '叶子路由A',
          childType: 'overlay',     // 子路由类型，支持tab（标签）overlay（悬浮菜单）以及 none（无子菜单，需配合default设置默认子路由），默认为none
          children: [
            {
              path: '/overlayA',
              name: '悬浮菜单A',
            },
            {
              path: '/overlayB',
              name: '悬浮菜单B',
            },
          ]
        },
        {
          path: '/childB',
          name: '叶子路由B',
        },
      ]
    },
    {
      path: '/routeB',
      icon: 'icon-shangpinshoucangjiagou',
      name: '子路由B',
      children: [
        {
          path: '/childC',
          name: '叶子路由C',
        },
      ]
    },
    {
      path: '/routeC',
      name: '子路由C',
      icon: 'icon-shangpinpintuan',
      childType: 'tab',
      children: [
        {
          path: '/menuA',
          name: '菜单A',
        },
        {
          path: '/menuB',
          name: '菜单B',
        },
      ]
    },
  ],
  option: {
    initPath: '/',
  },
};
```
#### slot
- `default`:所有一级路由
#### eg.
```
<py-framework config="{{framework_config}}">
    <router>
      <home slot="home" />
      <a slot="routeA" />
      <b slot="routeB" />
      <c slot="routeC" />
    </router>
  </py-framework>
```
### frame自带的交互
frame将基本弹窗，toast和loading的逻辑集成在了内部，可供直接调用。

入口页
```js
import config from "/config/router";
import Router from 'py-mini-router';  //引入初始化方法
import app_config from '/app.json';
const init_data = {
  framework_config: {
    ...config,           // 路由配置
  },
  iconfont: app_config.iconfont
};
Page({
  data: init_data,
  onLoad() {
    this.$router = new Router(config);
  },
  onFrameworkReady(frame) {                 // framework加载完成
    this.$frame = frame;                    // 挂载 framework实例到页面
    my.$alert = frame.alert;                // 挂载全局dialog
    my.$confirm = frame.confirm;  			
    my.$toast = frame.toast;                // 挂载全局dialog
    my.$success = frame.success;
    my.$error = frame.error;
    my.$showLoading = frame.showLoading;    // 挂载全局loading
    my.$hideLoading = frame.hideLoading;    
  },
  
});
```
#### dialog
`my.$alert`，`my.$confirm`用法和移动端frame交互保持一致：
- `content`：**默认显示内容**（若只传入字符串，则会默认作为content参数）
- `sureText`：确认按钮文字
- `cancelText`：取消按钮文字
- `cancel`：取消按钮点击事件
- `before_sure`：确认按钮点击前回调，只有true时可以关闭
- `after_close`：弹窗关闭后的回调

#### toast
`my.$success`，`my.$toast`，`my.$error`用法和移动端frame交互保持一致：
- `content`：**默认显示内容**（若只传入字符串，则会默认作为content参数）
- `icon`：图标及颜色（toast方法支持传入自定义图标，格式为[icon-name,icon-color]）
- `timeout`：多久后关闭




