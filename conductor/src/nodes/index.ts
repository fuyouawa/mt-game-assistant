import BaseNode from './BaseNode'
import { NodeType } from '@/types/nodes'

export const nodeTypes = {
  [NodeType.START]: BaseNode,
  [NodeType.END]: BaseNode,
  [NodeType.CLICK]: BaseNode,
  [NodeType.SWIPE]: BaseNode,
  [NodeType.WAIT]: BaseNode,
  [NodeType.INPUT]: BaseNode,
  [NodeType.CONDITION]: BaseNode,
  [NodeType.LOOP]: BaseNode,
  [NodeType.IMAGE_DETECT]: BaseNode,
  [NodeType.COLOR_DETECT]: BaseNode,
  [NodeType.OCR_DETECT]: BaseNode,
}

export { BaseNode }
export * from '@/types'
