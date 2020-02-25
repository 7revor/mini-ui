let $inatance;
Component({
  data: {
    currentRoute: {},//当前路由
    loading_visible: false,
    loading_content: '',
    tabs: [],
    activeKey: '',
    parentPath: ''
  },
  onInit() {
    $inatance = this;
    this.$page.onFrameworkReady && this.$page.onFrameworkReady(this);
    this.$page.$router.setBeforeChange(this, 'pathFilter');  // 跳转拦截
    this.$page.$router.setAfterChange(this, 'onPathChange'); // 跳转监听
    this.onPathChange();
  },
  methods: {
    /**
     * 跳转拦截，将直接跳转到tab父页的路由重定向到第一个子页面
     */
    pathFilter(curr, next) {
      if (next.childType === 'tab') {   // 直接跳转tab父页面
        const firsrChildPath = next.path + next.children[0].path;
        const targe = { path: firsrChildPath };
        next.param && (targe.param = next.param);
        this.$page.$router.push(targe); // 跳转到第一个子tab并传递参数
        return false
      } else {
        if (next.default) { // 含有默认子路由
          const targe = { path: next.path + '/' + next.default };
          next.param && (targe.param = next.param);
          this.$page.$router.push(targe); // 跳转到默认子页面
          return false
        } else return true
      }
    },
    /**
     * 页面路由跳转回调
     */
    onPathChange() {
      const { currentRoute, routeRecord } = this.$page.$router;
      console.error(currentRoute)
      const parentPath = currentRoute.path.replace(/\/[^\/]*$/, '');
      const parentRoute = routeRecord[parentPath];
      if (parentRoute && parentRoute.childType === 'tab') {    // 进入子tab页
        const updates = { activeKey: currentRoute.path.slice(currentRoute.path.lastIndexOf('/')) };
        if (parentRoute.path !== this.data.parentPath) {    // 未经父tab直接跳转子tab
          updates.tabs = parentRoute.children.map(child => ({ key: child.path, name: child.name }))
          updates.parentPath = parentRoute.path;
        }
        this.setData({ ...updates, }); // 激活tab页
      } else {       // 进入普通页
        this.setData({ tabs: [], activeKey: '', parentPath: '' }); // 清除tab属性
      }
      this.setData({ currentRoute: { ...currentRoute } });
    },
    /**
     * tab导航跳转
     */
    tabChange(activeKey) {
      const { currentRoute } = this.$page.$router;
      this.setData({
        activeKey
      })
      this.$page.$router.push(/(^.*)\/[^\/]*?$/.exec(currentRoute.path)[1] + activeKey);
    },
    /**
     * 交互弹窗实例
     */
    feedback_dialog(ref) {
      this.$feedback_dialog = ref;
    },
    /**
     * 交互toast实例
     */
    feedback_toast(ref) {
      this.$feedback_toast = ref;
    },
    /**
     * 全局交互方法
     */
    alert(param) {
      return $inatance.$feedback_dialog.alert(param);
    },
    confirm(param) {
      return $inatance.$feedback_dialog.confirm(param);
    },
    toast(param) {
      $inatance.$feedback_toast.toast(param);
    },
    success(param) {
      $inatance.$feedback_toast.success(param);
    },
    error(param) {
      $inatance.$feedback_toast.error(param);
    },
    showLoading(loading_content) {
      $inatance.setData({
        loading_visible: true,
        loading_content
      })
    },
    hideLoading() {
      $inatance.setData({
        loading_visible: false,
        loading_content: ''
      })
    }
  },
});
