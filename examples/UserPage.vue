<template>
  <CrudProvider :config="crudConfig">
    <DictProvider :loader="dictLoader">
      <div class="user-page">
        <h1>User Management</h1>
        <CrudPage
          :schema="userSchema"
          :data-source="userDataSource"
          :toolbar-actions="toolbarActions"
          :row-actions="rowActions"
        />
      </div>
    </DictProvider>
  </CrudProvider>
</template>

<script setup lang="ts">
import { CrudProvider, DictProvider, CrudPage } from '../src'
import {
  createExportPlugin,
  createColumnPersistPlugin,
  createBatchActionsPlugin,
} from '../src/plugins'
import { userSchema } from './user-schema'
import { userDataSource } from './user-datasource'

// CRUD configuration with plugins
const crudConfig = {
  plugins: [
    createExportPlugin({
      filename: 'users',
      format: 'csv' as const,
    }),
    createColumnPersistPlugin({
      storageKey: 'user-table-columns',
    }),
    createBatchActionsPlugin({
      showBar: true,
    }),
  ],
  hooks: {
    afterLoad: (result: any) => {
      console.log('Loaded users:', result)
    },
    afterSave: (data: any) => {
      console.log('Saved user:', data)
    },
    afterRemove: (ids: any) => {
      console.log('Removed users:', ids)
    },
  },
  settings: {
    pageSize: 20,
    pagination: true,
    stripe: true,
    border: true,
  },
}

// Dictionary loader for dropdown options
const dictLoader = async (code: string) => {
  // Simulate loading from API
  await new Promise((resolve) => setTimeout(resolve, 200))

  const dictMap: Record<string, any[]> = {
    user_role: [
      { label: 'Admin', value: 'admin', color: 'danger' },
      { label: 'User', value: 'user', color: 'primary' },
      { label: 'Guest', value: 'guest', color: 'info' },
    ],
    user_status: [
      { label: 'Active', value: 1, color: 'success' },
      { label: 'Inactive', value: 0, color: 'info' },
    ],
  }

  return dictMap[code] || []
}

// Toolbar actions
const toolbarActions = [
  {
    key: 'add',
    label: 'Add User',
    type: 'primary' as const,
    icon: 'Plus',
    handler: (context: any) => {
      console.log('Add user action')
      // The CrudPage component will handle opening the form dialog
    },
  },
  {
    key: 'export',
    label: 'Export',
    type: 'default' as const,
    icon: 'Download',
    handler: async (context: any) => {
      console.log('Exporting users:', context.data)
      // Use export plugin
      if (context.data) {
        const plugin = context.getPlugin?.('export')
        if (plugin) {
          await plugin.exportData(context.data, ['id', 'username', 'email', 'role', 'status'])
        }
      }
    },
  },
  {
    key: 'refresh',
    label: 'Refresh',
    icon: 'Refresh',
    handler: (context: any) => {
      context.refresh?.()
    },
  },
]

// Row actions
const rowActions = [
  {
    key: 'edit',
    label: 'Edit',
    type: 'primary' as const,
    handler: (context: any) => {
      console.log('Edit user:', context.row)
      // The CrudPage component will handle opening the form dialog with row data
    },
  },
  {
    key: 'delete',
    label: 'Delete',
    type: 'danger' as const,
    confirm: true,
    confirmMessage: (context: any) => `Are you sure to delete user "${context.row.username}"?`,
    handler: async (context: any) => {
      console.log('Delete user:', context.row)
      // The CrudPage component will handle the deletion
      await context.refresh?.()
    },
  },
  {
    key: 'view',
    label: 'View',
    handler: (context: any) => {
      console.log('View user details:', context.row)
      // Custom view logic here
    },
  },
]
</script>

<style scoped>
.user-page {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}
</style>
