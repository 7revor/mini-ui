
const default_data = {
  open: false,   // 是否渲染
  visible: false,// 是否打开
  type: '',
  sureText: '确定',
  cancelText: '取消',
  content: '',
  cancel: () => { },
  before_sure: () => true,
  after_close: () => { }
}
Component({
  data: default_data,
  methods: {
    /**
     * 单按钮提示
     */
    alert(param) {
      if (typeof param === 'string') param = { content: param }
      return this.show({ ...param, type: 'alert' });
    },
    /**
     * 双按钮确认
     */
    confirm(param) {
      if (typeof param === 'string') param = { content: param }
      return this.show({ ...param, type: 'confirm' });
    },
    /**
     * 确定事件
     */
    sure() {
      const { before_sure } = this.data;                // 钩子函数
      if (before_sure && !before_sure()) return         // 阻止关闭
      this.$resolve && this.$resolve();                 // promise resolve
      this.close(); // 弹窗关闭
    },
    /**
     * 取消事件
     */
    cancel() {
      this.data.cancel && this.data.cancel(); // 取消事件
      this.close(); // 关闭弹窗
    },
    /**
     * 打开弹窗
     */
    async show(param) {
      this.$closed && await this.$closed;   // 如果已开启过弹窗，等待上个弹窗关闭
      this.setData({
        open: true
      }, () => {
        this.setData({
          visible: true,
          ...param,
        })
      })
      this.$closed = new Promise(resolve => this.$close = resolve); // 弹窗关闭监听
      return new Promise(resolve => this.$resolve = resolve);
    },
    /**
     * 关闭弹窗
     */
    close() {
      const { after_close } = this.data;   // 钩子函数
      this.setData({                       // 触发关闭动画
        visible: false
      }, () => {
        setTimeout(() => {
          this.setData({ ...default_data }) // 取消渲染
          this.$close();
          after_close && after_close();    // 关闭后回调
        }, 210)
      })
      this.$resolve = null;
    }
  }
});
