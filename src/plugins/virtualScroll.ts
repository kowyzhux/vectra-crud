import { CrudPlugin, VirtualScrollOptions } from '@/types/plugin'

/**
 * Virtual scroll plugin - enable virtual scrolling for large datasets
 */
export function createVirtualScrollPlugin(options: VirtualScrollOptions = {}): CrudPlugin {
  const { enabled = false, itemHeight = 48, buffer = 5 } = options

  return {
    name: 'virtual-scroll',
    options: {
      enabled,
      itemHeight,
      buffer,
    },

    install(context: any) {
      // Calculate visible range based on scroll position
      const calculateVisibleRange = (
        scrollTop: number,
        containerHeight: number,
        totalItems: number
      ) => {
        const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
        const visibleCount = Math.ceil(containerHeight / itemHeight) + buffer * 2
        const endIndex = Math.min(totalItems, startIndex + visibleCount)

        return {
          startIndex,
          endIndex,
          offsetY: startIndex * itemHeight,
          totalHeight: totalItems * itemHeight,
        }
      }

      // Get visible data slice
      const getVisibleData = (data: any[], startIndex: number, endIndex: number) => {
        return data.slice(startIndex, endIndex)
      }

      // Expose methods
      context.virtualScroll = {
        enabled,
        itemHeight,
        buffer,
        calculateVisibleRange,
        getVisibleData,
      }
    },
  }
}
