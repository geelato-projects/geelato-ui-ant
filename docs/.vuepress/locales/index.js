import Vue from 'vue'
import moment from 'moment'
import storage from 'store'
import VueI18n from 'vue-i18n'
import zhCN from './lang/zh-CN'

Vue.use(VueI18n)


const DEFAULT_LANG = 'zh-CN'
const LOCALE_KEY = 'lang'
const loadedLanguages = [DEFAULT_LANG]

const messages = {
  'zh-CN': {
    ...zhCN
  }
}

const i18n = new VueI18n({
  silentTranslationWarn: true,
  locale: storage.get(LOCALE_KEY) || DEFAULT_LANG,
  fallbackLocale: DEFAULT_LANG,
  messages: messages,
})
// 增加tproxy的方法，简化无多语言配置，支持默认值
i18n.tproxy = function (key, defaultValue) {
  // te(key) 过滤掉无key的情况
  if (key && this.te(key)) {
    console.log('VueI18n.prototype.tproxy:', key, defaultValue)
    return this.t(key)
  } else {
    return defaultValue
  }
}

export const setI18nLanguage = lang => {
  if (lang === undefined) {
    lang = storage.get(LOCALE_KEY)
    if (messages[lang] === undefined) {
      lang = DEFAULT_LANG
    }
  }

  i18n.locale = lang
  Vue.config.lang = lang

  storage.set(LOCALE_KEY, lang)

  document.querySelector('html').setAttribute('lang', lang)

  Object.keys(messages).forEach(lang => {
    document.body.classList.remove(`lang-${lang}`)
  })
  document.body.classList.add(`lang-${lang}`)
  document.body.setAttribute('lang', lang)

}

export function loadLanguageAsync(lang = DEFAULT_LANG) {
  return new Promise(resolve => {
    // 缓存语言设置
    storage.set(LOCALE_KEY, lang)
    if (i18n.locale !== lang) {
      if (!loadedLanguages.includes(lang)) {
        return import(/* webpackChunkName: "lang-[request]" */ `./lang/${lang}`).then(msg => {
          const locale = msg.default
          // i18n.setLocaleMessage(lang, locale)
          i18n.mergeLocaleMessage(lang, locale)
          loadedLanguages.push(lang)
          moment.updateLocale(locale.momentName, locale.momentLocale)
          return setI18nLanguage(lang)
        })
      }
      return resolve(setI18nLanguage(lang))
    }
    return resolve(lang)
  })
}

export function i18nRender (key) {
  return i18n.t(`${key}`)
}

i18n.setI18nLanguage = setI18nLanguage

window.$i18n = i18n;
export default i18n
