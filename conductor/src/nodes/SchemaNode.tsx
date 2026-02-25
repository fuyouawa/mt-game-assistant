import { memo, useState, useEffect } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { NodePinType, GameModule, GameButton, AutoGameButton, GameCampaign } from '@/data/schema'
import { SchemaNodeData, PinParamValue } from '@/utils/nodeDefinitionGenerator'
import { TablesLoader } from '@/utils/tablesLoader'

interface SchemaNodeProps extends NodeProps {
  data: SchemaNodeData
}

/**
 * 引脚参数编辑器组件
 */
interface PinParamEditorProps {
  param: PinParamValue
  onChange: (value: unknown) => void
}

const PinParamEditor = memo(({ param, onChange }: PinParamEditorProps) => {
  const [gameModules, setGameModules] = useState<GameModule[]>([])
  const [gameButtons, setGameButtons] = useState<GameButton[]>([])
  const [autoGameButtons, setAutoGameButtons] = useState<AutoGameButton[]>([])
  const [gameCampaigns, setGameCampaigns] = useState<GameCampaign[]>([])

  useEffect(() => {
    if (param.pin.type === NodePinType.GAME_MODULE) {
      const modules = TablesLoader.getGameModules()
      setGameModules(modules)
    } else if (param.pin.type === NodePinType.GAME_BUTTON) {
      const buttons = TablesLoader.getGameButtons()
      setGameButtons(buttons)
    } else if (param.pin.type === NodePinType.AUTO_GAME_BUTTON) {
      const autoButtons = TablesLoader.getAutoGameButtons()
      setAutoGameButtons(autoButtons)
    } else if (param.pin.type === NodePinType.GAME_CAMPAIGN) {
      const campaigns = TablesLoader.getGameCampaigns()
      setGameCampaigns(campaigns)
    }
  }, [param.pin.type])

  const renderEditor = () => {
    switch (param.pin.type) {
      case NodePinType.STRING:
        return (
          <input
            type="text"
            value={param.value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`请输入${param.pin.name}`}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '4px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        )

      case NodePinType.NUMBER:
        return (
          <input
            type="number"
            value={param.value as number ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={`请输入${param.pin.name}`}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '4px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        )

      case NodePinType.GAME_MODULE:
        return (
          <select
            value={param.value as number ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '4px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: 'pointer',
            }}
          >
            <option value="">请选择游戏模块</option>
            {gameModules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.fullName}
              </option>
            ))}
          </select>
        )

      case NodePinType.GAME_BUTTON:
        return (
          <select
            value={param.value as number ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '4px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: 'pointer',
            }}
          >
            <option value="">请选择游戏按钮</option>
            {gameButtons.map((button) => (
              <option key={button.id} value={button.id}>
                {button.fullName}
              </option>
            ))}
          </select>
        )

      case NodePinType.AUTO_GAME_BUTTON:
        return (
          <select
            value={param.value as number ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '4px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: 'pointer',
            }}
          >
            <option value="">请选择自动游戏按钮</option>
            {autoGameButtons.map((button) => (
              <option key={button.id} value={button.id}>
                {button.name}
              </option>
            ))}
          </select>
        )

      case NodePinType.GAME_CAMPAIGN:
        return (
          <select
            value={param.value as number ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: '4px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#fff',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: 'pointer',
            }}
          >
            <option value="">请选择游戏副本</option>
            {gameCampaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        )

      default:
        return <span style={{ color: '#9ca3af', fontSize: '12px' }}>未知类型</span>
    }
  }

  return (
    <div style={{ marginBottom: '8px' }}>
      <label
        style={{
          display: 'block',
          color: '#9ca3af',
          fontSize: '11px',
          marginBottom: '4px',
          fontWeight: '500',
        }}
      >
        {param.pin.name}
        <span style={{ marginLeft: '4px', color: '#6b7280', fontSize: '10px' }}>
          ({param.pin.type === NodePinType.STRING ? '文本' :
            param.pin.type === NodePinType.NUMBER ? '数值' :
            param.pin.type === NodePinType.GAME_MODULE ? '游戏模块' :
            param.pin.type === NodePinType.GAME_BUTTON ? '游戏按钮' :
            param.pin.type === NodePinType.AUTO_GAME_BUTTON ? '自动游戏按钮' :
            param.pin.type === NodePinType.GAME_CAMPAIGN ? '游戏副本' : '未知'})
        </span>
      </label>
      {renderEditor()}
    </div>
  )
})

/**
 * 从配表生成的动态节点组件
 */
const SchemaNode = memo((props: SchemaNodeProps) => {
  // Debug: log all props to understand the structure
  console.log('SchemaNode props:', props)
  const { data } = props

  // Hooks must be called before any early return
  const [isExpanded, setIsExpanded] = useState(false)
  const [localParams, setLocalParams] = useState<PinParamValue[]>(data.params ?? [])

  useEffect(() => {
    if (!data.pins || data.params === undefined) {
      console.error('SchemaNode: Invalid node data received', data)
    }
  }, [data])

  useEffect(() => {
    setLocalParams(data.params ?? [])
  }, [data.params])

  // Safety check: if data is missing required properties, show error
  if (!data.pins || data.params === undefined) {
    return (
      <div
        style={{
          padding: '12px 16px',
          borderRadius: '8px',
          border: '2px solid #ef4444',
          backgroundColor: '#1f2937',
          color: '#fff',
          minWidth: '180px',
        }}
      >
        <span style={{ color: '#ef4444', fontSize: '14px' }}>
          节点数据错误
        </span>
      </div>
    )
  }

  const handleParamChange = (pinIndex: number, value: unknown) => {
    const updatedParams = localParams.map(param =>
      param.pinIndex === pinIndex
        ? { ...param, value }
        : param
    )
    setLocalParams(updatedParams)
  }

  return (
    <div
      className="schema-node"
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        border: `2px solid ${data.color}`,
        backgroundColor: '#1f2937',
        color: '#fff',
        minWidth: '180px',
        maxWidth: '280px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Target Handle - 输入连接点 */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: '10px',
          height: '10px',
          backgroundColor: data.color,
          border: '2px solid #fff',
        }}
      />

      {/* 节点标题区域 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: (data.pins?.length ?? 0) > 0 ? '8px' : 0,
        }}
      >
        <span
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#fff',
          }}
        >
          {data.label}
        </span>

        {/* 展开/收起按钮 - 仅当有参数时显示 */}
        {(data.pins?.length ?? 0) > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '2px 6px',
              fontSize: '16px',
              lineHeight: 1,
              borderRadius: '4px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#374151'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#9ca3af'
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
      </div>

      {/* 分类标签 */}
      <div
        style={{
          fontSize: '10px',
          color: '#9ca3af',
          marginBottom: isExpanded && data.pins.length > 0 ? '8px' : 0,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {data.category}
      </div>

      {/* 参数编辑区域 - 可折叠 */}
      {isExpanded && (data.pins?.length ?? 0) > 0 && (
        <div
          style={{
            paddingTop: '8px',
            borderTop: '1px solid #374151',
          }}
        >
          {localParams.map((param) => (
            <PinParamEditor
              key={param.pinIndex}
              param={param}
              onChange={(value) => handleParamChange(param.pinIndex, value)}
            />
          ))}
        </div>
      )}

      {/* Source Handle - 输出连接点 */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: '10px',
          height: '10px',
          backgroundColor: data.color,
          border: '2px solid #fff',
        }}
      />
    </div>
  )
})

SchemaNode.displayName = 'SchemaNode'

export default SchemaNode
