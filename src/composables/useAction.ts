import { ref } from 'vue'
import { ActionConfig, ActionContext } from '@/types/action'
import { useAdapter } from '@/adapters'

/**
 * Action runner hook
 */
export function useAction() {
  const adapter = useAdapter()
  const loading = ref(false)

  /**
   * Execute an action with lifecycle and error handling
   */
  async function runAction(action: ActionConfig, context: ActionContext) {
    // Check hidden condition
    if (typeof action.hidden === 'function' && action.hidden(context)) {
      return
    }
    if (typeof action.hidden === 'boolean' && action.hidden) {
      return
    }

    // Check disabled condition
    if (typeof action.disabled === 'function' && action.disabled(context)) {
      adapter.showMessage('该操作已禁用', 'warning')
      return
    }
    if (typeof action.disabled === 'boolean' && action.disabled) {
      adapter.showMessage('该操作已禁用', 'warning')
      return
    }

    // Show confirmation if needed
    if (action.confirm) {
      const shouldConfirm =
        typeof action.confirm === 'function' ? action.confirm(context) : action.confirm
      if (shouldConfirm) {
        const message =
          typeof action.confirmMessage === 'function'
            ? action.confirmMessage(context)
            : action.confirmMessage || '确认执行此操作？'
        const confirmed = await adapter.confirm(message)
        if (!confirmed) {
          return
        }
      }
    }

    try {
      loading.value = true

      // Execute before hook
      if (action.before) {
        const shouldContinue = await action.before(context)
        if (shouldContinue === false) {
          return
        }
      }

      // Execute action handler
      await action.handler(context)

      // Execute after hook
      if (action.after) {
        await action.after(context)
      }

      adapter.showMessage('操作成功', 'success')
    } catch (error) {
      console.error('Action execution error:', error)
      adapter.showMessage(error instanceof Error ? error.message : '操作失败', 'error')
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    runAction,
  }
}
