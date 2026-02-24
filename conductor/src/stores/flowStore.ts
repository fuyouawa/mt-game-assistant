import { create } from 'zustand'
import { Connection, Edge, Node, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow'

interface FlowState {
  nodes: Node[]
  edges: Edge[]
  selectedNodeId: string | null

  // Actions
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  addNode: (node: Node) => void
  deleteNode: (id: string) => void
  updateNode: (id: string, data: Partial<Node['data']>) => void
  selectNode: (id: string | null) => void
  clearFlow: () => void
  loadFlow: (nodes: Node[], edges: Edge[]) => void
}

export const useFlowStore = create<FlowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set((state: FlowState) => {
      // 使用 applyNodeChanges，但确保保留自定义数据
      const resultNodes = applyNodeChanges(changes, state.nodes)

      // 修复：确保 resultNodes 中的每个节点都保留原有的完整 data
      const fixedNodes = resultNodes.map(node => {
        const originalNode = state.nodes.find(n => n.id === node.id)
        if (originalNode && originalNode.data.schemaId && !node.data.schemaId) {
          // 如果新节点丢失了自定义数据，从原节点恢复
          return {
            ...node,
            data: originalNode.data,
          }
        }
        return node
      })

      return { nodes: fixedNodes }
    })
  },

  onEdgesChange: (changes) => {
    set((state: FlowState) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }))
  },

  onConnect: (connection) => {
    set((state: FlowState) => ({
      edges: addEdge(connection, state.edges),
    }))
  },

  addNode: (node) => {
    set((state: FlowState) => ({
      nodes: [...state.nodes, node],
    }))
  },

  deleteNode: (id) => {
    set((state: FlowState) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }))
  },

  updateNode: (id, data) => {
    set((state: FlowState) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    }))
  },

  selectNode: (id) => {
    set({ selectedNodeId: id })
  },

  clearFlow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
    })
  },

  loadFlow: (nodes, edges) => {
    set({
      nodes,
      edges,
      selectedNodeId: null,
    })
  },
}))
