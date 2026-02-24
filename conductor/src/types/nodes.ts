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
 * 引脚方向
 */
export type PinDirection = 'input' | 'output'

/**
 * 引脚类型
 */
export enum PinType {
  /** 执行引脚（执行流程） */
  EXEC = 'exec',
  /** 数据引脚（传递值） */
  DATA = 'data',
}

/**
 * 数据类型
 */
export enum PinDataType {
  ANY = 'any',
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  VECTOR2 = 'vector2',
  VECTOR3 = 'vector3',
  COLOR = 'color',
  IMAGE = 'image',
}

/**
 * 引脚定义
 */
export interface PinDefinition {
  /** 引脚唯一标识 */
  id: string
  /** 引脚显示名称 */
  label: string
  /** 引脚方向 */
  direction: PinDirection
  /** 引脚类型 */
  pinType: PinType
  /** 数据类型（仅数据引脚需要） */
  dataType?: PinDataType
  /** 是否必需（仅输入引脚） */
  required?: boolean
  /** 默认值（仅输入引脚） */
  defaultValue?: unknown
  /** 是否支持连接多个引脚 */
  allowMultiple?: boolean
}

/**
 * 节点参数数据
 */
export interface NodeParamValue {
  pinId: string
  value: unknown
}

/**
 * 节点数据接口
 */
export interface NodeData {
  label: string
  type: NodeType
  config?: Record<string, unknown>
  /** 节点引脚定义 */
  pins?: PinDefinition[]
  /** 参数值 */
  params?: NodeParamValue[]
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
