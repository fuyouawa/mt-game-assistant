import { useCallback, useMemo, useEffect, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Connection,
  Node,
  ReactFlowInstance,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useFlowStore } from '@/stores'
import { nodeTypes, registerSchemaNodeTypes } from '@/nodes'
import { TablesLoader } from '@/utils/tablesLoader'
import { createSchemaNodeData, SchemaNodeData } from '@/utils/nodeDefinitionGenerator'

const FlowCanvas = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useFlowStore()
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [nodeTypesRegistered, setNodeTypesRegistered] = useState(false)

  // 初始化时加载配表并注册节点类型
  useEffect(() => {
    try {
      const nodes = TablesLoader.getNodes()
      const nodeIds = nodes.map(n => n.id)
      registerSchemaNodeTypes(nodeIds)
      setNodeTypesRegistered(true)
    } catch (error) {
      console.error('Failed to load node definitions:', error)
    }
  }, [])

  const handleConnect = useCallback(
    (connection: Connection) => {
      onConnect(connection)
    },
    [onConnect]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowInstance) return

      const type = event.dataTransfer.getData('application/reactflow')
      const schemaIdStr = event.dataTransfer.getData('schemaId')

      if (!type) return

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      // 从配表加载的节点
      if (schemaIdStr) {
        const schemaId = parseInt(schemaIdStr, 10)
        const nodeDefinition = TablesLoader.getNodeById(schemaId)
        if (nodeDefinition) {
          const nodeData = createSchemaNodeData(nodeDefinition)
          console.log('Creating node with data:', nodeData)
          console.log('Node data pins:', nodeData.pins)
          console.log('Node data params:', nodeData.params)

          const newNode: Node<SchemaNodeData> = {
            id: `${type}-${Date.now()}`,
            type,
            position,
            data: nodeData,
          }

          console.log('Adding node:', newNode)
          console.log('Full node object:', JSON.stringify(newNode, null, 2))

          // 使用 zustand store 的 addNode 方法来添加节点
          // 这样可以避免与 React Flow 的内部状态管理冲突
          addNode(newNode)
        } else {
          console.error('Node definition not found for id:', schemaId)
        }
      }
    },
    [reactFlowInstance]
  )

  const defaultEdgeOptions = useMemo(
    () => ({
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    }),
    []
  )

  if (!nodeTypesRegistered) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#111827',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: '#9ca3af', fontSize: '14px' }}>加载节点定义中...</span>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
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
