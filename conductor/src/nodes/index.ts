import { type NodeTypes } from 'reactflow'
import SchemaNode from './SchemaNode'

/**
 * 节点类型映射表
 * 所有从配表动态加载的节点类型都使用 SchemaNode 组件
 */
export const nodeTypes: NodeTypes = {}

/**
 * 动态注册从配表加载的节点类型
 * @param nodeIds - 节点定义ID列表
 */
export function registerSchemaNodeTypes(nodeIds: number[]) {
  nodeIds.forEach(id => {
    const typeName = `schema_node_${id}`
    nodeTypes[typeName] = SchemaNode
  })
}

export { SchemaNode }
export type { SchemaNodeData } from '@/utils/nodeDefinitionGenerator'
