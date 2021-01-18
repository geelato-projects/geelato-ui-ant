import utils from './utils/utils.js'

export default class Action {
  constructor({gid, text, fn, params, ctx, then, dataMapping, type, show, icon}) {
    this.gid = gid || utils.uuid(16)
    this.text = text
    this.type = type
    this.fn = fn
    this.show = show
    this.icon = icon
    this.ctx = ctx
    this.params = params
    // then是一个action对象
    this.then = then
    this.dataMapping = dataMapping
  }
}
