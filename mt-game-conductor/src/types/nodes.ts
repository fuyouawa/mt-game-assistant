/**
 * 节点类型枚举
 */
export enum NodeType {
  // 基础节点
  START = 'start',
  END = 'end',

  // 动作节点
  CLICK = 'click',
  SWIPE = 'swipe',
  WAIT = 'wait',
  INPUT = 'input',

  // 条件节点
  CONDITION = 'condition',
  LOOP = 'loop',

  // 检测节点
  IMAGE_DETECT = 'image_detect',
  COLOR_DETECT = 'color_detect',
  OCR_DETECT = 'ocr_detect',
}

/**
 * 节点数据接口
 */
export interface NodeData {
  label: string
  type: NodeType
  config?: Record<string, unknown>
}

/**
 * 连接点类型
 */
export type ConnectionHandleType = 'source' | 'target'

/**
 * 边类型
 */
export interface EdgeData {
  label?: string
  condition?: string
}
