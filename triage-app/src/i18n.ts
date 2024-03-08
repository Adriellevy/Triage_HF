import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import LoginForm_es from '../public/locales/es/LoginForm.json'
import LoginForm_en from '../public/locales/en/LoginForm.json'
import Sidebar_es from '../public/locales/es/Sidebar.json'
import Sidebar_en from '../public/locales/en/Sidebar.json'
import Search_es from '../public/locales/es/Search.json'
import Search_en from '../public/locales/en/Search.json'
import PatientList_es from '../public/locales/es/PatientList.json'
import PatientList_en from '../public/locales/en/PatientList.json'
import PatientHistory_es from '../public/locales/es/PatientHistory.json'
import PatientHistory_en from '../public/locales/en/PatientHistory.json'
import PatientForm_es from '../public/locales/es/PatientForm.json'
import PatientForm_en from '../public/locales/en/PatientForm.json'
import PatientDetail_es from '../public/locales/es/PatientDetail.json'
import PatientDetail_en from '../public/locales/en/PatientDetail.json'
import BoxList_es from '../public/locales/es/BoxList.json'
import BoxList_en from '../public/locales/en/BoxList.json'
import BoxItem_es from '../public/locales/es/BoxItem.json'
import BoxItem_en from '../public/locales/en/BoxItem.json'
import Boxes_es from '../public/locales/es/Boxes.json'
import Boxes_en from '../public/locales/en/Boxes.json'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    lng: 'es',
    debug: true,
    supportedLngs: ['en', 'es'],
    interpolation: {
      escapeValue: false
    },
    resources: {
      es: {
        LoginForm: LoginForm_es,
        Sidebar: Sidebar_es,
        Search: Search_es,
        PatientList: PatientList_es,
        PatientHistory: PatientHistory_es,
        PatientForm: PatientForm_es,
        PatientDetail: PatientDetail_es,
        BoxList: BoxList_es,
        BoxItem: BoxItem_es,
        Boxes: Boxes_es
      },
      en: {
        LoginForm: LoginForm_en,
        Sidebar: Sidebar_en,
        Search: Search_en,
        PatientList: PatientList_en,
        PatientHistory: PatientHistory_en,
        PatientForm: PatientForm_en,
        PatientDetail: PatientDetail_en,
        BoxList: BoxList_en,
        BoxItem: BoxItem_en,
        Boxes: Boxes_en
      }
    }
  })

export default i18n
