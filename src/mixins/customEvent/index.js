import { fmtEvent } from '../../util'
/**
 * 自定义组件点击事件处理
 */
export default {
  methods: {
    tapHandler: function (event) {
      if (this.props.onTap && !this.props.disabled) {
        if (typeof this.props.onTap === 'function') {
          const ev = fmtEvent(this.props, event)
          this.props.onTap(ev);
        } else {
          throw new Error('tap event must be type of function')
        }
      }
    },
    catchTapHandler(event) {
      if (this.props.catchTap && !this.props.disabled) {
        if (typeof this.props.catchTap === 'function') {
          const ev = fmtEvent(this.props, event)
          this.props.catchTap(ev);
        } else {
          throw new Error('tap event must be type of function')
        }
      }
    }
  }
}
