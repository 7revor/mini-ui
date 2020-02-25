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
        const isLast = currentRoute.path === currentPath;
        if (route.isBreadcrumb !== false && route.$type !== 'tab') { // 筛选本页是否在面包屑中显示
          breadcrumb.unshift({
            name: route.name,
            path: currentPath,
            breadcrumbLink: isLast ? false : route.breadcrumbLink // 当前页不可跳转
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
        this.$page.$router.push(path.path);
      }
    },
  },
});
