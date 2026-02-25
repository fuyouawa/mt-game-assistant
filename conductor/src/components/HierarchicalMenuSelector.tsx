import { memo, useState, useMemo, useCallback, useEffect, useRef } from 'react'

interface MenuItem {
  id: number
  name: string
  path: string[]
}

interface HierarchicalMenuSelectorProps {
  items: MenuItem[]
  value: number | null
  onChange: (value: number | null) => void
  placeholder?: string
  style?: React.CSSProperties
}

// 树节点接口
interface TreeNode {
  name: string
  children: Map<string, TreeNode>
  item: MenuItem | null
  hasChildren: boolean
}

/**
 * 层级菜单选择器组件
 * 用于从具有层级结构的数据中选择项（如"主页/家园/交易所"）
 *
 * 设计理念：
 * - 每个选项左侧显示文本，右侧显示箭头按钮
 * - 点击文本区域：选择该项（如果有对应的 item）
 * - 点击箭头按钮：展开下一级菜单
 * - 这样既可以是选项，也可以是父级菜单
 */
const HierarchicalMenuSelector = memo(({
  items,
  value,
  onChange,
  placeholder = '请选择',
  style
}: HierarchicalMenuSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPath, setSelectedPath] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // 构建层级结构树
  const tree = useMemo(() => {
    const root: Map<string, TreeNode> = new Map()

    items.forEach(item => {
      const path = item.path
      let current = root

      path.forEach((segment, index) => {
        if (!current.has(segment)) {
          const newNode: TreeNode = {
            name: segment,
            children: new Map(),
            item: null,
            hasChildren: false
          }
          current.set(segment, newNode)
        }
        const node = current.get(segment)
        if (node) {
          // 如果是路径的最后一项，设置 item
          if (index === path.length - 1) {
            node.item = item
          }

          // 如果不是最后一项，标记为有子节点
          if (index < path.length - 1) {
            node.hasChildren = true
          }

          current = node.children
        }
      })
    })

    return root
  }, [items])

  // 获取当前选中项的完整路径
  const selectedItemPath = useMemo(() => {
    if (!value) return []
    const item = items.find(i => i.id === value)
    return item?.path || []
  }, [value, items])

  // 初始化选中路径
  useEffect(() => {
    if (selectedItemPath.length > 0) {
      setSelectedPath(selectedItemPath)
    }
  }, [selectedItemPath])

  // 根据当前路径获取可用的子选项
  const getAvailableOptions = useCallback(() => {
    if (selectedPath.length === 0) {
      // 第一级：显示顶层菜单
      return Array.from(tree.entries()).map(([name, node]) => ({
        name,
        hasItem: node.item !== null,
        hasChildren: node.hasChildren || node.children.size > 0,
        path: [name]
      }))
    }

    // 根据当前路径导航到对应节点
    let current = tree
    for (const segment of selectedPath) {
      if (current.has(segment)) {
        const node = current.get(segment)
        if (node) {
          current = node.children
        } else {
          return []
        }
      } else {
        return []
      }
    }

    return Array.from(current.entries()).map(([name, node]) => ({
      name,
      hasItem: node.item !== null,
      hasChildren: node.hasChildren || node.children.size > 0,
      path: [...selectedPath, name]
    }))
  }, [tree, selectedPath])

  // 获取显示的路径文本
  const getDisplayPath = useCallback(() => {
    if (selectedPath.length === 0) return placeholder
    return selectedPath.join(' / ')
  }, [selectedPath, placeholder])

  // 选择选项
  const handleSelectOption = useCallback((option: { name: string; hasItem: boolean; hasChildren: boolean; path: string[] }) => {
    // 只有点击有 item 的选项才进行选择
    if (option.hasItem) {
      const item = items.find(i => i.path.join('/') === option.path.join('/'))
      if (item) {
        onChange(item.id)
        setSelectedPath(option.path)
        setIsOpen(false)
      }
    }
  }, [items, onChange])

  // 展开下一级菜单
  const handleExpandOption = useCallback((option: { name: string; hasItem: boolean; hasChildren: boolean; path: string[] }, e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    if (option.hasChildren) {
      setSelectedPath(option.path)
    }
  }, [])

  // 点击面包屑导航
  const handleBreadcrumbClick = useCallback((index: number) => {
    setSelectedPath(prev => prev.slice(0, index + 1))
  }, [])

  // 重置选择
  const handleReset = useCallback(() => {
    setSelectedPath([])
    onChange(null)
  }, [onChange])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const availableOptions = getAvailableOptions()

  return (
    <div ref={containerRef} style={{ position: 'relative', ...style }}>
      {/* 触发按钮 */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '6px 8px',
          borderRadius: '4px',
          border: '1px solid #4b5563',
          backgroundColor: '#1f2937',
          color: selectedPath.length > 0 ? '#fff' : '#6b7280',
          fontSize: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {getDisplayPath()}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {selectedPath.length > 0 && (
            <span
              onClick={(e) => {
                e.stopPropagation()
                handleReset()
              }}
              style={{
                color: '#9ca3af',
                fontSize: '14px',
                cursor: 'pointer',
                padding: '0 4px',
              }}
              title="清除选择"
            >
              ×
            </span>
          )}
          <span style={{ color: '#9ca3af', fontSize: '10px' }}>
            {isOpen ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* 下拉面板 */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563',
            borderRadius: '4px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            maxHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 面包屑导航 */}
          {selectedPath.length > 0 && (
            <div
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid #374151',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                alignItems: 'center',
              }}
            >
              <span
                onClick={() => setSelectedPath([])}
                style={{
                  fontSize: '11px',
                  color: '#60a5fa',
                  cursor: 'pointer',
                  padding: '2px 6px',
                  borderRadius: '3px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                根目录
              </span>
              {selectedPath.map((segment, index) => (
                <span key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#6b7280', fontSize: '10px' }}>›</span>
                  <span
                    onClick={() => handleBreadcrumbClick(index)}
                    style={{
                      fontSize: '11px',
                      color: '#60a5fa',
                      cursor: 'pointer',
                      padding: '2px 6px',
                      borderRadius: '3px',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {segment}
                  </span>
                </span>
              ))}
            </div>
          )}

          {/* 选项列表 */}
          <div style={{ overflowY: 'auto', maxHeight: '240px', padding: '4px 0' }}>
            {availableOptions.length === 0 ? (
              <div
                style={{
                  padding: '12px',
                  textAlign: 'center',
                  color: '#6b7280',
                  fontSize: '12px',
                }}
              >
                {selectedPath.length > 0 ? '已是最后一级' : '无可用选项'}
              </div>
            ) : (
              availableOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectOption(option)}
                  style={{
                    padding: '8px 12px',
                    cursor: option.hasItem ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background-color 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    if (option.hasItem) {
                      e.currentTarget.style.backgroundColor = '#374151'
                    }
                  }}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span style={{
                    fontSize: '12px',
                    color: option.hasItem ? '#f3f4f6' : '#9ca3af',
                  }}>
                    {option.name}
                  </span>
                  {option.hasChildren && (
                    <span
                      onClick={(e) => handleExpandOption(option, e)}
                      style={{
                        color: '#9ca3af',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: '2px 6px',
                        borderRadius: '3px',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      title="展开子菜单"
                    >
                      ›
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
})

HierarchicalMenuSelector.displayName = 'HierarchicalMenuSelector'

export default HierarchicalMenuSelector
