import FormData from "../../Form/Base/UserFormData";
import TableData from "../../Table/Base/data.js";


export default {
  defaultActiveIndex: 0,
  tabPosition: 'top',
  size: 'default',
  type: 'line', // editable-card
  tabBarGutter: 0, // px
  panes: [
    {
      title: '项目信息',
      content: {
        type: 'static',
        component: 'GlForm',
        // component: resolve => require(['/components/Form/Base/Example.vue'], resolve),
        props: {opts: JSON.parse(JSON.stringify(FormData))}
      },
    },
    {
      title: '项目成员',
      content: {
        type: 'static',
        component: 'GlTable',
        // component: resolve => require(['/components/Form/Base/Example.vue'], resolve),
        props: {opts: JSON.parse(JSON.stringify(TableData))}
      },
    }

  ]
}
