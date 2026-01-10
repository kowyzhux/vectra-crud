import {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElDatePicker,
  ElSwitch,
  ElRadio,
  ElCheckbox,
  ElButton,
  ElDialog,
  ElDrawer,
  ElForm,
  ElFormItem,
  ElTable,
  ElPagination,
  ElTag,
  ElUpload
} from 'element-plus'
import type { UIAdapter } from '../types'

export const elementPlusAdapter: UIAdapter = {
  components: {
    input: ElInput,
    textarea: ElInput,
    number: ElInputNumber,
    select: ElSelect,
    date: ElDatePicker,
    datetime: ElDatePicker,
    switch: ElSwitch,
    radio: ElRadio,
    checkbox: ElCheckbox,
    button: ElButton,
    dialog: ElDialog,
    drawer: ElDrawer,
    form: ElForm,
    formItem: ElFormItem,
    table: ElTable,
    pagination: ElPagination,
    tag: ElTag,
    upload: ElUpload
  },
  formItemProp: 'prop',
  formItemLabel: 'label'
}
