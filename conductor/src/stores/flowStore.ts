import { create } from 'zustand'
import { Connection, Edge, Node, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow'
import { NodeType } from '@/types'

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
  nodes: [
    {
      id: 'start-1',
      type: NodeType.START,
      position: { x: 100, y: 100 },
      data: { label: '开始' },
    },
  ],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set((state: FlowState) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }))
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
