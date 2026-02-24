import { Node, NodePin, NodePinType } from '@/data/schema'
import { NodePinUtils } from './tablesLoader'

/**
 * 节点模板接口
 */
export interface NodeTemplate {
  /** 节点ID（来自配表） */
  id: number
  /** 节点类型（用于 React Flow） */
  type: string
  /** 节点标签 */
  label: string
  /** 分类 */
  category: string
  /** 颜色 */
  color: string
  /** 节点定义 */
  nodeDefinition: Node
}

/**
 * 分类颜色映射
 */
const CATEGORY_COLORS: Record<string, string> = {
  '基础': '#22c55e',
  '动作': '#3b82f6',
  '控制': '#f59e0b',
  '检测': '#06b6d4',
  '默认': '#6b7280',
}

/**
 * 获取分类颜色
 */
function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['默认']
}

/**
 * 从 Node 生成节点模板
 */
export function createNodeTemplate(nodeDefinition: Node): NodeTemplate {
  const color = getCategoryColor(nodeDefinition.catalogue)

  return {
    id: nodeDefinition.id,
    type: `schema_node_${nodeDefinition.id}`,
    label: nodeDefinition.name,
    category: nodeDefinition.catalogue,
    color,
    nodeDefinition,
  }
}

/**
 * 从节点定义数组生成节点模板数组
 */
export function createNodeTemplates(nodeDefinitions: Node[]): NodeTemplate[] {
  return nodeDefinitions.map(createNodeTemplate)
}

/**
 * 按分类组织节点模板
 */
export function groupNodesByCategory(templates: NodeTemplate[]): Map<string, NodeTemplate[]> {
  const grouped = new Map<string, NodeTemplate[]>()

  for (const template of templates) {
    if (!grouped.has(template.category)) {
      grouped.set(template.category, [])
    }
    grouped.get(template.category)!.push(template)
  }

  return grouped
}

/**
 * 引脚参数值接口
 */
export interface PinParamValue {
  pinIndex: number
  pin: NodePin
  value: unknown
}

/**
 * 创建默认参数值数组
 */
export function createDefaultParamValues(nodeDefinition: Node): PinParamValue[] {
  const params: PinParamValue[] = []
  const pins = NodePinUtils.getPins(nodeDefinition)

  pins.forEach((pin, index) => {
    let defaultValue: unknown = ''

    switch (pin.type) {
      case NodePinType.STRING:
        defaultValue = ''
        break
      case NodePinType.NUMBER:
        defaultValue = 0
        break
      case NodePinType.GAME_MODULE:
        defaultValue = null // null 表示未选择
        break
    }

    params.push({
      pinIndex: index,
      pin,
      value: defaultValue,
    })
  })

  return params
}

/**
 * 从配表节点生成 React Flow 节点数据
 */
export interface SchemaNodeData {
  /** 节点ID（来自配表） */
  schemaId: number
  /** 节点名称 */
  label: string
  /** 分类 */
  category: string
  /** 颜色 */
  color: string
  /** 引脚定义 */
  pins?: NodePin[]
  /** 参数值 */
  params?: PinParamValue[]
}

export function createSchemaNodeData(nodeDefinition: Node): SchemaNodeData {
  const pins = NodePinUtils.getPins(nodeDefinition)
  const params = createDefaultParamValues(nodeDefinition)
  const color = getCategoryColor(nodeDefinition.catalogue)

  return {
    schemaId: nodeDefinition.id,
    label: nodeDefinition.name,
    category: nodeDefinition.catalogue,
    color,
    pins,
    params,
  }
}
