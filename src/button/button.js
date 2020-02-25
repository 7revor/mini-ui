import customEvent from '../mixins/customEvent'
Component({
  mixins:[customEvent],
  props: {
    onTap: () => { },
    className: '',
    style: '',
    type:''
  }
});
