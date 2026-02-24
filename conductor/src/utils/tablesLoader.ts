import { Tables, Node, NodePin, NodePinType, GameModule } from '@/data/schema'

// 直接导入 JSON 文件
import tbnodeJson from '../../data/tbnode.json'
import tbgamemoduleJson from '../../data/tbgamemodule.json'

/**
 * 配表加载器单例类
 */
class TablesLoaderClass {
  private tables: Tables | null = null

  /**
   * 加载配表数据
   */
  load(): Tables {
    if (this.tables) {
      return this.tables
    }

    // 使用同步加载器，因为数据已经通过 import 导入
    const loader = (file: string): unknown[] => {
      switch (file) {
        case 'tbgamemodule':
          return tbgamemoduleJson as unknown[]
        case 'tbnode':
          return tbnodeJson as unknown[]
        default:
          throw new Error(`Unknown table file: ${file}`)
      }
    }

    this.tables = new Tables(loader)
    return this.tables
  }

  /**
   * 获取 Tables 实例（如果未加载则返回 null）
   */
  getTables(): Tables | null {
    return this.tables
  }

  /**
   * 获取所有节点定义
   */
  getNodes(): Node[] {
    const tables = this.load()
    return tables.TbNode.getDataList()
  }

  /**
   * 获取所有游戏模块
   */
  getGameModules(): GameModule[] {
    const tables = this.load()
    return tables.TbGameModule.getDataList()
  }

  /**
   * 根据目录获取节点
   */
  getNodesByCatalogue(catalogue: string): Node[] {
    const nodes = this.getNodes()
    return nodes.filter(node => node.catalogue === catalogue)
  }

  /**
   * 根据ID获取节点
   */
  getNodeById(id: number): Node | undefined {
    const tables = this.load()
    return tables.TbNode.get(id)
  }

  /**
   * 根据ID获取游戏模块
   */
  getGameModuleById(id: number): GameModule | undefined {
    const tables = this.load()
    return tables.TbGameModule.get(id)
  }
}

// 导出单例实例
export const TablesLoader = new TablesLoaderClass()

/**
 * 节点引脚工具函数
 */
export const NodePinUtils = {
  /**
   * 获取节点的所有有效引脚（排除 undefined）
   */
  getPins(node: Node): NodePin[] {
    const pins: NodePin[] = []
    if (node.pin0) pins.push(node.pin0)
    if (node.pin1) pins.push(node.pin1)
    if (node.pin2) pins.push(node.pin2)
    if (node.pin3) pins.push(node.pin3)
    return pins
  },

  /**
   * 判断引脚类型是否为游戏模块
   */
  isGameModulePin(pin: NodePin): boolean {
    return pin.type === NodePinType.GAME_MODULE
  },

  /**
   * 判断引脚类型是否为文本
   */
  isStringPin(pin: NodePin): boolean {
    return pin.type === NodePinType.STRING
  },

  /**
   * 判断引脚类型是否为数值
   */
  isNumberPin(pin: NodePin): boolean {
    return pin.type === NodePinType.NUMBER
  },

  /**
   * 获取引脚类型名称
   */
  getPinTypeName(pin: NodePin): string {
    switch (pin.type) {
      case NodePinType.STRING:
        return '文本'
      case NodePinType.NUMBER:
        return '数值'
      case NodePinType.GAME_MODULE:
        return '游戏模块'
      default:
        return '未知'
    }
  }
}
