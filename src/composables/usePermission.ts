import { inject, InjectionKey, provide } from 'vue'

/**
 * Permission checker function type
 */
export type PermissionChecker = (permission: string | string[]) => boolean

/**
 * Permission context
 */
export interface PermissionContext {
  // Check if user has permission
  hasPermission: PermissionChecker
  // User permissions
  permissions: string[]
}

/**
 * Permission context key
 */
export const PermissionContextKey: InjectionKey<PermissionContext> = Symbol('PermissionContext')

/**
 * Create permission context
 */
export function createPermissionContext(
  permissions: string[] = [],
  checker?: PermissionChecker
): PermissionContext {
  const defaultChecker: PermissionChecker = (permission: string | string[]) => {
    if (Array.isArray(permission)) {
      return permission.some((p) => permissions.includes(p))
    }
    return permissions.includes(permission)
  }

  return {
    hasPermission: checker || defaultChecker,
    permissions,
  }
}

/**
 * Provide permission context
 */
export function providePermissionContext(permissions: string[] = [], checker?: PermissionChecker) {
  const context = createPermissionContext(permissions, checker)
  provide(PermissionContextKey, context)
  return context
}

/**
 * Use permission hook
 */
export function usePermission() {
  const context = inject(PermissionContextKey)

  // If no context provided, create a permissive default
  const hasPermission: PermissionChecker = context ? context.hasPermission : () => true

  return {
    // Check if user has permission
    hasPermission,
    // Check if user has all permissions
    hasAllPermissions: (permissions: string[]) => {
      return permissions.every((p) => hasPermission(p))
    },
    // Check if user has any permission
    hasAnyPermission: (permissions: string[]) => {
      return permissions.some((p) => hasPermission(p))
    },
  }
}
