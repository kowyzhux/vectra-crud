import { describe, it, expect } from 'vitest'
import { deepClone, formatDate } from '../src/utils'

describe('Utils', () => {
  describe('deepClone', () => {
    it('should clone an object', () => {
      const obj = { a: 1, b: { c: 2 } }
      const cloned = deepClone(obj)
      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj)
      expect(cloned.b).not.toBe(obj.b)
    })
  })

  describe('formatDate', () => {
    it('should format date', () => {
      const date = new Date('2024-01-15 10:30:45')
      const formatted = formatDate(date)
      expect(formatted).toBe('2024-01-15 10:30:45')
    })

    it('should format date with custom format', () => {
      const date = new Date('2024-01-15 10:30:45')
      const formatted = formatDate(date, 'YYYY-MM-DD')
      expect(formatted).toBe('2024-01-15')
    })
  })
})
