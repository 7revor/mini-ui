Component({
  props: {
    checkedValue: []
  },
  onInit() {
    this.$group_id = this.props.id || '';
    this.$identify = this.props.identify;                                     // 选项组标识
    this.$checkbox = new Map();
    this.initCheckedValue(this.props.checkedValue);
    Object.defineProperty(this.$page, `$checkbox_group_${this.$group_id}`, {  // 注册组件到页面
      get: () => ({
        register: this.register.bind(this),
        logout: this.logout.bind(this),
        onChange: this.onChange.bind(this)
      }),
      configurable: true
    })
  },
  deriveDataFromProps(nextProps) {
    if (this.$inner_change) {                                         // 状态改变由组件内部引起（无需同步子组件状态）
      this.$inner_change = false;                                     // 置空标记
    } else {
      if (nextProps.checkedValue !== this.props.checkedValue) {       // 外部设置checkedValue
        this.initCheckedValue(nextProps.checkedValue);                // 重置选中值
        for (let [k, v] of this.$checkbox.entries()) {                // 同步子组件状态
          if (this.$checked_map.has(k)) {
            v.update(true)
          } else {
            v.update(false)
          }
        }
      }
    }
  },
  methods: {
    /**
     * 初始化选中值map
     */
    initCheckedValue(checkedValue) {
      this.$checked_map = new Map();
      checkedValue.forEach(value => {
        const key = this.getKey(value);
        this.$checked_map.set(key, value)
      })
    },
    /**
     * 选项改变事件
     */
    onChange(child) {
      const { onChange, limit } = this.props;
      const key = this.getKey(child.props.value);         // 获取子组件的mapKey
      if (!this.$checked_map.has(key)) {          // 新增选项 
        if ((limit || limit == 0) &&
          this.$checked_map.size >= parseInt(limit)) {    // 选中值超过个数限制
          onChange(null);
          return
        }
        child.update(true);                              // 更新子组件状态
        this.$checked_map.set(key, child.props.value);   // 设置选中值
      } else {                                           // 减少选项
        child.update(false);                                 // 更新子组件状态
        this.$checked_map.delete(key);                       // 删除选中值
      }
      this.$inner_change = true;                          // 内部改变标记
      onChange([...this.$checked_map.values()]);          // 触发onChange事件
    },
    /**
     * 获取map中存放的key
     */
    getKey(item) {
      const result = item[this.$identify] || item;
      return typeof result === 'object' ? result : `${result}`;
    },
    register(child) {
      const key = this.getKey(child.props.value);       // 获取子组件的mapKey
      this.$checkbox.set(key, child);                   // 注册子组件
      this.$checked_map.has(key) && child.update(true); // 设置子组件初始状态
    },
    logout(child) {
      const key = this.getKey(child.props.value);
      this.$checkbox.delete(key);                       // 删除子组件
    }
  }
});
