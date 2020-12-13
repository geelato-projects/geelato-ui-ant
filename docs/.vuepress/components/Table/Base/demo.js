import FormData from '../../Form/Base/UserFormData'

export default {
  "title": "示例信息",
  "entity": "platform_demo_entity",
  "query": {
    "show": true,
    "tree": null,
    "filter": null,
    "mix": {
      "properties": [
        {
          "field": "id",
          "title": "ID",
          "cop": "eq",
          "control": "input",
          "lop": "and",
          "gid": "id"
        },
        {
          "field": "name",
          "title": "名称",
          "cop": "contains",
          "control": "input",
          "lop": "and",
          "props": {
            "placeholder": "姓名",
            "defaultValue": ""
          },
          "gid": "name"
        },
        // {
        //   "field": "code",
        //   "title": "编码",
        //   "cop": "contains",
        //   "control": "input",
        //   "lop": "and",
        //   "props": {"placeholder": ""},
        //   "gid": "code"
        // },
        {
          "field": "type",
          "title": "类型",
          "cop": "eq",
          "control": "select",
          dsName: 'txw8n567',
          "data": [
            {"text": "默认", "value": 0},
            {"text": "类型一", "value": 1},
            {"text": "类型二", "value": 2}
          ],
          "props": {
            "AddPreOptionText": "全部",
            "placeholder": "请选择"
          },
          "gid": "type"
        },
        {
          "field": "description",
          "title": "描述",
          "cop": "contains",
          "control": "input",
          "lop": "and",
          "gid": "description"
        }
      ],
      "layout": {"display": "auto", "fieldPerRow": 4}
    },
    "ds": {
      "txw8n567": {
        "entity": "platform_demo_entity",
        "lazy": false,
        "fields": "name,id",
        "resultMapping": {"text": "name", "value": "id"},
        // 该信息会自动加入计算属性中，当province的值变动时，该数据源会重新加载计算
        "params": [{
          name: 'name',
          cop: 'contains',
          value: 'gs:$ctx.name'
        }],
        "description": "这是一个下拉列表数据源，带参数"
      }
    }
  },
  "toolbar": {
    "actions": [
      {
        "text": "创建",
        "title": "创建",
        "control": "button",
        "icon": "plus",
        "type": "primary",
        "gid": "82SdQoHB"
      }
    ],
    "css": {"align": "right"}
  },
  "alert": null,
  "showPagination": "true",
  "table": {
    "rowAction": {
      maxShow: 2,
      "actions": [
        {
          gid: '11111111',
          "text": "修改",
          "icon": "plus",
          "type": "primary",
          "fn": "$_openModal",
          "ctx": "this",
          "params": {
            "title": "编辑DEMO实体",
            "width": "1200px",
            "height": "480px",
            "body": {
              "type": "staticPage",
              "component": "GlForm",
              "props": {
                "opts": {
                  "type": "object",
                  "defaultEntity": "platform_demo_entity",
                  "state": "save",
                  "properties": {
                    "id": {},
                    "name": {
                      "control": "input",
                      "title": "名称"
                    },
                    "code": {
                      "control": "input",
                      "title": "编码",
                      "rules": {"required": true}
                    },
                    "type": {
                      "control": "select",
                      "title": "类型",
                      "data": [
                        {"text": "默认", "value": "0"},
                        {"text": "类型一", "value": "1"},
                        {"text": "类型二", "value": "2"}
                      ],
                      "props": {"defaultValue": "0"}
                    },
                    "content": {
                      "control": "textarea",
                      "title": "内容",
                      "rules": {"required": true}
                    },
                    "description": {
                      "control": "textarea",
                      "title": "描述"
                    }
                  },
                  "layout": {
                    "type": "table",
                    "rows": [
                      {
                        "cols": [
                          {
                            "span": 4,
                            "label": true,
                            "field": "name"
                          },
                          {"span": 8, "field": "name"},
                          {
                            "span": 4,
                            "label": true,
                            "field": "code"
                          },
                          {"span": 8, "field": "code"}
                        ]
                      },
                      {
                        "cols": [
                          {
                            "span": 4,
                            "label": true,
                            "field": "type"
                          },
                          {"span": 20, "field": "type"}
                        ]
                      },
                      {
                        "cols": [
                          {
                            "span": 4,
                            "label": true,
                            "field": "content"
                          },
                          {"span": 20, "field": "content"}
                        ]
                      }
                    ],
                    "hidden": {}
                  },
                  "ds": {},
                  "vars": {},
                  "watch": {}
                }
              }
            },
            "actions": [
              {
                "text": "保存",
                "type": "primary",
                "fn": "save",
                "ctx": "content",
                "params": {},
                "then": {
                  "fn": "close",
                  "ctx": "modal",
                  "then": {
                    "fn": "refresh",
                    "ctx": "opener"
                  }
                }
              },
              {
                "fn": "close",
                "text": "取消",
                "ctx": "modal"
              }
            ]
          },
          "dataMapping": {"query": {"id": "$ctx.id"}}
        },
        {
          gid: '22222222',
          "text": "查看",
          "icon": "plus",
          "type": "primary",
          "fn": "$_openModal",
          "ctx": "this",
          params: {},
          dataMapping: {}
        },
        {
          gid: '33333333',
          "text": "设置密码",
          "icon": "plus",
          "type": "primary",
          "fn": "$_openModal",
          "ctx": "this",
          params: {},
          dataMapping: {}
        }
      ]
    },
    "columns": [
      {
        "title": "#",
        "dataIndex": "id",
        "scopedSlots": {"customRender": "serial"}
      },
      {
        "title": "名称",
        "dataIndex": "name",
        "sorter": true
      },
      {
        "title": "编码",
        "dataIndex": "code",
        "sorter": true
      },
      {
        "title": "类型",
        "dataIndex": "type",
        "sorter": true,
        "customRenderString": "(text) => text == 2 ? '类型二' : (text == 1 ? '类型一' : '默认类型')"
      },
      {"title": "描述", "dataIndex": "description"},
      {
        "title": "操作",
        "dataIndex": "",
        "width": "150px",
        "scopedSlots": {"customRender": "action"}
      }
    ],
    "pageSize": 20,
    "order": "name|+"
  },
  "stat": ""
}
