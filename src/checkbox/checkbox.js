import { fmtEvent } from '/common/util/util'
Component({
  data: { checked: false },
  onInit() {
    this.$parent = this.props.parent || '';
    this.$group = this.$page[`$checkbox_group_${this.$parent}`];
    if (this.$group) {
      this.$group.register(this);
    } else {
      delete this.data.checked;// 脱离group单独使用，删除 checked data，由props控制是否选中
    }
  },
  didUnmount() {
    this.$group && this.$group.logout(this);
  },
  methods: {
    /**
     * 选项点击事件
     */
    tapHandler(event) {
      if (this.props.disabled) return;
      if (this.$group) {  // 使用group，交由 group 控制
        this.$group.onChange(this);
      } else {              // 自己控制，触发props点击事件
        if (this.props.onTap) {
          if (typeof this.props.onTap === 'function') {
            const ev = fmtEvent(this.props, event)
            this.props.onTap(ev);
          } else {
            throw new Error('tap event must be type of function')
          }
        }
      }
    },
    update(checked) {
      this.setData({
        checked
      })
    }
  },
});
