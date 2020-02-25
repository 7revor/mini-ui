/**
 * 为自定义组件事件传递dataset
 * @param {props} props 组件props
 * @param {event} event 事件对象
 */
export function fmtEvent(props, event) {
  let dataset = {};
  Object.keys(props).forEach(key => {
    if (/^data-.*/.test(key)) {
      let dataKey = getKey(key);
      dataset[dataKey] = props[key];
    }
  })
  const newDataset = {
    ...event.currentTarget.dataset,
    ...dataset
  };
  return {
    ...event,
    currentTarget: {
      dataset: newDataset
    },
    target: {
      dataset: newDataset,
      targetDataset: newDataset
    }
  }
}
