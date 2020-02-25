Component({
  data: {
    breadcrumb: []
  },
  onInit() {
    this.$page.$router.setAfterChange(this, 'onPathChange'); // 跳转监听
    this.onPathChange();
  },
  methods: {
    /**
     * 页面路由跳转回调
     */
    onPathChange() {
      const { currentRoute, routeRecord } = this.$page.$router;
      let currentPath = currentRoute.path;
      const breadcrumb = [];
      while (currentPath) {
        const route = routeRecord[currentPath];
        const next = route.children; // 下级路由
        if (route.isBreadcrumb !== false && route.$type !== 'tab') { // 筛选本页是否在面包屑中显示
          breadcrumb.unshift({
            name: route.name,
            path: currentPath,
            default: route.default,
            breadcrumbLink: !next ? false : route.breadcrumbLink // 当前页不可跳转
          })
        }
        const index = currentPath.lastIndexOf('/');
        currentPath = currentPath.slice(0, index);
      }
      this.setData({
        breadcrumb
      })
    },
    /**
     * 路由跳转
     */
    link({ target: { dataset: { path } } }) {
      if (path.breadcrumbLink !== false) {
        const { routeRecord } = this.$page.$router;
        let target = routeRecord[path.path]
        if (target.default) path.path = path.path + '/' + target.default
        this.$page.$router.push(path.path) // 判断是否含有默认路由
      }
    },
  },
});
