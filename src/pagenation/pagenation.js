Component({
  mixins: [],
  data: {
    pageCount: 0, // 总页数
    arr: [], // 总页数
    currentPage: 1, //当前页
    num: 0 // 分页器显示个数  
  },
  props: {
    total: 0,     // 记录总数
    pageSize: 10, // 每页记录条数
    pageNo: 1,    // 当前页
    size: 5,      // 分页器展示数量
    onChange: (pageNo) => { } // 页码切换事件

  },
  deriveDataFromProps(nextProps) {
    const { total, pageSize } = nextProps;
    const { total: totalOld, pageSize: pageSizeOld } = this.props;
    if (total != totalOld || pageSize != pageSizeOld) { //  总数或单页条数变更
      const pageCount = Math.ceil(total / pageSize) || 1;
      this.setData({
        pageCount,
        arr: new Array(pageCount).fill('')
      })
    }
  },
  didMount() {
    if (this.props.size % 2 === 0) throw new Error('pagenation size must be odd!');
    const { total, pageSize } = this.props;
    const pageCount = Math.ceil(total / pageSize) || 1;
    this.setData({
      pageCount,
      num: parseInt((this.props.size - 1) / 2),
      arr: new Array(pageCount).fill('')
    })
  },
  methods: {
    changeHandler(ev) {
      const { type, page } = ev.target.dataset;
      const { pageCount } = this.data;
      let pageNo;
      if (type === 'pre') {
        pageNo = parseInt(this.props.pageNo) - 1
      } else if (type === 'next') {
        pageNo = parseInt(this.props.pageNo) + 1
      } else {
        pageNo = page
      }
      if (pageNo == this.props.pageNo) return;
      pageNo = parseInt(pageNo > pageCount ? pageCount : pageNo || 1);
      this.props.onChange && this.props.onChange(pageNo)
    }
  },
});
