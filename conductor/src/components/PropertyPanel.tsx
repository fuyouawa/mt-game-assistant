import { useFlowStore } from '@/stores'

const PropertyPanel = () => {
  const { nodes, selectedNodeId, updateNode, deleteNode } = useFlowStore()

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  if (!selectedNode) {
    return (
      <div
        style={{
          width: '280px',
          height: '100%',
          backgroundColor: '#1f2937',
          borderLeft: '1px solid #374151',
          padding: '16px',
          color: '#9ca3af',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
        }}
      >
        选择一个节点以查看属性
      </div>
    )
  }

  return (
    <div
      style={{
        width: '280px',
        height: '100%',
        backgroundColor: '#1f2937',
        borderLeft: '1px solid #374151',
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
        节点属性
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* 节点 ID */}
        <div>
          <label
            style={{
              display: 'block',
              color: '#9ca3af',
              fontSize: '12px',
              fontWeight: '500',
              marginBottom: '6px',
            }}
          >
            节点 ID
          </label>
          <input
            type="text"
            value={selectedNode.id}
            disabled
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #374151',
              backgroundColor: '#111827',
              color: '#6b7280',
              fontSize: '13px',
              cursor: 'not-allowed',
            }}
          />
        </div>

        {/* 节点类型 */}
        <div>
          <label
            style={{
              display: 'block',
              color: '#9ca3af',
              fontSize: '12px',
              fontWeight: '500',
              marginBottom: '6px',
            }}
          >
            节点类型
          </label>
          <input
            type="text"
            value={selectedNode.data.type}
            disabled
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #374151',
              backgroundColor: '#111827',
              color: '#6b7280',
              fontSize: '13px',
              cursor: 'not-allowed',
            }}
          />
        </div>

        {/* 节点标签 */}
        <div>
          <label
            style={{
              display: 'block',
              color: '#9ca3af',
              fontSize: '12px',
              fontWeight: '500',
              marginBottom: '6px',
            }}
          >
            节点标签
          </label>
          <input
            type="text"
            value={selectedNode.data.label}
            onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #374151',
              backgroundColor: '#111827',
              color: '#fff',
              fontSize: '13px',
            }}
          />
        </div>

        {/* 删除按钮 */}
        <button
          onClick={() => deleteNode(selectedNode.id)}
          style={{
            padding: '10px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#ef4444',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444'
          }}
        >
          删除节点
        </button>
      </div>
    </div>
  )
}

export default PropertyPanel
