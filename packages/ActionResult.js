export default class ActionResult {
  constructor({fn, code, message, data}) {
    this.fn = fn
    this.code = code
    this.message = message
    this.data = data
  }

  isSuccess() {
    return this.code === 0 || this.code === '0'
  }
}
