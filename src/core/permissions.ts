import { inject, provide, type InjectionKey } from 'vue'
import type { PermissionChecker, PermissionConfig } from '../types'

export const PERMISSION_KEY: InjectionKey<PermissionChecker> = Symbol('permission-checker')

export function providePermission(config: PermissionConfig) {
  provide(PERMISSION_KEY, config.checker)
  return config.checker
}

export function usePermission() {
  const checker = inject(PERMISSION_KEY, undefined)

  const hasPermission = async (
    permission: string | string[],
    context?: any
  ): Promise<boolean> => {
    if (!checker) {
      return true
    }

    if (Array.isArray(permission)) {
      const results = await Promise.all(
        permission.map((p) => Promise.resolve(checker(p, context)))
      )
      return results.every((result) => result === true)
    }

    return Promise.resolve(checker(permission, context))
  }

  const hasAnyPermission = async (
    permissions: string[],
    context?: any
  ): Promise<boolean> => {
    if (!checker) {
      return true
    }

    const results = await Promise.all(
      permissions.map((p) => Promise.resolve(checker(p, context)))
    )
    return results.some((result) => result === true)
  }

  return {
    hasPermission,
    hasAnyPermission
  }
}
