import { NodeType, PinType, PinDataType, type PinDefinition } from '@/types'

/**
 * 节点引脚配置工厂
 * 为每种节点类型定义默认的输入输出引脚
 */

/** 创建执行输入引脚 */
const createExecInput = (id: string, label: string, required = false): PinDefinition => ({
  id,
  label,
  direction: 'input',
  pinType: PinType.EXEC,
  required,
})

/** 创建执行输出引脚 */
const createExecOutput = (id: string, label: string): PinDefinition => ({
  id,
  label,
  direction: 'output',
  pinType: PinType.EXEC,
})

/** 创建数据输入引脚 */
const createDataInput = (
  id: string,
  label: string,
  dataType: PinDataType,
  defaultValue?: unknown,
  required = false
): PinDefinition => ({
  id,
  label,
  direction: 'input',
  pinType: PinType.DATA,
  dataType,
  defaultValue,
  required,
})

/** 创建数据输出引脚 */
const createDataOutput = (
  id: string,
  label: string,
  dataType: PinDataType
): PinDefinition => ({
  id,
  label,
  direction: 'output',
  pinType: PinType.DATA,
  dataType,
})

/**
 * 获取节点类型的默认引脚配置
 */
export const getNodePins = (nodeType: NodeType): PinDefinition[] => {
  switch (nodeType) {
    case NodeType.START:
      return [
        createExecOutput('exec_out', '执行'),
      ]

    case NodeType.END:
      return [
        createExecInput('exec_in', '执行'),
      ]

    case NodeType.CLICK:
      return [
        createExecInput('exec_in', '执行', true),
        createDataInput('x', 'X坐标', PinDataType.NUMBER, 0, true),
        createDataInput('y', 'Y坐标', PinDataType.NUMBER, 0, true),
        createDataInput('duration', '持续时间(ms)', PinDataType.NUMBER, 100, false),
        createExecOutput('exec_out', '执行'),
        createDataOutput('success', '是否成功', PinDataType.BOOLEAN),
      ]

    case NodeType.SWIPE:
      return [
        createExecInput('exec_in', '执行', true),
        createDataInput('startX', '起点X', PinDataType.NUMBER, 0, true),
        createDataInput('startY', '起点Y', PinDataType.NUMBER, 0, true),
        createDataInput('endX', '终点X', PinDataType.NUMBER, 100, true),
        createDataInput('endY', '终点Y', PinDataType.NUMBER, 100, true),
        createDataInput('duration', '持续时间(ms)', PinDataType.NUMBER, 300, false),
        createExecOutput('exec_out', '执行'),
        createDataOutput('success', '是否成功', PinDataType.BOOLEAN),
      ]

    case NodeType.WAIT:
      return [
        createExecInput('exec_in', '执行', true),
        createDataInput('duration', '持续时间(ms)', PinDataType.NUMBER, 1000, true),
        createExecOutput('exec_out', '执行'),
      ]

    case NodeType.INPUT:
      return [
        createExecInput('exec_in', '执行', true),
        createDataInput('text', '输入文本', PinDataType.STRING, '', true),
        createDataInput('x', 'X坐标', PinDataType.NUMBER, 0, true),
        createDataInput('y', 'Y坐标', PinDataType.NUMBER, 0, true),
        createExecOutput('exec_out', '执行'),
        createDataOutput('success', '是否成功', PinDataType.BOOLEAN),
      ]

    case NodeType.CONDITION:
      return [
        createExecInput('exec_in', '执行', true),
        createDataInput('condition', '条件表达式', PinDataType.STRING, '', true),
        createExecOutput('true', '真'),
        createExecOutput('false', '假'),
        createDataOutput('result', '结果', PinDataType.BOOLEAN),
      ]

    case NodeType.LOOP:
      return [
        createExecInput('exec_in', '执行', true),
        createDataInput('count', '循环次数', PinDataType.NUMBER, 1, true),
        createExecOutput('loop_body', '循环体'),
        createExecOutput('completed', '完成'),
        createDataOutput('index', '当前索引', PinDataType.NUMBER),
      ]

    case NodeType.IMAGE_DETECT:
      return [
        createExecInput('exec_in', '执行', true),
        createDataInput('image', '目标图像', PinDataType.IMAGE, undefined, true),
        createDataInput('threshold', '相似度阈值', PinDataType.NUMBER, 0.8, false),
        createExecOutput('found', '找到'),
        createExecOutput('not_found', '未找到'),
        createDataOutput('position', '位置', PinDataType.VECTOR2),
        createDataOutput('confidence', '置信度', PinDataType.NUMBER),
      ]

    case NodeType.COLOR_DETECT:
      return [
        createExecInput('exec_in', '执行', true),
        createDataInput('color', '目标颜色', PinDataType.COLOR, '#ffffff', true),
        createDataInput('x', '区域X', PinDataType.NUMBER, 0, false),
        createDataInput('y', '区域Y', PinDataType.NUMBER, 0, false),
        createDataInput('width', '区域宽度', PinDataType.NUMBER, 100, false),
        createDataInput('height', '区域高度', PinDataType.NUMBER, 100, false),
        createDataInput('tolerance', '容差', PinDataType.NUMBER, 10, false),
        createExecOutput('found', '找到'),
        createExecOutput('not_found', '未找到'),
        createDataOutput('position', '位置', PinDataType.VECTOR2),
      ]

    case NodeType.OCR_DETECT:
      return [
        createExecInput('exec_in', '执行', true),
        createDataInput('text', '目标文本', PinDataType.STRING, '', true),
        createDataInput('language', '语言', PinDataType.STRING, 'chi_sim', false),
        createExecOutput('found', '找到'),
        createExecOutput('not_found', '未找到'),
        createDataOutput('position', '位置', PinDataType.VECTOR2),
        createDataOutput('confidence', '置信度', PinDataType.NUMBER),
      ]

    default:
      return []
  }
}

/**
 * 创建带引脚的节点数据
 */
export const createNodeWithPins = (
  nodeType: NodeType,
  label: string,
  customParams?: Record<string, unknown>
) => {
  const pins = getNodePins(nodeType)
  const params = customParams
    ? Object.entries(customParams).map(([pinId, value]) => ({ pinId, value }))
    : undefined

  return {
    label,
    type: nodeType,
    pins,
    params,
  }
}
