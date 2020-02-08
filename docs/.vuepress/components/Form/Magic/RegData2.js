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
          {"field": "toubeXl4", "label": true, "span": 4},
          {"field": "toubeXl4", "span": 8},
          {"field": "f89sHcbS", "label": true, "span": 4},
          {"field": "f89sHcbS", "span": 8}
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
          {
            "field": "description",
            "label": true,
            "span": 4
          },
          {"field": "description", "span": 20}
        ]
      }
    ]
  },
  "watch": {},
  "defaultEntity": "platform_user",
  "state": "save",
  "vars": {},
  "type": "object",
  "properties": {
    "code": {
      "gid": "code",
      "field": "loginName",
      "isServerSaveIgnore": false,
      "control": "input",
      "rules": {"required": true},
      "title": "编码",
      "value": "",
      "entity": "platform_user",
      "props": {}
    },
    "toubeXl4": {
      "gid": "toubeXl4",
      "field": "sex",
      "data": [
        {"text": "男", "value": "1"},
        {"text": "女", "value": "2"}
      ],
      "isServerSaveIgnore": true,
      "control": "select",
      "rules": {"required": true},
      "title": "性别",
      "entity": "platform_user",
      "props": {},
      "value": ""
    },
    "f89sHcbS": {
      "gid": "f89sHcbS",
      "field": "source",
      "data": [
        {"text": "本地用户", "value": "1"},
        {"text": "系统同步", "value": "2"}
      ],
      "isServerSaveIgnore": true,
      "control": "select",
      "rules": {"required": true},
      "title": "来源",
      "entity": "platform_user",
      "props": {},
      "value": ""
    },
    "name": {
      "gid": "name",
      "field": "name",
      "isServerSaveIgnore": false,
      "control": "input",
      "rules": {"required": true},
      "title": "名称",
      "value": "",
      "entity": "platform_user",
      "props": {}
    },
    "description": {
      "gid": "description",
      "field": "description",
      "isServerSaveIgnore": false,
      "control": "textarea",
      "rules": {},
      "title": "描述",
      "value": "",
      "entity": "platform_user",
      "props": {}
    },
    "id": {
      "gid": "id",
      "field": "id",
      "value": "",
      "entity": "platform_user",
      "props": {}
    },
    "type": {
      "gid": "type",
      "data": [
        {"text": "员工账号", "value": "0"},
        {"text": "系统账号", "value": "1"},
        {"text": "企业外人员", "value": "2"}
      ],
      "field": "type",
      "isServerSaveIgnore": false,
      "control": "select",
      "rules": {"required": true},
      "title": "类型",
      "value": "",
      "entity": "platform_user",
      "props": {}
    }
  },
  "ds": {}
}
