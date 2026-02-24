import { useMemo } from 'react'
import { useReactFlow } from 'reactflow'
import { NodeType } from '@/types'
import { useFlowStore } from '@/stores'

interface NodeTemplate {
  type: NodeType
  label: string
  category: string
  color: string
}

const NODE_TEMPLATES: NodeTemplate[] = [
  // 基础节点
  { type: NodeType.START, label: '开始', category: '基础', color: '#22c55e' },
  { type: NodeType.END, label: '结束', category: '基础', color: '#ef4444' },

  // 动作节点
  { type: NodeType.CLICK, label: '点击', category: '动作', color: '#3b82f6' },
  { type: NodeType.SWIPE, label: '滑动', category: '动作', color: '#3b82f6' },
  { type: NodeType.WAIT, label: '等待', category: '动作', color: '#3b82f6' },
  { type: NodeType.INPUT, label: '输入', category: '动作', color: '#3b82f6' },

  // 控制节点
  { type: NodeType.CONDITION, label: '条件判断', category: '控制', color: '#f59e0b' },
  { type: NodeType.LOOP, label: '循环', category: '控制', color: '#8b5cf6' },

  // 检测节点
  { type: NodeType.IMAGE_DETECT, label: '图像识别', category: '检测', color: '#06b6d4' },
  { type: NodeType.COLOR_DETECT, label: '颜色检测', category: '检测', color: '#06b6d4' },
  { type: NodeType.OCR_DETECT, label: '文字识别', category: '检测', color: '#06b6d4' },
]

const NodePalette = () => {
  const addNode = useFlowStore((state) => state.addNode)

  // 按分类组织节点
  const categorizedNodes = useMemo(() => {
    const categories = new Map<string, NodeTemplate[]>()
    NODE_TEMPLATES.forEach((node) => {
      if (!categories.has(node.category)) {
        categories.set(node.category, [])
      }
      categories.get(node.category)!.push(node)
    })
    return categories
  }, [])

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType, label: string) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.setData('label', label)
  }

  return (
    <div
      style={{
        width: '240px',
        height: '100%',
        backgroundColor: '#1f2937',
        borderRight: '1px solid #374151',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <h2
        style={{
          color: '#fff',
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid #374151',
        }}
      >
        节点面板
      </h2>

      {Array.from(categorizedNodes.entries()).map(([category, nodes]) => (
        <div key={category} style={{ marginBottom: '20px' }}>
          <h3
            style={{
              color: '#9ca3af',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}
          >
            {category}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {nodes.map((node) => (
              <div
                key={node.type}
                draggable
                onDragStart={(e) => handleDragStart(e, node.type, node.label)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#374151',
                  color: '#fff',
                  fontSize: '13px',
                  cursor: 'grab',
                  borderLeft: `3px solid ${node.color}`,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563'
                  e.currentTarget.style.transform = 'translateX(2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#374151'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                {node.label}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default NodePalette
