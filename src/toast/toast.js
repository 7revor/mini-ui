const init_data = {
  content: '',
  open: false,
  icon: ['', ''],
  visible: false,
}
Component({
  data: init_data,
  Inject: false,
  didMount() {
    this.$visible_timer = null; // 两秒后关闭的事件
    this.$close_timer = null; // 关闭后销毁的事件
  },
  methods: {
    success(option, cb) {
      if (typeof option === 'string') option = { content: option, icon: ['success', '#46BC15'] }
      this.toast(option, cb)
    },
    error(option, cb) {
      if (typeof option === 'string') option = { content: option, icon: ['delete', '#F54531'] }
      this.toast(option, cb)
    },
    async toast(option, cb) {
      if (this.data.open) await this.reopen();
      if (typeof option === 'string') option = { content: option };
      this.setData({ ...option, open: true }, () => {
        this.setData({ visible: true })
        this.$visible_timer = setTimeout(() => {
          this.setData({ visible: false }, () => {
            this.$close_timer = setTimeout(() => {
              this.setData({ ...init_data })                   // 取消渲染
            }, 210);
          })
          cb && cb();
        }, option.timeout || 2000)
      })
    },
    /**
     * 重新打开
     */
    reopen() {
      return new Promise(resolve => {
        clearTimeout(this.$visible_timer);
        clearTimeout(this.$close_timer);
        this.$visible_timer = null;
        this.$close_timer = null;
        this.setData({
          ...init_data
        }, resolve)
      })
    }
  },
});
