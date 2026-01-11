<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      @submit.prevent="handleSubmit"
    >
      <el-form-item
        v-for="field in schema"
        :key="field.prop"
        :label="field.label"
        :prop="field.prop"
        :required="field.required"
      >
        <template v-if="field.render">
          <component
            :is="field.render"
            :field="field"
            :model-value="formData[field.prop]"
            @change="(val: any) => handleFieldChange(field.prop, val)"
          />
        </template>
        <template v-else>
          <dict-select
            v-if="field.type === 'dict-select' || field.dictCode"
            v-model="formData[field.prop]"
            :dict-code="field.dictCode"
            :options="field.options"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :multiple="field.multiple"
            @change="handleFieldChange(field.prop, $event)"
          />
          <el-select
            v-else-if="field.type === 'select'"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :multiple="field.multiple"
            clearable
            @change="handleFieldChange(field.prop, $event)"
          >
            <el-option
              v-for="opt in field.options"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <el-input-number
            v-else-if="field.type === 'number'"
            v-model="formData[field.prop]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            :min="field.min"
            :max="field.max"
            :step="field.step"
            @change="handleFieldChange(field.prop, $event)"
          />
          <el-date-picker
            v-else-if="field.type === 'date'"
            v-model="formData[field.prop]"
            type="date"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            @change="handleFieldChange(field.prop, $event)"
          />
          <el-date-picker
            v-else-if="field.type === 'datetime'"
            v-model="formData[field.prop]"
            type="datetime"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            @change="handleFieldChange(field.prop, $event)"
          />
          <el-switch
            v-else-if="field.type === 'switch'"
            v-model="formData[field.prop]"
            :disabled="field.disabled"
            @change="handleFieldChange(field.prop, $event)"
          />
          <el-input
            v-else-if="field.type === 'textarea'"
            v-model="formData[field.prop]"
            type="textarea"
            :rows="4"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            @change="handleFieldChange(field.prop, $event)"
          />
          <sub-form
            v-else-if="field.type === 'subform'"
            v-model="formData[field.prop]"
            :fields="field.childFields"
            @change="handleFieldChange(field.prop, $event)"
          />
          <key-value-editor
            v-else-if="field.type === 'keyvalue'"
            v-model="formData[field.prop]"
            @change="handleFieldChange(field.prop, $event)"
          />
          <upload-stub
            v-else-if="field.type === 'upload'"
            v-model="formData[field.prop]"
            @change="handleFieldChange(field.prop, $event)"
          />
          <el-input
            v-else
            v-model="formData[field.prop]"
            :placeholder="field.placeholder"
            :disabled="field.disabled"
            @change="handleFieldChange(field.prop, $event)"
          />
        </template>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Submit</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElSwitch,
  ElButton
} from 'element-plus'
import DictSelect from './common/DictSelect.vue'
import SubForm from './common/SubForm.vue'
import KeyValueEditor from './common/KeyValueEditor.vue'
import UploadStub from './common/Upload.vue'
import type { FormFieldSchema } from '../types'

interface Props {
  modelValue: boolean
  schema: FormFieldSchema[]
  title?: string
  width?: string | number
  data?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Form',
  width: '600px'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: Record<string, any>): void
  (e: 'cancel'): void
  (e: 'validate', valid: boolean): void
  (e: 'field-change', field: string, value: any): void
}>()

const formRef = ref()
const dialogVisible = ref(props.modelValue)
const formData = reactive<Record<string, any>>({})

watch(
  () => props.modelValue,
  (val) => {
    dialogVisible.value = val
    if (val) {
      initFormData()
    }
  }
)

watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

const formRules = computed(() => {
  const rules: Record<string, any[]> = {}
  props.schema.forEach((field) => {
    if (field.required) {
      rules[field.prop] = [
        { required: true, message: `${field.label} is required`, trigger: 'blur' }
      ]
    }
    if (field.rules) {
      rules[field.prop] = [...(rules[field.prop] || []), ...field.rules]
    }
  })
  return rules
})

const initFormData = () => {
  props.schema.forEach((field) => {
    if (props.data && field.prop in props.data) {
      formData[field.prop] = props.data[field.prop]
    } else {
      formData[field.prop] = field.defaultValue || null
    }
  })
}

const handleFieldChange = (field: string, value: any) => {
  emit('field-change', field, value)
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    emit('validate', valid)
    if (valid) {
      emit('submit', { ...formData })
      dialogVisible.value = false
    }
  } catch (error) {
    emit('validate', false)
  }
}

const handleCancel = () => {
  emit('cancel')
  dialogVisible.value = false
}

const handleClose = () => {
  formRef.value?.resetFields()
  emit('cancel')
}
</script>
