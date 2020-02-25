Component({
  mixins: [],
  data: {
    loaded: {}
  },
  props: {
    activeKey: ''
  },
  didMount() { // 初次加载
    this.setData({
      ['loaded.' + this.props.activeKey]: true
    })
  },
  deriveDataFromProps({activeKey:nextKey}) {
    if (nextKey !== this.props.activeKey&&!this.data.loaded[nextKey]) {
      this.setData({
        ['loaded.' + nextKey]: true
      })
    }
  },
  didUnmount() { },
  methods: {
    tabTap({ target: { dataset: { key } } }) {
      if (typeof this.props.onChange !== 'function') {
        console.error('tabChange event must be type of function')
      }
      this.props.onChange(key)
    }
  },
});
