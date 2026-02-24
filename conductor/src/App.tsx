import { useRef } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { useFlowStore } from '@/stores'
import { FlowCanvas, NodePalette, PropertyPanel } from '@/components'

function AppContent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const selectNode = useFlowStore((state) => state.selectNode)

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* 左侧节点面板 */}
      <NodePalette />

      {/* 中间画布区域 */}
      <div
        ref={reactFlowWrapper}
        style={{ flex: 1, height: '100%' }}
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
