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
        console.log('geelato-ant-ui > ValidateExtend > install() > validate unique > value：', value, 'args:', args)
        let found = false
        await Vue.prototype.$gl.api.queryByEntityDataReader(args.entityReader).then(function (result) {
          found = result.totalCount
          console.log('geelato-ant-ui > ValidateExtend > install() > validate unique > validate result：', result)
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
   * @return {*}
   */
  parseArg(ruleName, ruleArg, formProperty, entityId) {
    return argsHandler[ruleName] ? argsHandler[ruleName](ruleArg, formProperty, entityId) : ruleArg
  }
}

let argsHandler = {
  'unique': function (ruleArg, formProperty, entityId) {
    let _params = []
    if (entityId) {
      _params.push({name: 'id', cop: 'neq', value: '$ctx.id'})
    }
    _params.push({name: formProperty.field, cop: 'eq', value: '$ctx.' + formProperty.field})
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
