import { CrudSchema } from '../src/types/schema'

/**
 * User CRUD schema definition
 */
export const userSchema: CrudSchema = {
  // Search form configuration
  search: [
    {
      prop: 'username',
      label: 'Username',
      type: 'input',
      placeholder: 'Enter username',
    },
    {
      prop: 'email',
      label: 'Email',
      type: 'input',
      placeholder: 'Enter email',
    },
    {
      prop: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 },
      ],
    },
    {
      prop: 'createTime',
      label: 'Create Time',
      type: 'daterange',
    },
  ],

  // Table columns configuration
  table: [
    {
      prop: 'id',
      label: 'ID',
      width: 80,
      sortable: true,
    },
    {
      prop: 'username',
      label: 'Username',
      minWidth: 120,
    },
    {
      prop: 'email',
      label: 'Email',
      minWidth: 180,
    },
    {
      prop: 'role',
      label: 'Role',
      width: 120,
      type: 'dict',
      dictCode: 'user_role',
    },
    {
      prop: 'status',
      label: 'Status',
      width: 100,
      type: 'dict',
      dictCode: 'user_status',
    },
    {
      prop: 'createTime',
      label: 'Create Time',
      width: 180,
      sortable: true,
    },
  ],

  // Form configuration
  form: [
    {
      prop: 'username',
      label: 'Username',
      type: 'input',
      required: true,
      rules: [
        { required: true, message: 'Please enter username', trigger: 'blur' },
        { min: 3, max: 20, message: 'Length should be 3 to 20', trigger: 'blur' },
      ],
    },
    {
      prop: 'email',
      label: 'Email',
      type: 'input',
      required: true,
      rules: [
        { required: true, message: 'Please enter email', trigger: 'blur' },
        { type: 'email', message: 'Please enter valid email', trigger: 'blur' },
      ],
    },
    {
      prop: 'password',
      label: 'Password',
      type: 'input',
      required: true,
      props: {
        type: 'password',
        showPassword: true,
      },
    },
    {
      prop: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Guest', value: 'guest' },
      ],
    },
    {
      prop: 'status',
      label: 'Status',
      type: 'radio',
      defaultValue: 1,
      options: [
        { label: 'Active', value: 1 },
        { label: 'Inactive', value: 0 },
      ],
    },
    {
      prop: 'description',
      label: 'Description',
      type: 'textarea',
      props: {
        rows: 4,
      },
    },
  ],
}
