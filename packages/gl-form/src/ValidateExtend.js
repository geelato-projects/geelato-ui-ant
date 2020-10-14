import {extend} from "vee-validate";
import utils from '../../utils.js'

export default {
  install: function (Vue) {
    console.log('Vue.$gl', Vue.prototype.$gl)
    // 扩展验证功能
    extend('unique', {
      async validate(value, args, xx) {
        console.log('validate unique > value：', value, xx)
        let found = false
        await Vue.prototype.$gl.api.queryByEntityDataReader(args.entityReader).then(function (result) {
          found = result.totalCount
          console.log('validate unique > then > result：', result)
        })
        console.log('validate unique > args: ', args)
        return found ? false : true
      },
      params: ['entityReader'],
      message: `{_field_}不能重复`
    });
  },

  /**
   *
   * @param ruleName 规则名称:string
   * @param ruleArg  规则参数:any
   * @param formProperty 规则所在表单字段信息
   * @return {*}
   */
  parseArg(ruleName, ruleArg, formProperty) {
    return argsHandler[ruleName] ? argsHandler[ruleName](ruleArg, formProperty) : ruleArg
  }
}

let argsHandler = {
  'unique': function (ruleArg, formProperty) {
    if (ruleArg === true) {
      return {
        entityReader: {
          entity: formProperty.entity,
          fields: formProperty.field,
          params: [{name: formProperty.field, cop: 'eq', value: '$ctx.' + formProperty.field}]
        }
      }
    }
    return ruleArg
  }
}
