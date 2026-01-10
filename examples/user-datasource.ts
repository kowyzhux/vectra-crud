import { IDataSource, ListParams, ListResult } from '../src/types/datasource'

/**
 * Mock user data
 */
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    status: 1,
    createTime: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    role: 'user',
    status: 1,
    createTime: '2024-01-02 10:00:00',
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    role: 'user',
    status: 0,
    createTime: '2024-01-03 10:00:00',
  },
  {
    id: 4,
    username: 'guest1',
    email: 'guest1@example.com',
    role: 'guest',
    status: 1,
    createTime: '2024-01-04 10:00:00',
  },
]

/**
 * User data source implementation (stub with mock data)
 */
export const userDataSource: IDataSource = {
  /**
   * Load user list with pagination and filters
   */
  async list(params: ListParams): Promise<ListResult> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Filter data based on search params
    let filteredData = [...mockUsers]

    if (params.username) {
      filteredData = filteredData.filter((user) =>
        user.username.toLowerCase().includes(params.username.toLowerCase())
      )
    }

    if (params.email) {
      filteredData = filteredData.filter((user) =>
        user.email.toLowerCase().includes(params.email.toLowerCase())
      )
    }

    if (params.status !== undefined && params.status !== '') {
      filteredData = filteredData.filter((user) => user.status === params.status)
    }

    // Pagination
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = filteredData.slice(start, end)

    return {
      data: paginatedData,
      total: filteredData.length,
      page,
      pageSize,
    }
  },

  /**
   * Save (create or update) user
   */
  async save(data: any) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    console.log('Saving user:', data)

    if (data.id) {
      // Update existing user
      const index = mockUsers.findIndex((u) => u.id === data.id)
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...data }
        return mockUsers[index]
      }
    } else {
      // Create new user
      const newUser = {
        id: Math.max(...mockUsers.map((u) => u.id)) + 1,
        ...data,
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }
      mockUsers.push(newUser)
      return newUser
    }

    return data
  },

  /**
   * Remove user(s)
   */
  async remove(ids: string | number | Array<string | number>) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const idsArray = Array.isArray(ids) ? ids : [ids]
    console.log('Removing users:', idsArray)

    idsArray.forEach((id) => {
      const index = mockUsers.findIndex((u) => u.id === id)
      if (index !== -1) {
        mockUsers.splice(index, 1)
      }
    })
  },

  /**
   * Export users (stub)
   */
  async export(params: ListParams): Promise<Blob> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const result = await this.list(params)
    const csv = [
      'ID,Username,Email,Role,Status,Create Time',
      ...result.data.map(
        (user: any) =>
          `${user.id},${user.username},${user.email},${user.role},${user.status},${user.createTime}`
      ),
    ].join('\n')

    return new Blob([csv], { type: 'text/csv' })
  },
}
