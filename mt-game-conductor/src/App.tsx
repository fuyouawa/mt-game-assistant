import { useCallback, useRef } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { useFlowStore } from '@/stores'
import { FlowCanvas, NodePalette, PropertyPanel } from '@/components'

function AppContent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const addNode = useFlowStore((state) => state.addNode)
  const selectNode = useFlowStore((state) => state.selectNode)

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      const label = event.dataTransfer.getData('label')

      if (!type || !reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label, type },
      }

      addNode(newNode)
    },
    [addNode]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* 左侧节点面板 */}
      <NodePalette />

      {/* 中间画布区域 */}
      <div
        ref={reactFlowWrapper}
        style={{ flex: 1, height: '100%' }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={() => selectNode(null)}
      >
        <FlowCanvas />
      </div>

      {/* 右侧属性面板 */}
      <PropertyPanel />
    </div>
  )
}

function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  )
}

export default App
