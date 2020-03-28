import FormData from '../../Form/Base/UserFormData'

export default {
  "bind": {
    "opts": {
      "toolbar": {
        "css": { "align": "right" },
        "actions": [
          {
            "gid": "sefJ8O68",
            "ctx": "this",
            "icon": "plus",
            "fn": "openModal",
            "control": "button",
            "title": "创建",
            "type": "primary",
            "params": {}
          },
          {
            "gid": "Sr5vjY6A",
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
          "layout": { "fieldPerRow": 4, "display": "auto" },
          "properties": [
            {
              "gid": "id",
              "field": "userId",
              "cop": "eq",
              "control": "input",
              "title": "用户ID",
              "lop": "and",
              "props": {
                "defaultValue": "",
                "placeholder": "姓名"
              }
            }
          ]
        }
      },
      "showPagination": "true",
      "title": "用户角色关系列表",
      "entity": "platform_role_r_user",
      "table": {
        "rowAction": {
          "actions": [
            {
              "gid": "1PMQhNhM",
              "ctx": "this",
              "icon": "plus",
              "fn": "openModal",
              "control": "link",
              "title": "修改",
              "type": "primary",
              "params": {}
            },
            {
              "gid": "m30ee1T9",
              "ctx": "this",
              "icon": "plus",
              "fn": "openModal",
              "control": "button",
              "title": "删除",
              "type": "primary",
              "params": {}
            },
            {
              "gid": "wRsTnXNI",
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
            "gid": "tlJ2yoNo",
            "scopedSlots": { "customRender": "serial" },
            "sorter": false,
            "dataIndex": "id",
            "title": "#",
            "customRenderString": ""
          },
          {
            "needTotal": false,
            "gid": "QEqWU5oU",
            "sorter": true,
            "dataIndex": "userId",
            "title": "用户ID",
            "customRenderString": ""
          },
          {
            "needTotal": false,
            "gid": "MQSjL8n1",
            "sorter": true,
            "dataIndex": "roleId",
            "title": "角色ID",
            "customRenderString": ""
          },
          {
            "needTotal": false,
            "gid": "49RK1lCy",
            "scopedSlots": { "customRender": "action" },
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
    },
    "query": {}
  }, params: {"id": "1"}
}
