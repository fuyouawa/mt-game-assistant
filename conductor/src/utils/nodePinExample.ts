/**
 * 节点引脚系统使用示例
 *
 * 这个文件展示了如何使用新的引脚系统创建类似虚幻引擎的节点
 */

import { createNodeWithPins } from './nodePinConfig'
import { NodeType } from '@/types'

// ============================================
// 示例 1: 创建一个简单的点击节点
// ============================================
export const createClickNode = () => {
  return createNodeWithPins(
    NodeType.CLICK,
    '点击',
    {
      x: 100,
      y: 200,
      duration: 150,
    }
  )
}

// ============================================
// 示例 2: 创建一个滑动节点
// ============================================
export const createSwipeNode = () => {
  return createNodeWithPins(
    NodeType.SWIPE,
    '滑动',
    {
      startX: 100,
      startY: 500,
      endX: 100,
      endY: 100,
      duration: 500,
    }
  )
}

// ============================================
// 示例 3: 创建一个条件节点
// ============================================
export const createConditionNode = () => {
  return createNodeWithPins(
    NodeType.CONDITION,
    '条件判断',
    {
      condition: 'x > 100 && y < 200',
    }
  )
}

// ============================================
// 示例 4: 创建一个图像检测节点
// ============================================
export const createImageDetectNode = () => {
  return createNodeWithPins(
    NodeType.IMAGE_DETECT,
    '图像检测',
    {
      threshold: 0.85,
    }
  )
}

// ============================================
// 示例 5: 创建一个循环节点
// ============================================
export const createLoopNode = () => {
  return createNodeWithPins(
    NodeType.LOOP,
    '循环',
    {
      count: 5,
    }
  )
}

// ============================================
// 示例 6: 自定义引脚配置
// ============================================
export const createCustomNode = () => {
  return {
    label: '自定义动作',
    type: NodeType.CLICK,
    pins: [
      {
        id: 'exec_in',
        label: '执行',
        direction: 'input',
        pinType: 'exec' as const,
        required: true,
      },
      {
        id: 'target',
        label: '目标对象',
        direction: 'input',
        pinType: 'data' as const,
        dataType: 'string' as const,
        required: true,
        defaultValue: 'button',
      },
      {
        id: 'delay',
        label: '延迟(秒)',
        direction: 'input',
        pinType: 'data' as const,
        dataType: 'number' as const,
        required: false,
        defaultValue: 0,
      },
      {
        id: 'exec_out',
        label: '完成',
        direction: 'output',
        pinType: 'exec' as const,
      },
      {
        id: 'result',
        label: '执行结果',
        direction: 'output',
        pinType: 'data' as const,
        dataType: 'boolean' as const,
      },
    ],
    params: [
      { pinId: 'target', value: 'button' },
      { pinId: 'delay', value: 0 },
    ],
  }
}

// ============================================
// 使用说明
// ============================================

/**
 * 在 ReactFlow 中使用引脚节点：
 *
 * 1. 导入 PinsNode 组件：
 *    import PinsNode from '@/nodes/PinsNode'
 *
 * 2. 在 nodeTypes 中注册：
 *    const nodeTypes = {
 *      pinsNode: PinsNode,
 *    }
 *
 * 3. 创建节点时使用 pinsNode 类型：
 *    const nodes = [
 *      {
 *        id: '1',
 *        type: 'pinsNode',
 *        position: { x: 0, y: 0 },
 *        data: createClickNode(),
 *      },
 *    ]
 *
 * 4. 连接引脚时使用引脚 ID：
 *    const edges = [
 *      {
 *        id: 'e1-2',
 *        source: '1',
 *        sourceHandle: 'exec_out',  // 输出引脚 ID
 *        target: '2',
 *        targetHandle: 'exec_in',   // 输入引脚 ID
 *      },
 *    ]
 */

// ============================================
// 引脚连接规则示例
// ============================================

/**
 * 连接规则建议：
 *
 * 1. EXEC 引脚只能连接到 EXEC 引脚
 * 2. DATA 引脚只能连接到 DATA 引脚
 * 3. 数据类型应该匹配（或兼容）
 * 4. 输入引脚只能有一个连接（除非 allowMultiple: true）
 * 5. 输出引脚可以有多个连接
 */

export const connectionRules = {
  // 执行流连接
  execToExec: {
    isValid: (sourceType: string, targetType: string) => {
      return sourceType === 'exec' && targetType === 'exec'
    },
  },

  // 数据连接
  dataToData: {
    isValid: (sourceType: string, targetType: string) => {
      return sourceType === 'data' && targetType === 'data'
    },
  },

  // 类型兼容性检查
  isTypeCompatible: (sourceDataType: string, targetDataType: string) => {
    // ANY 类型可以连接到任何类型
    if (sourceDataType === 'any' || targetDataType === 'any') {
      return true
    }

    // 相同类型可以连接
    if (sourceDataType === targetDataType) {
      return true
    }

    // 数字可以连接到字符串（会自动转换）
    if (sourceDataType === 'number' && targetDataType === 'string') {
      return true
    }

    return false
  },
}

// ============================================
// 引脚数据类型帮助函数
// ============================================

/**
 * 根据数据类型获取默认值
 */
export const getDefaultValueForType = (dataType: string) => {
  switch (dataType) {
    case 'string':
      return ''
    case 'number':
      return 0
    case 'boolean':
      return false
    case 'vector2':
      return { x: 0, y: 0 }
    case 'vector3':
      return { x: 0, y: 0, z: 0 }
    case 'color':
      return '#ffffff'
    case 'image':
      return null
    default:
      return null
  }
}

/**
 * 验证参数值是否符合数据类型
 */
export const validateParamValue = (value: unknown, dataType: string): boolean => {
  switch (dataType) {
    case 'string':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number'
    case 'boolean':
      return typeof value === 'boolean'
    case 'vector2':
      return (
        typeof value === 'object' &&
        value !== null &&
        'x' in value &&
        'y' in value
      )
    case 'vector3':
      return (
        typeof value === 'object' &&
        value !== null &&
        'x' in value &&
        'y' in value &&
        'z' in value
      )
    default:
      return true
  }
}
