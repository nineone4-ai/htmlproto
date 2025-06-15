"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Check } from "lucide-react"

interface ModalField {
  id: string
  name: string
  type: string
  width: string
}

interface ModalListProps {
  fields: ModalField[]
  multiSelect?: boolean
  onSelect: (selectedItems: any[]) => void
  onClose: () => void
}

// 简化的模拟数据生成器 - 只生成1条示例数据
const generateMockData = (fields: ModalField[]) => {
  const item: any = { id: 1 }
  fields.forEach((field) => {
    item[field.id] = "示例数据"
  })
  return [item]
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "正常":
      return "bg-green-100 text-green-800"
    case "待审核":
      return "bg-yellow-100 text-yellow-800"
    case "已禁用":
      return "bg-gray-100 text-gray-800"
    case "已删除":
      return "bg-red-100 text-red-800"
    default:
      return "bg-blue-100 text-blue-800"
  }
}

export function ModalList({ fields, multiSelect = false, onSelect, onClose }: ModalListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [data] = useState(() => generateMockData(fields))

  // 过滤数据
  const filteredData = data.filter((item) =>
    fields.some((field) => String(item[field.id]).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleItemSelect = (item: any) => {
    if (multiSelect) {
      const isSelected = selectedItems.some((selected) => selected.id === item.id)
      if (isSelected) {
        setSelectedItems(selectedItems.filter((selected) => selected.id !== item.id))
      } else {
        setSelectedItems([...selectedItems, item])
      }
    } else {
      onSelect([item])
      onClose()
    }
  }

  const handleConfirmSelection = () => {
    onSelect(selectedItems)
    onClose()
  }

  const renderCellContent = (item: any, field: ModalField) => {
    const value = item[field.id]

    if (field.type === "status") {
      return (
        <Badge variant="secondary" className={getStatusColor(value)}>
          {value}
        </Badge>
      )
    }

    return <span className="truncate">{value}</span>
  }

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 px-6">
        <p className="text-lg mb-2">暂无字段配置</p>
        <p className="text-sm">请在属性面板中配置弹窗列表字段</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full max-h-[60vh] px-6 py-4">
      {/* 搜索栏 */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {multiSelect && selectedItems.length > 0 && (
          <Button onClick={handleConfirmSelection} className="whitespace-nowrap">
            确认选择 ({selectedItems.length})
          </Button>
        )}
      </div>

      {/* 表格容器 - 适配所有弹窗尺寸，确保左右间距一致 */}
      <div className="flex-1 border rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[400px]">
          <table className="w-full border-collapse min-w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {multiSelect && (
                  <th className="w-12 p-3 text-left border-b border-gray-200 bg-gray-50 sticky left-0 z-20">
                    <Checkbox
                      checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems([...filteredData])
                        } else {
                          setSelectedItems([])
                        }
                      }}
                    />
                  </th>
                )}
                {fields.map((field) => (
                  <th
                    key={field.id}
                    className="p-3 text-left border-b border-gray-200 font-medium text-gray-700 bg-gray-50 whitespace-nowrap min-w-[100px]"
                  >
                    {field.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const isSelected = selectedItems.some((selected) => selected.id === item.id)
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                      isSelected ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleItemSelect(item)}
                  >
                    {multiSelect && (
                      <td className="p-3 sticky left-0 bg-white z-10">
                        <Checkbox checked={isSelected} readOnly />
                      </td>
                    )}
                    {fields.map((field) => (
                      <td key={field.id} className="p-3 whitespace-nowrap min-w-[100px]">
                        <div className="flex items-center min-w-0">
                          {renderCellContent(item, field)}
                          {!multiSelect && isSelected && <Check className="ml-2 h-4 w-4 text-blue-600 flex-shrink-0" />}
                        </div>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredData.length === 0 && (
        <div className="flex items-center justify-center h-32 text-gray-500">
          <p>没有找到匹配的数据</p>
        </div>
      )}

      {/* 底部信息 */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>共 {filteredData.length} 条数据</span>
        {multiSelect && <span>已选择 {selectedItems.length} 项</span>}
      </div>
    </div>
  )
}
