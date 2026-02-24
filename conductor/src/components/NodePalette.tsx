import { useMemo, useEffect, useState } from 'react'
import { TablesLoader } from '@/utils/tablesLoader'
import { NodeTemplate, groupNodesByCategory } from '@/utils/nodeDefinitionGenerator'

const NodePalette = () => {
  const [nodeTemplates, setNodeTemplates] = useState<NodeTemplate[]>([])
  const [loading, setLoading] = useState(true)

  // 从配表加载节点定义
  useEffect(() => {
    try {
      const nodes = TablesLoader.getNodes()
      const templates = nodes.map(node => ({
        id: node.id,
        type: `schema_node_${node.id}`,
        label: node.name,
        category: node.catalogue,
        color: node.catalogue === '基础' ? '#22c55e' :
                node.catalogue === '动作' ? '#3b82f6' :
                node.catalogue === '控制' ? '#f59e0b' :
                node.catalogue === '检测' ? '#06b6d4' : '#6b7280',
        nodeDefinition: node,
      }))
      setNodeTemplates(templates)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load node definitions:', error)
      setLoading(false)
    }
  }, [])

  // 按分类组织节点
  const categorizedNodes = useMemo(() => {
    return groupNodesByCategory(nodeTemplates)
  }, [nodeTemplates])

  const handleDragStart = (event: React.DragEvent, nodeType: string, schemaId: number, label: string) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.setData('schemaId', schemaId.toString())
    event.dataTransfer.setData('label', label)
  }

  if (loading) {
    return (
      <div
        style={{
          width: '240px',
          height: '100%',
          backgroundColor: '#1f2937',
          borderRight: '1px solid #374151',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#9ca3af', fontSize: '14px' }}>加载中...</span>
      </div>
    )
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
                onDragStart={(e) => handleDragStart(e, node.type, node.id, node.label)}
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
