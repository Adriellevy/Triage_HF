import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import LoginForm_es from './locales/es/LoginForm.json'
import LoginForm_en from './locales/en/LoginForm.json'
import Sidebar_es from './locales/es/Sidebar.json'
import Sidebar_en from './locales/en/Sidebar.json'
import Search_es from './locales/es/Search.json'
import Search_en from './locales/en/Search.json'
import PatientList_es from './locales/es/PatientList.json'
import PatientList_en from './locales/en/PatientList.json'
import PatientHistory_es from './locales/es/PatientHistory.json'
import PatientHistory_en from './locales/en/PatientHistory.json'
import PatientHistoryItem_es from './locales/es/PatientHistoryItem.json'
import PatientHistoryItem_en from './locales/en/PatientHistoryItem.json'
import PatientForm_es from './locales/es/PatientForm.json'
import PatientForm_en from './locales/en/PatientForm.json'
import PatientDetail_es from './locales/es/PatientDetail.json'
import PatientDetail_en from './locales/en/PatientDetail.json'
import PatientInform_es from './locales/es/PatientInform.json'
import PatientInform_en from './locales/en/PatientInform.json'
import BoxList_es from './locales/es/BoxList.json'
import BoxList_en from './locales/en/BoxList.json'
import BoxItem_es from './locales/es/BoxItem.json'
import BoxItem_en from './locales/en/BoxItem.json'
import Boxes_es from './locales/es/Boxes.json'
import Boxes_en from './locales/en/Boxes.json'
import WarningBox_es from './locales/es/WarningBox.json'
import WarningBox_en from './locales/en/WarningBox.json'
import BoxEditor_es from './locales/es/BoxEditor.json'
import BoxEditor_en from './locales/en/BoxEditor.json'
import UserItem_es from './locales/es/UserItem.json'
import UserItem_en from './locales/en/UserItem.json'
import VerifyUser_es from './locales/es/VerifyUser.json'
import VerifyUser_en from './locales/en/VerifyUser.json'
import TimeExpireModalAndErrors_es from './locales/es/TimeExpireModalAndErrors.json'
import TimeExpireModalAndErrors_en from './locales/en/TimeExpireModalAndErrors.json'
import symptomeditor_es from './locales/es/SymptomEditor.json'
import Symptomeditor_en from './locales/en/SymptomEditor.json'
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
        PatientHistoryItem: PatientHistoryItem_es,
        PatientForm: PatientForm_es,
        PatientDetail: PatientDetail_es,
        PatientInform: PatientInform_es,
        BoxList: BoxList_es,
        BoxItem: BoxItem_es,
        Boxes: Boxes_es,
        WarningBox: WarningBox_es,
        BoxEditor: BoxEditor_es,
        UserItem: UserItem_es,
        VerifyUser: VerifyUser_es,
        TimeExpireModalAndErrors: TimeExpireModalAndErrors_es,
        SymptomEditor: symptomeditor_es
      },
      en: {
        LoginForm: LoginForm_en,
        Sidebar: Sidebar_en,
        Search: Search_en,
        PatientList: PatientList_en,
        PatientHistory: PatientHistory_en,
        PatientHistoryItem: PatientHistoryItem_en,
        PatientForm: PatientForm_en,
        PatientDetail: PatientDetail_en,
        PatientInform: PatientInform_en,
        BoxList: BoxList_en,
        BoxItem: BoxItem_en,
        Boxes: Boxes_en,
        WarningBox: WarningBox_en,
        BoxEditor: BoxEditor_en,
        UserItem: UserItem_en,
        VerifyUser: VerifyUser_en,
        TimeExpireModalAndErrors: TimeExpireModalAndErrors_en,
        SymptomEditor: Symptomeditor_en
      }
    }
  })

export default i18n
