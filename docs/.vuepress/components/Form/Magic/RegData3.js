export default {
  "bind": {
    "opts": {
      "type": "object",
      "defaultEntity": "platform_role_r_user",
      "state": "save",
      "properties": {
        "id": {
          "gid": "id",
          "props": {},
          "entity": "platform_role_r_user",
          "field": "id",
          "value": ""
        },
        "name": {
          "control": "input",
          "title": "用户ID",
          "gid": "name",
          "props": {},
          "entity": "platform_role_r_user",
          "field": "userId",
          "value": "",
          "rules": {},
          "isServerSaveIgnore": false,
          "ds": ""
        },
        "type": {
          "control": "select",
          "title": "角色",
          "data": [
            {"text": "默认", "value": "0"},
            {"text": "类型一", "value": "1"},
            {"text": "类型二", "value": "2"}
          ],
          "props": {},
          "gid": "type",
          "entity": "platform_role_r_user",
          "field": "roleId",
          "value": "",
          "rules": {},
          "isServerSaveIgnore": false,
          "dsName": "uAamWjDG"
        }
      },
      "layout": {
        "type": "table",
        "rows": [
          {
            "cols": [
              {"span": 4, "label": true, "field": "name"},
              {"span": 20, "field": "name"}
            ]
          },
          {
            "cols": [
              {"span": 4, "label": true, "field": "type"},
              {"span": 20, "field": "type"}
            ]
          }
        ],
        "hidden": {}
      },
      "toolbar": {
        "show": true,
        "actions": [
          {
            "text": "保存",
            "type": "primary",
            "fn": "save",
            "show": "true",
            "icon": "",
            "ctx": "self",
            "gid": "HI2IdlaQ"
          }
        ],
        "gid": "RZ1OCSHs"
      },
      "ds": {
        "uAamWjDG": {
          "entity": "platform_role",
          "lazy": false,
          "fields": "name,id",
          "resultMapping": {"text": "name", "value": "id"},
          "params": {},
          "description": "这是一个下拉列表数据源，带参数"
        }
      },
      "vars": {},
      "watch": {}
    },
    "params": {}
  }
}
