import {
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElCheckbox,
  ElCheckboxGroup,
  ElDatePicker,
  ElSwitch,
  ElUpload,
  ElTable,
  ElTableColumn,
  ElRow,
  ElCol,
  ElCard,
  ElDialog,
  ElButton,
  ElTag,
  ElPagination,
  ElLoading,
  ElMessage,
  ElMessageBox,
} from 'element-plus'
import { IUiAdapter } from '@/types/adapter'

/**
 * Element Plus adapter implementation
 */
export const elementPlusAdapter: IUiAdapter = {
  name: 'element-plus',

  form: {
    Form: ElForm,
    FormItem: ElFormItem,
    Input: ElInput,
    InputNumber: ElInputNumber,
    Select: ElSelect,
    Option: ElOption,
    Radio: ElRadio,
    RadioGroup: ElRadioGroup,
    Checkbox: ElCheckbox,
    CheckboxGroup: ElCheckboxGroup,
    DatePicker: ElDatePicker,
    Switch: ElSwitch,
    Upload: ElUpload,
  },

  table: {
    Table: ElTable,
    TableColumn: ElTableColumn,
  },

  layout: {
    Row: ElRow,
    Col: ElCol,
    Card: ElCard,
    Dialog: ElDialog,
  },

  feedback: {
    Button: ElButton,
    Tag: ElTag,
    Loading: ElLoading,
    Message: ElMessage,
    MessageBox: ElMessageBox,
  },

  pagination: {
    Pagination: ElPagination,
  },

  showMessage(message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') {
    ElMessage({
      message,
      type,
    })
  },

  showLoading(target?: any) {
    return ElLoading.service({
      target: target || document.body,
    })
  },

  hideLoading(instance: any) {
    instance?.close()
  },

  async confirm(message: string, title = '确认', options: any = {}) {
    try {
      await ElMessageBox.confirm(message, title, {
        type: 'warning',
        ...options,
      })
      return true
    } catch {
      return false
    }
  },
}
