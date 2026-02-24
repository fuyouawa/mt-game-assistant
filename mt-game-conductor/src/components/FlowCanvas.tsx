import { useCallback, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Connection,
  Edge,
  Node,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useFlowStore } from '@/stores'
import { nodeTypes } from '@/nodes'

const FlowCanvas = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore()

  const handleConnect = useCallback(
    (connection: Connection) => {
      onConnect(connection)
    },
    [onConnect]
  )

  const defaultEdgeOptions = useMemo(
    () => ({
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    }),
    []
  )

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        style={{ backgroundColor: '#111827' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#374151" />
        <Controls
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
          }}
        />
        <MiniMap
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
          }}
          nodeColor="#3b82f6"
          maskColor="rgba(0, 0, 0, 0.6)"
        />
      </ReactFlow>
    </div>
  )
}

export default FlowCanvas
