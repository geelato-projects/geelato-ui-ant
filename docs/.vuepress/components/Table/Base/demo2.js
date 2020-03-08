import FormData from '../../Form/Base/UserFormData'

export default {
  "toolbar": {
    "css": {"align": "right"},
    "actions": [
      {
        "gid": "EiRQaxQq",
        "ctx": "this",
        "icon": "plus",
        "fn": "openModal",
        "control": "button",
        "title": "创建",
        "type": "primary",
        "params": {}
      },
      {
        "gid": "YqYuNhej",
        "ctx": "this",
        "icon": "delete",
        "fn": "openModal",
        "control": "button",
        "title": "删除",
        "type": "danger",
        "params": {}
      }
    ]
  },
  "stat": "",
  "query": {
    "show": true,
    "mix": {
      "layout": {"fieldPerRow": 3, "display": "auto"},
      "properties": [
        {
          "gid": "name",
          "field": "userId",
          "cop": "eq",
          "control": "input",
          "title": "用户",
          "lop": "and",
          "props": {
            "defaultValue": "",
            "placeholder": "姓名"
          }
        },
        {
          "gid": "AYJ6LY5Y",
          "field": "roleId",
          "cop": "eq",
          "control": "input",
          "title": "角色",
          "lop": "and",
          "props": {"defaultValue": "", "placeholder": ""}
        }
      ]
    }
  },
  "showPagination": "true",
  "title": "用户角色列表",
  "entity": "platform_role_r_user",
  "table": {
    "rowAction": {
      "actions": [
        {
          "gid": "HkrPZ9JB",
          "ctx": "this",
          "icon": "plus",
          "fn": "openModal",
          "control": "link",
          "title": "修改",
          "type": "primary",
          "params": {}
        },
        {
          "gid": "KD9rQRJk",
          "ctx": "this",
          "icon": "plus",
          "fn": "openModal",
          "control": "button",
          "title": "删除",
          "type": "primary",
          "params": {}
        },
        {
          "gid": "EAolVM2q",
          "ctx": "this",
          "icon": "plus",
          "fn": "openModal",
          "control": "button",
          "title": "详情",
          "type": "primary",
          "params": {}
        }
      ]
    },
    "columns": [
      {
        "needTotal": false,
        "gid": "c5t05XvF",
        "scopedSlots": {"customRender": "serial"},
        "sorter": false,
        "dataIndex": "id",
        "title": "#",
        "customRenderString": ""
      },
      {
        "needTotal": false,
        "gid": "cf8OMNtR",
        "sorter": true,
        "dataIndex": "userId",
        "title": "用户ID",
        "customRenderString": ""
      },
      {
        "needTotal": false,
        "gid": "orUzPxGP",
        "sorter": false,
        "dataIndex": "roleId",
        "title": "角色ID",
        "customRenderString": ""
      },
      {
        "needTotal": false,
        "gid": "U421iMRx",
        "scopedSlots": {"customRender": "action"},
        "sorter": false,
        "dataIndex": "",
        "width": "150px",
        "title": "操作",
        "customRenderString": ""
      }
    ],
    "showHeader": true,
    "show": true,
    "pageSize": 20,
    "order": "createAt|+"
  }
}
