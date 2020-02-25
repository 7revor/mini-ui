Component({
  mixins: [],
  data: {
    heights: {},
    rotates: {},
    visible: false,    // 悬浮菜单是否展示
    target: '',
    overlayMenu: {}    // 悬浮菜单
  },
  props: {
    currentRoute: {}// 当前路由对象
  },
  didMount() {
    this.props.config.routes.forEach((menu, index) => { // 处理默认展开
      if (menu.exband) {
        this.setData({
          ['heights.menu-' + index]: menu.children.length * 44 + 'px',
          ['rotates.menu-' + index]: 'rotate(180deg)'
        })
      }
    })
  },
  methods: {
    /**
     * 是够含有子路由
     */
    hasChildren(route) {
      return route.children && route.children.length
    },
    /**
     * 路由是否可以直接跳转
     */
    canNavigate(route) {
      return !this.hasChildren(route) || (this.hasChildren(route) && route.childType === 'tab'); // 没有子路由或者子路由为tab
    },
    /**
     * 是否为同一路径
     */
    isSamePath(path) {
      return this.props.currentRoute.path === path
    },
    /**
     * 一级菜单点击
     * @param {}} ev
     */
    menuTap(ev) {
      const {dataset: {menu}} = ev.target;
      const length = (menu.children || {}).length || 0;
      const id = ev.target.id;
      if (id) {
        const targetHeight = this.data.heights[id];
        const targetRotate = this.data.rotates[id];
        this.setData({
          ['heights.' + id]: targetHeight ? 0 : length * 44 + 'px',
          ['rotates.' + id]: targetRotate === 'rotate(0deg)' || !targetRotate ? 'rotate(180deg)' : 'rotate(0deg)'
        })
      }
      if (menu.url) my.navigateTo({url: menu.url}); // 手动跳转
      else if (this.canNavigate(menu) && !this.isSamePath(menu.path)) { // 没有子路由，或者tab类型
        this.$page.$router.push(menu.path);
      }
    },
    /**
     * 二级菜单点击
     */
    subMenuTap(ev) {
      const currTarget = ev.target.id; // 点击目标
      const {subMenu: currMenu, path} = ev.target.dataset;
      currMenu.pathStack = path;
      if (currMenu.childType === 'overlay') {     // 浮框类型子路由
        const isSameNode = this.data.target === currTarget;
        this.setData({
          visible: isSameNode ? false : true,
          target: isSameNode ? '' : currTarget,
          overlayMenu: isSameNode ? {} : currMenu
        })
      } else {      // 不是浮框类型
        const targerPath = path.filter(path => path).join('');
        if (!this.isSamePath(targerPath)) {
          this.$page.$router.push(targerPath)
        }
        ;  // 直接跳转
        this.setData({overlayMenu: {}})
      }
    },
    /**
     * 悬浮菜单点击事件
     * @param {*} ev
     */
    overlayMenuTapHandler(ev) {
      const menu = ev.target.dataset.menu;    // 点击的悬浮菜单
      const overlayMenu = this.data.overlayMenu; // 当前二级菜单
      let pathStack = overlayMenu.pathStack.filter(path => path);
      this.$page.$router.push(`${pathStack.join('')}${menu.path}`);
      this.setData({ visible: false,overlayMenu:{},target:'' });
    },
    /**
     * 悬浮菜单关闭
     * @param {*} ev
     */
    onOverlayClose(ev) {
      const requestIndex = ev.target.dataset.index
      if (requestIndex === this.data.target && this.data.visible) { // 请求关闭当前浮层
        this.setData({
          visible: false
        });
      }
    },
    /**
     * 回到首页
     */
    goHome() {
      const init_path = (this.props.config.option || {}).initPath || '/'
      if (!this.isSamePath(init_path)) this.$page.$router.push(init_path);
    },
  },
});
