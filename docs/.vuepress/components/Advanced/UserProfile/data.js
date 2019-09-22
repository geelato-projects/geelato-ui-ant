import FormData from "../../Form/Base/UserFormData";
import UserSecurityFormData from "../../Form/Base/UserSecurityFormData";
import TableData from "../../Table/Base/data.js";
import MessageTableData from "../../Table/Base/message.js";

let securitySettingsListData = {
  entityDataReader: {
    entity: 'platform_role',
    fields: 'id,name,code,description',
    withMeta: false,
    // key为组件内用到的字段名，右边为实体查询结果返回的字段
    // 当右边的字段不在fieldNames的范围内时，则该值为静态值，如以下的avatarUrl
    resultMapping: {
      avatarUrl: `'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'`,
      title: `$ctx.name +'('+ $ctx.code + ')'`,
      content: 'code',
      description: 'description'
    }
  }
}

let messageTable = {

}

export default {
  defaultActiveIndex: 0,
  tabPosition: 'left',
  size: 'default',
  type: 'line', // editable-card
  tabBarGutter: 0, // px
  panes: [
    {
      title: '基础信息',
      content: {
        type: 'static',
        component: 'GlForm',
        // component: resolve => require(['/components/Form/Base/Example.vue'], resolve),
        props: {opts: JSON.parse(JSON.stringify(FormData))}
      },
    },
    {
      title: '安全设置',
      content: {
        type: 'static',
        component: 'GlForm',
        // component: resolve => require(['/components/Form/Base/Example.vue'], resolve),
        props: {opts: JSON.parse(JSON.stringify(UserSecurityFormData))}
      },
    },
    {
      title: '个性化',
      content: {
        type: 'static',
        component: 'GlTable',
        // component: resolve => require(['/components/Form/Base/Example.vue'], resolve),
        props: {opts: JSON.parse(JSON.stringify(TableData))}
      },
    },
    {
      title: '账户绑定',
      content: {
        type: 'static',
        component: 'GlTable',
        // component: resolve => require(['/components/Form/Base/Example.vue'], resolve),
        props: {opts: JSON.parse(JSON.stringify(TableData))}
      },
    },
    {
      title: '消息通知',
      content: {
        type: 'static',
        component: 'GlTable',
        props: {opts: JSON.parse(JSON.stringify(MessageTableData))}
      },
    }

  ]
}
