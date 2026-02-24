import { memo, useState } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { NodeType, PinType, PinDataType, type PinDefinition, type NodeData } from '@/types'

interface PinsNodeProps extends NodeProps {
  data: NodeData & {
    pins?: PinDefinition[]
    params?: Array<{ pinId: string; value: unknown }>
  }
}

const PinsNode = ({ data, id }: PinsNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [paramValues, setParamValues] = useState<Record<string, unknown>>(
    () =>
      data.params?.reduce((acc, param) => {
        acc[param.pinId] = param.value
        return acc
      }, {} as Record<string, unknown>) || {}
  )

  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case NodeType.START:
        return '#22c55e'
      case NodeType.END:
        return '#ef4444'
      case NodeType.CLICK:
      case NodeType.SWIPE:
      case NodeType.WAIT:
      case NodeType.INPUT:
        return '#3b82f6'
      case NodeType.CONDITION:
        return '#f59e0b'
      case NodeType.LOOP:
        return '#8b5cf6'
      case NodeType.IMAGE_DETECT:
      case NodeType.COLOR_DETECT:
      case NodeType.OCR_DETECT:
        return '#06b6d4'
      default:
        return '#6b7280'
    }
  }

  const getPinColor = (pinType: PinType) => {
    switch (pinType) {
      case PinType.EXEC:
        return '#ffffff'
      case PinType.DATA:
        return '#fbbf24'
      default:
        return '#ffffff'
    }
  }

  const getDataTypeColor = (dataType?: PinDataType) => {
    switch (dataType) {
      case PinDataType.STRING:
        return '#10b981'
      case PinDataType.NUMBER:
        return '#3b82f6'
      case PinDataType.BOOLEAN:
        return '#ef4444'
      case PinDataType.VECTOR2:
      case PinDataType.VECTOR3:
        return '#8b5cf6'
      case PinDataType.COLOR:
        return '#ec4899'
      case PinDataType.IMAGE:
        return '#06b6d4'
      default:
        return '#6b7280'
    }
  }

  const color = getNodeColor(data.type as NodeType)

  // 分离输入和输出引脚
  const inputPins = data.pins?.filter(pin => pin.direction === 'input') || []
  const outputPins = data.pins?.filter(pin => pin.direction === 'output') || []

  // 分离执行引脚和数据引脚
  const inputExecPins = inputPins.filter(pin => pin.pinType === PinType.EXEC)
  const inputDataPins = inputPins.filter(pin => pin.pinType === PinType.DATA)
  const outputExecPins = outputPins.filter(pin => pin.pinType === PinType.EXEC)
  const outputDataPins = outputPins.filter(pin => pin.pinType === PinType.DATA)

  const handleParamChange = (pinId: string, value: unknown) => {
    setParamValues(prev => ({ ...prev, [pinId]: value }))
  }

  const renderParamInput = (pin: PinDefinition) => {
    const value = paramValues[pin.id] ?? pin.defaultValue

    switch (pin.dataType) {
      case PinDataType.STRING:
        return (
          <input
            type="text"
            value={value as string || ''}
            onChange={e => handleParamChange(pin.id, e.target.value)}
            className="param-input"
            style={{
              width: '100%',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#fff',
              fontSize: '12px',
            }}
            placeholder={pin.label}
          />
        )
      case PinDataType.NUMBER:
        return (
          <input
            type="number"
            value={value as number || 0}
            onChange={e => handleParamChange(pin.id, Number(e.target.value))}
            className="param-input"
            style={{
              width: '100%',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#fff',
              fontSize: '12px',
            }}
            placeholder={pin.label}
          />
        )
      case PinDataType.BOOLEAN:
        return (
          <input
            type="checkbox"
            checked={value as boolean || false}
            onChange={e => handleParamChange(pin.id, e.target.checked)}
            style={{
              width: '16px',
              height: '16px',
              cursor: 'pointer',
            }}
          />
        )
      default:
        return (
          <input
            type="text"
            value={String(value || '')}
            onChange={e => handleParamChange(pin.id, e.target.value)}
            className="param-input"
            style={{
              width: '100%',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #4b5563',
              backgroundColor: '#1f2937',
              color: '#fff',
              fontSize: '12px',
            }}
            placeholder={pin.label}
          />
        )
    }
  }

  return (
    <div
      className="pins-node"
      style={{
        padding: '0',
        borderRadius: '8px',
        border: `2px solid ${color}`,
        backgroundColor: '#1f2937',
        color: '#fff',
        minWidth: '180px',
        maxWidth: '300px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* 节点标题 */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #374151',
          backgroundColor: color,
          borderRadius: '6px 6px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: '600' }}>{data.label}</span>
        <span
          style={{
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          {data.type}
        </span>
      </div>

      {/* 引脚区域 */}
      <div style={{ padding: '12px' }}>
        {/* 输入执行引脚 */}
        {inputExecPins.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            {inputExecPins.map((pin, index) => (
              <div key={pin.id} style={{ position: 'relative', marginBottom: '4px' }}>
                <Handle
                  type="target"
                  position={Position.Left}
                  id={pin.id}
                  style={{
                    left: '-6px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: getPinColor(pin.pinType),
                    border: '2px solid #fff',
                  }}
                />
                <span
                  style={{
                    marginLeft: '12px',
                    fontSize: '12px',
                    color: '#9ca3af',
                  }}
                >
                  {pin.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 输入数据引脚 */}
        {inputDataPins.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            {inputDataPins.map((pin) => (
              <div key={pin.id} style={{ position: 'relative', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={pin.id}
                    style={{
                      left: '-6px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: getDataTypeColor(pin.dataType),
                      border: '2px solid #fff',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        marginBottom: '2px',
                      }}
                    >
                      {pin.label}
                      {pin.required && <span style={{ color: '#ef4444' }}>*</span>}
                    </div>
                    {isExpanded && renderParamInput(pin)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 输出数据引脚 */}
        {outputDataPins.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            {outputDataPins.map((pin) => (
              <div key={pin.id} style={{ position: 'relative', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        marginBottom: '2px',
                      }}
                    >
                      {pin.label}
                    </div>
                  </div>
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={pin.id}
                    style={{
                      right: '-6px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: getDataTypeColor(pin.dataType),
                      border: '2px solid #fff',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 输出执行引脚 */}
        {outputExecPins.length > 0 && (
          <div>
            {outputExecPins.map((pin) => (
              <div key={pin.id} style={{ position: 'relative', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <span
                    style={{
                      marginRight: '12px',
                      fontSize: '12px',
                      color: '#9ca3af',
                    }}
                  >
                    {pin.label}
                  </span>
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={pin.id}
                    style={{
                      right: '-6px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: getPinColor(pin.pinType),
                      border: '2px solid #fff',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 默认的执行引脚（向后兼容） */}
      {data.pins === undefined || data.pins.length === 0 ? (
        <>
          {data.type !== NodeType.END && (
            <Handle
              type="source"
              position={Position.Right}
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: color,
                border: '2px solid #fff',
              }}
            />
          )}
          {data.type !== NodeType.START && (
            <Handle
              type="target"
              position={Position.Left}
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: color,
                border: '2px solid #fff',
              }}
            />
          )}
        </>
      ) : null}
    </div>
  )
}

export default memo(PinsNode)
