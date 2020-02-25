Component({
  props: {
    value: {}
  },
  onInit() {
    this.$group_id = this.props.id || '';
    this.$identify = this.props.identify;                                  // 选项组标识
    this.$radio = new Map();
    Object.defineProperty(this.$page, `$radio_group_${this.$group_id}`, {  // 注册组件到页面
      get: () => ({
        register: this.register.bind(this),
        logout: this.logout.bind(this),
        onChange:this.onChange.bind(this)
      }),
      configurable: true
    })
  },
  didUpdate(prevProps) {
    const { value } = this.props;
    const { value: prevValue } = prevProps;
    const key = this.getKey(value);                           // 当前选中值
    const prevKey = this.getKey(prevValue);                   // 新的选中值
    if (key !== prevKey) {                                    // 选项切换
      const prevRadio = this.$radio.get(prevKey);             // 旧的radio
      const radio = this.$radio.get(key);                     // 新的radio
      prevRadio && prevRadio.update(false);
      radio && radio.update(true);                           // 更新子组件状态
    }
  },
  methods: {
    onChange(child) {
      const { onChange } = this.props;
      onChange && onChange(child.props.value);                // 触发onChange事件
    },
    getKey(item) {
      const { identify } = this.props;
      const result = item[identify] || item;
      return typeof result === 'object' ? result : `${result}`;
    },
    register(child) {
      const key = this.getKey(child.props.value);             // 获取子组件的mapKey
      const checked_key = this.getKey(this.props.value);      // 获取已选中的mapKey
      this.$radio.set(key, child);                            // 注册子组件
      checked_key === key && child.update(true);              // 设置子组件初始状态
    },
    logout(child) {
      const key = this.getKey(child.props.value);
      this.$radio.delete(key);
    }
  }
});
