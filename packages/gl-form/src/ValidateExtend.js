/**
 *  扩展vee-validate的验证功能
 *  增加服务端唯一验证unique
 */
import {extend} from "vee-validate";
import utils from '../../utils/utils.js'

export default {
  install: function (Vue) {
    // console.log('Vue.$gl', Vue.prototype.$gl)
    // 扩展验证功能
    extend('unique', {
      async validate(value, args) {
        console.log('geelato-ui-ant > ValidateExtend > install() > validate unique > value：', value, 'args:', args)
        let found = false
        await Vue.prototype.$gl.api.queryByEntityDataReader(args.entityReader).then(function (result) {
          found = result.totalCount
          console.log('geelato-ui-ant > ValidateExtend > install() > validate unique > validate result：', result)
        })
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
   * @param entityId 规则所在表单主键字段
   * @return {*}
   */
  parseArg(ruleName, ruleArg, formProperty, pkField, pkValue) {
    return argsHandler[ruleName] ? argsHandler[ruleName](ruleArg, formProperty, pkField, pkValue) : ruleArg
  }
}

let argsHandler = {
  'unique': function (ruleArg, formProperty, pkField, pkValue) {
    let _params = []
    if (pkValue) {
      _params.push({name: pkField, cop: 'neq', value: pkValue})
    }
    _params.push({name: formProperty.field, cop: 'eq', value: '$ctx.' + formProperty.gid})
    if (ruleArg === true) {
      return {
        entityReader: {
          entity: formProperty.entity,
          fields: formProperty.field,
          params: _params
        }
      }
    } else if (ruleArg && ruleArg.params && ruleArg.params instanceof Array) {
      _params.push(...ruleArg.params)
      return {
        entityReader: {
          entity: formProperty.entity,
          fields: formProperty.field,
          params: _params
        }
      }
    }
    return ruleArg
  }
}
