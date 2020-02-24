export default {
  "layout": {
    "hidden": {},
    "type": "table",
    "rows": [
      {
        "cols": [
          {"field": "name", "label": true, "span": 4},
          {"field": "name", "span": 8},
          {"field": "code", "label": true, "span": 4},
          {"field": "code", "span": 8}
        ]
      },
      {
        "cols": [
          {"field": "type", "label": true, "span": 4},
          {"field": "type", "span": 20}
        ]
      },
      {
        "cols": [
          {"field": "content", "label": true, "span": 4},
          {"field": "description", "span": 20}
        ]
      }
    ]
  },
  "toolbar": {
    "gid": "56vRcp4H",
    "show": true,
    "actions": [
      {
        "gid": "sgWqHy1W",
        "ctx": "self",
        "fn": "save",
        "show": "true",
        "icon": "",
        "text": "保存",
        "type": "primary"
      }
    ]
  },
  "watch": {},
  "defaultEntity": "platform_demo_entity",
  "state": "save",
  "vars": {},
  "type": "object",
  "properties": {
    "code": {
      "gid": "code",
      "field": "code",
      "isServerSaveIgnore": false,
      "control": "input",
      "rules": {"required": true},
      "title": "编码",
      "value": "",
      "entity": "platform_demo_entity",
      "props": {},
      "ds": ""
    },
    "name": {
      "gid": "name",
      "field": "name",
      "control": "input",
      "title": "名称",
      "value": "",
      "entity": "platform_demo_entity",
      "props": {}
    },
    "description": {
      "gid": "description",
      "field": "description",
      "control": "textarea",
      "title": "描述",
      "value": "",
      "entity": "platform_demo_entity",
      "props": {}
    },
    "id": {
      "gid": "id",
      "field": "id",
      "value": "",
      "entity": "platform_demo_entity",
      "props": {}
    },
    "type": {
      "gid": "type",
      "data": [],
      "field": "type",
      "isServerSaveIgnore": false,
      "control": "select",
      "rules": {},
      "title": "类型",
      "value": "",
      "entity": "platform_demo_entity",
      "props": {},
      "ds": "4XCmcCSc"
    }
  },
  "ds": {
    "4XCmcCScx": {
      "lazy": false,
      "resultMapping": {"text": "name", "value": "id"},
      "description": "这是一个下拉列表数据源，带参数",
      "fields": "name,id",
      "params": {},
      "entity": "platform_demo_entity"
    },
    '4XCmcCSc': {
      entity: 'platform_demo_entity',
      // default false
      lazy: false,
      // 支持字段重命名
      fields: 'name,code',
      resultMapping: {
        text: 'name',
        value: 'code'
      },
      description: '这是一个下拉列表数据源'
    },
  }
}
