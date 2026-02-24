import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { NodeType } from '@/types'

const BaseNode = ({ data, id }: NodeProps) => {
  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case NodeType.START:
        return '#22c55e'
      case NodeType.END:
        return '#ef4444'
      case NodeType.CLICK:
      case NodeType.SWIPE:
      case NodeType.WAIT:
      case NodeType.INPUT:
        return '#3b82f6'
      case NodeType.CONDITION:
        return '#f59e0b'
      case NodeType.LOOP:
        return '#8b5cf6'
      case NodeType.IMAGE_DETECT:
      case NodeType.COLOR_DETECT:
      case NodeType.OCR_DETECT:
        return '#06b6d4'
      default:
        return '#6b7280'
    }
  }

  const color = getNodeColor(data.type as NodeType)

  return (
    <div
      className="base-node"
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        border: `2px solid ${color}`,
        backgroundColor: '#1f2937',
        color: '#fff',
        minWidth: '120px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Source Handle - 仅非结束节点 */}
      {data.type !== NodeType.END && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: color,
            border: '2px solid #fff',
          }}
        />
      )}

      {/* Target Handle - 仅非开始节点 */}
      {data.type !== NodeType.START && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: color,
            border: '2px solid #fff',
          }}
        />
      )}

      {data.label}
    </div>
  )
}

export default memo(BaseNode)
