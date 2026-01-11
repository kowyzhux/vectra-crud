import { describe, it, expect } from 'vitest'
import { createMockDataSource } from '../core/data-source'

describe('Data Source', () => {
  it('should create a mock data source', () => {
    const data = [
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' }
    ]
    const dataSource = createMockDataSource(data)
    
    expect(dataSource).toBeDefined()
    expect(dataSource.list).toBeDefined()
    expect(dataSource.save).toBeDefined()
    expect(dataSource.remove).toBeDefined()
  })

  it('should list data with pagination', async () => {
    const data = [
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' },
      { id: 3, name: 'Test 3' }
    ]
    const dataSource = createMockDataSource(data)
    
    const result = await dataSource.list({
      pagination: { page: 1, pageSize: 2 }
    })
    
    expect(result.data.length).toBe(2)
    expect(result.total).toBe(3)
  })

  it('should filter data', async () => {
    const data = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'Bob' }
    ]
    const dataSource = createMockDataSource(data)
    
    const result = await dataSource.list({
      filters: { name: 'Jo' }
    })
    
    expect(result.data.length).toBe(1)
    expect(result.data[0].name).toBe('John')
  })

  it('should save new item', async () => {
    const data: any[] = []
    const dataSource = createMockDataSource(data)
    
    const newItem = { id: 1, name: 'New Item' }
    await dataSource.save(newItem)
    
    const result = await dataSource.list({})
    expect(result.data.length).toBe(1)
    expect(result.data[0].name).toBe('New Item')
  })

  it('should remove item', async () => {
    const data = [
      { id: 1, name: 'Test 1' },
      { id: 2, name: 'Test 2' }
    ]
    const dataSource = createMockDataSource(data)
    
    await dataSource.remove(1)
    
    const result = await dataSource.list({})
    expect(result.data.length).toBe(1)
    expect(result.data[0].id).toBe(2)
  })
})
