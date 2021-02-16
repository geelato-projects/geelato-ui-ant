import Vue from 'vue'
import VueI18n from 'vue-i18n'

// 增加tproxy的方法，简化无多语言配置，支持默认值
VueI18n.prototype.tproxy = function (key, defaultValue) {
  // te(key) 过滤掉无key的情况
  if (key && this.te(key)) {
    console.log('VueI18n.prototype.tproxy:', key, defaultValue)
    return this.t(key)
  } else {
    return defaultValue
  }
}

Vue.use(VueI18n)


const DEFAULT_LANG = 'zh'
const LOCALE_KEY = 'localeLanguage'

const locales = {
  zh: require('./zh.json'),
  en: require('./en.json'),
}

const i18n = new VueI18n({
  locale: DEFAULT_LANG,
  messages: locales,
})

export const setup = lang => {
  if (lang === undefined) {
    lang = window.localStorage.getItem(LOCALE_KEY)
    if (locales[lang] === undefined) {
      lang = DEFAULT_LANG
    }
  }
  window.localStorage.setItem(LOCALE_KEY, lang)

  Object.keys(locales).forEach(lang => {
    document.body.classList.remove(`lang-${lang}`)
  })
  document.body.classList.add(`lang-${lang}`)
  document.body.setAttribute('lang', lang)

  Vue.config.lang = lang
  i18n.locale = lang
}
setup("zh")
window.$i18n = i18n;
export default i18n
