# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-01-10

### Added

- Initial release of vectra-crud library
- Core architecture with UI abstraction layer (Element Plus as default adapter)
- Schema-driven components:
  - `CrudPage` - Complete CRUD page composition
  - `SchemaSearch` - Search form component
  - `SchemaTable` - Table component with custom rendering
  - `SchemaForm` - Form component with validation
- Provider components:
  - `CrudProvider` - Context provider with plugin system and lifecycle hooks
  - `DictProvider` - Dictionary data provider with caching
- Common components:
  - `DictTag` - Dictionary tag display
  - `KVEditor` - Key-value array editor
  - `SubForm` - Nested form array (add/remove rows)
  - `UploadField` - File upload wrapper (stub)
- Composables (hooks):
  - `useCrud` - Access CRUD context and manage plugins
  - `useDict` - Dictionary management with caching
  - `usePermission` - Permission checking for actions/columns
  - `useAction` - Action runner with lifecycle management
- Built-in plugins:
  - Column Persist - Save column state to localStorage
  - Export - Basic export functionality (CSV/JSON)
  - Inline Edit - Enable inline editing in tables
  - Row Expand - Row expansion support
  - Virtual Scroll - Configuration for virtual scrolling
  - Batch Actions - Batch operations on selected rows
- TypeScript support with full type definitions
- Vite build configuration (ES/CJS + d.ts)
- ESLint and Prettier configuration
- Vitest testing setup
- Comprehensive documentation and examples
- Basic utility functions

### Features

- Adapter-driven UI architecture for multi-library support
- Plugin system for extensibility
- Lifecycle hooks (before/after load, save, remove, error handling)
- Data source abstraction for easy backend integration
- Permission-based action control
- Customizable rendering via slots and render functions
- Stub implementations ready for real API integration

### Documentation

- Complete README with features, usage examples, and architecture overview
- Example user management page with schema and data source
- TODO list for future enhancements
- Contributing guidelines

[0.1.0]: https://github.com/kowyzhux/vectra-crud/releases/tag/v0.1.0
