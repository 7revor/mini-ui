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
/**
 * 提取 data- 后的内容，删除 - 且将 - 后的第一个字符改为大写
 * @param {string} key dataset key eg.data-userId
 */
function getKey(key) {
  return key.replace(/(^data-)|(-)(.)/g, (match, f, s, t) => {
    if (s && t) {
      return t.toUpperCase()
    }
    return ''
  });
}
