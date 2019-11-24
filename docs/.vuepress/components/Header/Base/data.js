export default {
  title: '标题一',
  icon: 'plus-square',
  // size: 'h2',
  style: {
    'background-color': '#cccccc'
  },
  extra: {
    controls: [
      {
        control: 'select',
        title: '性别',
        // 若数据是动态生产成，可配置ds，基于ds加载的数据最终会设置到data中
        data: [
          {text: '保密', value: 2},
          {text: '男', value: 1},
          {text: '女', value: 0}
        ],
        props: {
          defaultValue: 2
        }
      },
      {
        control: 'button',
        title: '更多',
        props: {
          type: 'link',
          // ghost: 'true'
        }
      }
    ]
  }
}
