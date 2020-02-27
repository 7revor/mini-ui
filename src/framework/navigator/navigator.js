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
     * 一级菜单点击
     */
    menuTap(ev) {
      const {dataset: {idx}} = ev.target;
      const menu = this.props.config.routes[idx];
      menu.$id = `menu-${idx}`;
      if (!this.navigate(menu)) { // 默认类型，展开子菜单
        this.menuExband(menu);
      }
    },
    /**
     * 二级菜单点击
     */
    subMenuTap(ev) {
      const {dataset: {idx, pIdx}} = ev.target;
      const menu = this.props.config.routes[pIdx];
      const subMenu = menu.children[idx];
      subMenu.$id = `menu-${pIdx}-${idx}`;
      this.navigate(subMenu);
    },
    /**
     * 悬浮菜单点击
     */
    overlayMenuTapHandler(ev) {
      const menu = ev.target.dataset.menu;    // 点击的悬浮菜单
      if (menu.children && menu.childType !== 'tab') throw new Error('overlay路由的子路由只能是tab类型');
      this.navigate(menu);
      this.setData({visible: false, overlayMenu: {}, target: ''});
    },
    /**
     * 路由跳转
     */
    navigate(menu) {
      if (menu.url) {
        my.navigateTo({url: menu.url});
        return
      }
      ;                   // 手动跳转
      if (!this.hasChildren(menu)) {
        this.$page.$router.push(menu.$path);
        return
      }
      ;  // 无子路由，直接跳转
      /**
       * 有子路由
       */
      if (menu.childType === 'tab') {
        this.$page.$router.push(menu.$path);
        return;
      }    // tab 类型，直接跳转
      if (menu.childType === 'overlay') { // 浮框类型
        this.overlayVisibleHandler(menu);
        return;
      }
      this.setData({overlayMenu: {}});
      return false;
    },
    /**
     * 菜单折叠
     */
    menuExband(menu) {
      if (!menu.$id) return;
      const targetHeight = this.data.heights[menu.$id];
      const targetRotate = this.data.rotates[menu.$id];
      this.setData({
        ['heights.' + menu.$id]: targetHeight ? 0 : menu.children.length * 44 + 'px',
        ['rotates.' + menu.$id]: targetRotate === 'rotate(0deg)' || !targetRotate ? 'rotate(180deg)' : 'rotate(0deg)'
      })
    },
    /**
     * 浮框显示
     */
    overlayVisibleHandler(menu) {
      const isSameNode = this.data.target === menu.$id;
      this.setData({
        visible: isSameNode ? false : true,
        target: isSameNode ? '' : menu.$id,
        overlayMenu: isSameNode ? {} : menu
      })
    },
    /**
     * 悬浮菜单关闭
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
      this.$page.$router.push(init_path);
    },
    /**
     * 是够含有子路由
     */
    hasChildren(route) {
      return route.children && route.children.length
    }
  },
});
