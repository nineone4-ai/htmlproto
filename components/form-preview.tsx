"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Copy, Trash, GripVertical } from "lucide-react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useDrag, useDrop } from "react-dnd"
import { ImportFieldsDialog } from "./import-fields-dialog"
import { ModalList } from "./modal-list"

interface FormPreviewProps {
  components: any[]
  onSelectComponent: (component: any) => void
  onDeleteComponent: (componentId: string) => void
  onDuplicateComponent: (component: any) => void
  onReorderComponents: (dragIndex: number, hoverIndex: number) => void
  onImportFields: (fields: string[]) => void
  selectedComponentId: string | null | undefined
  viewType: "form" | "list" | "checklist"
  previewMode: boolean
  approvalButtons?: any[]
  onDeleteApprovalButton?: (buttonId: string) => void
  onDuplicateApprovalButton?: (button: any) => void
  onSelectApprovalButton?: (button: any) => void
}

interface DraggableComponentProps {
  component: any
  index: number
  onSelectComponent: (component: any) => void
  onDeleteComponent: (componentId: string) => void
  onDuplicateComponent: (component: any) => void
  onReorderComponents: (dragIndex: number, hoverIndex: number) => void
  selectedComponentId: string | null | undefined
  previewMode: boolean
  viewType: "form" | "list" | "checklist"
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
  index,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onReorderComponents,
  selectedComponentId,
  previewMode,
  viewType,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ handlerId }, drop] = useDrop({
    accept: "FORM_COMPONENT",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      onReorderComponents(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: "FORM_COMPONENT",
    item: () => {
      return { id: component.id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0.4 : 1
  preview(drop(ref))

  if (viewType === "form") {
    return (
      <div
        ref={ref}
        style={{ opacity }}
        data-handler-id={handlerId}
        className={`space-y-2 ${
          selectedComponentId === component.id && !previewMode ? "ring-2 ring-blue-500 rounded p-2" : ""
        }`}
        onClick={() => !previewMode && onSelectComponent(component)}
      >
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            {!previewMode && (
              <div ref={drag} className="cursor-move mr-2 text-gray-400 hover:text-gray-600">
                <GripVertical className="h-4 w-4" />
              </div>
            )}
            {component.props.required && <span className="text-red-500 mr-1">*</span>}
            {component.props.label}
          </label>
          {!previewMode && (
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicateComponent(component)
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-red-500"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteComponent(component.id)
                }}
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <RenderComponent component={component} previewMode={previewMode} />
      </div>
    )
  }

  // 列表模式下的按钮渲染
  if ((viewType === "list" || viewType === "checklist") && component.type === "button") {
    return (
      <div
        ref={ref}
        style={{ opacity }}
        data-handler-id={handlerId}
        className={`relative group ${
          selectedComponentId === component.id && !previewMode ? "ring-2 ring-blue-500 rounded" : ""
        }`}
        onClick={() => !previewMode && onSelectComponent(component)}
      >
        <RenderComponent component={component} previewMode={previewMode} />
        {!previewMode && (
          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 bg-white border shadow-sm"
              onClick={(e) => {
                e.stopPropagation()
                onDuplicateComponent(component)
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 bg-white border shadow-sm text-red-500"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteComponent(component.id)
              }}
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    )
  }

  return null
}

interface DraggableTableHeaderProps {
  component: any
  index: number
  onReorderComponents: (dragIndex: number, hoverIndex: number) => void
  onSelectComponent: (component: any) => void
  onDeleteComponent: (componentId: string) => void
  onDuplicateComponent: (component: any) => void
  selectedComponentId: string | null | undefined
  previewMode: boolean
  columnWidth: number
  onResizeStart: (e: React.MouseEvent, componentId: string, initialWidth: number) => void
}

const DraggableTableHeader: React.FC<DraggableTableHeaderProps> = ({
  component,
  index,
  onReorderComponents,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent,
  selectedComponentId,
  previewMode,
  columnWidth,
  onResizeStart,
}) => {
  const ref = useRef<HTMLTableCellElement>(null)

  const [{ handlerId }, drop] = useDrop({
    accept: "TABLE_HEADER",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: any, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientX = clientOffset!.x - hoverBoundingRect.left

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return
      }

      onReorderComponents(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: "TABLE_HEADER",
    item: () => {
      return { id: component.id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0.4 : 1
  preview(drop(ref))

  return (
    <th
      ref={ref}
      className={`border-r border-gray-200 p-3 text-left font-medium whitespace-nowrap relative ${
        selectedComponentId === component.id ? "bg-blue-50" : ""
      } ${isDragging ? "bg-blue-100" : ""}`}
      style={{ width: `${columnWidth}px`, minWidth: `${columnWidth}px`, opacity }}
      onClick={() => !previewMode && onSelectComponent(component)}
      data-handler-id={handlerId}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {!previewMode && (
            <div
              ref={drag}
              className="cursor-move mr-2 text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200"
              title="拖拽调整列顺序"
            >
              <GripVertical className="h-4 w-4" />
            </div>
          )}
          <span className="flex items-center">
            {component.props.required && <span className="text-red-500 mr-1">*</span>}
            {component.props.label}
          </span>
        </div>
        {!previewMode && (
          <div className="flex space-x-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={(e) => {
                e.stopPropagation()
                onDuplicateComponent(component)
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-red-500"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteComponent(component.id)
              }}
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      {/* 列宽调整手柄 */}
      <div
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize group"
        onMouseDown={(e) => onResizeStart(e, component.id, columnWidth)}
      >
        <div className="absolute right-0 top-0 h-full w-1 bg-transparent group-hover:bg-blue-400 group-active:bg-blue-600"></div>
      </div>
    </th>
  )
}

const FormPreview: React.FC<FormPreviewProps> = ({
  components,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onReorderComponents,
  onImportFields,
  selectedComponentId,
  viewType,
  previewMode,
  approvalButtons = [],
  onDeleteApprovalButton,
  onDuplicateApprovalButton,
  onSelectApprovalButton,
}) => {
  // 存储列宽的状态
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [startX, setStartX] = useState(0)
  const [startWidth, setStartWidth] = useState(0)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const tableRef = useRef<HTMLTableElement>(null)

  // 处理列宽调整移动的函数
  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizingColumn) return
      const deltaX = e.clientX - startX
      const newWidth = Math.max(100, startWidth + deltaX) // 最小宽度为100px
      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn]: newWidth,
      }))
    },
    [resizingColumn, startX, startWidth],
  )

  // 处理列宽调整结束的函数
  const handleResizeEnd = useCallback(() => {
    setResizingColumn(null)
    document.removeEventListener("mousemove", handleResizeMove)
    document.removeEventListener("mouseup", handleResizeEnd)
  }, [handleResizeMove])

  // 清理事件监听器
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleResizeMove)
      document.removeEventListener("mouseup", handleResizeEnd)
    }
  }, [resizingColumn, handleResizeMove, handleResizeEnd])

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedRows(new Set([0, 1, 2])) // 假设有3行示例数据
    } else {
      setSelectedRows(new Set())
    }
  }

  // 处理单行选择
  const handleRowSelect = (rowIndex: number, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows)
    if (checked) {
      newSelectedRows.add(rowIndex)
    } else {
      newSelectedRows.delete(rowIndex)
    }
    setSelectedRows(newSelectedRows)

    // 更新全选状态
    const totalRows = 3 // 假设有3行示例数据
    setSelectAll(newSelectedRows.size === totalRows)
  }

  if (components.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500 mb-4">将组件拖拽到此处</p>
        {!previewMode && <ImportFieldsDialog onImportFields={onImportFields} />}
      </div>
    )
  }

  // 分离按钮和其他组件
  const buttons = components.filter((comp) => comp.type === "button")
  const otherComponents = components.filter((comp) => comp.type !== "button")
  const actionBars = components.filter((comp) => comp.type === "actionbar")
  const fieldsAndOthers = components.filter((comp) => comp.type !== "button" && comp.type !== "actionbar")

  // 调试日志 - 临时保留
  console.log('=== FormPreview Debug ===')
  console.log('viewType:', viewType)
  console.log('previewMode:', previewMode)
  console.log('components:', components)
  console.log('buttons:', buttons)
  console.log('buttons.length:', buttons.length)
  console.log('=========================')

  // 处理列宽调整开始
  const handleResizeStart = (e: React.MouseEvent, componentId: string, initialWidth: number) => {
    e.preventDefault()
    setResizingColumn(componentId)
    setStartX(e.clientX)
    setStartWidth(initialWidth)
    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)
  }

  // 获取列宽
  const getColumnWidth = (componentId: string, defaultWidth = 100) => {
    return columnWidths[componentId] || defaultWidth
  }

  if (viewType === "list" || viewType === "checklist") {
    return (
      <div className="w-full">
        {/* 导入字段按钮和列表按钮 */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!previewMode && <ImportFieldsDialog onImportFields={onImportFields} />}
            {/* 列表上方的按钮 - 与导入字段按钮同行，居左显示 */}
            {buttons.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {buttons.map((component, index) => (
                  <DraggableComponent
                    key={component.id}
                    component={component}
                    index={index}
                    onSelectComponent={onSelectComponent}
                    onDeleteComponent={onDeleteComponent}
                    onDuplicateComponent={onDuplicateComponent}
                    onReorderComponents={onReorderComponents}
                    selectedComponentId={selectedComponentId}
                    previewMode={previewMode}
                    viewType={viewType}
                  />
                ))}
              </div>
            )}
          </div>
          {!previewMode && (
            <span className="text-sm text-gray-500">
              {viewType === "checklist"
                ? "拖拽图标可调整列顺序，拖拽列头边缘可调整列宽，复选框可选择行"
                : "拖拽图标可调整列顺序，拖拽列头边缘可调整列宽"}
            </span>
          )}
        </div>

        {/* 复选列表顶部操作栏 */}
        {viewType === "checklist" && selectedRows.size > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">已选择 {selectedRows.size} 项</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  批量编辑
                </Button>
                <Button variant="outline" size="sm">
                  批量删除
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedRows(new Set())}>
                  取消选择
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 列表表格 */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table ref={tableRef} className="w-full border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-50">
                {/* 复选列表的全选复选框 */}
                {viewType === "checklist" && (
                  <th className="border-r border-gray-200 p-3 w-12">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} aria-label="全选" />
                  </th>
                )}

                {fieldsAndOthers.map((component, index) => (
                  <DraggableTableHeader
                    key={component.id}
                    component={component}
                    index={index}
                    onReorderComponents={onReorderComponents}
                    onSelectComponent={onSelectComponent}
                    onDeleteComponent={onDeleteComponent}
                    onDuplicateComponent={onDuplicateComponent}
                    selectedComponentId={selectedComponentId}
                    previewMode={previewMode}
                    columnWidth={getColumnWidth(component.id)}
                    onResizeStart={handleResizeStart}
                  />
                ))}
                {actionBars.map((component, index) => {
                  const actionBarIndex = fieldsAndOthers.length + index
                  return (
                    <DraggableTableHeader
                      key={component.id}
                      component={component}
                      index={actionBarIndex}
                      onReorderComponents={onReorderComponents}
                      onSelectComponent={onSelectComponent}
                      onDeleteComponent={onDeleteComponent}
                      onDuplicateComponent={onDuplicateComponent}
                      selectedComponentId={selectedComponentId}
                      previewMode={previewMode}
                      columnWidth={getColumnWidth(component.id, 150)}
                      onResizeStart={handleResizeStart}
                    />
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {/* 渲染示例数据行 */}
              {[0, 1, 2].map((rowIndex) => (
                <tr key={rowIndex} className={`hover:bg-gray-50 ${selectedRows.has(rowIndex) ? "bg-blue-50" : ""}`}>
                  {/* 复选列表的行复选框 */}
                  {viewType === "checklist" && (
                    <td className="border-r border-gray-200 p-3">
                      <Checkbox
                        checked={selectedRows.has(rowIndex)}
                        onCheckedChange={(checked) => handleRowSelect(rowIndex, checked as boolean)}
                        aria-label={`选择第${rowIndex + 1}行`}
                      />
                    </td>
                  )}

                  {fieldsAndOthers.map((component) => (
                    <td
                      key={component.id}
                      className="border-r border-gray-200 p-3 whitespace-nowrap"
                      style={{
                        width: `${getColumnWidth(component.id)}px`,
                        minWidth: `${getColumnWidth(component.id)}px`,
                      }}
                    >
                      <div className="w-full">
                        <RenderComponent component={component} previewMode={previewMode} />
                      </div>
                    </td>
                  ))}
                  {actionBars.map((component) => (
                    <td
                      key={component.id}
                      className="border-r border-gray-200 p-3 whitespace-nowrap"
                      style={{
                        width: `${getColumnWidth(component.id, 150)}px`,
                        minWidth: `${getColumnWidth(component.id, 150)}px`,
                      }}
                    >
                      <RenderComponent component={component} previewMode={previewMode} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // 过滤掉审批按钮，因为它们现在在页面级别显示
  const regularButtons = buttons.filter(component => component.type !== "approvalbuttons")

  // 表单视图：根据字段的布局属性进行智能分组
  const formRows = []
  let currentRow = []
  let currentRowSpan = 0

  for (const component of otherComponents) {
    const columnSpan = component.props.columnSpan || 1
    const fullWidth = component.props.fullWidth || false

    // 如果是独立一行，先完成当前行，然后单独成行
    if (fullWidth) {
      if (currentRow.length > 0) {
        formRows.push(currentRow)
        currentRow = []
        currentRowSpan = 0
      }
      formRows.push([{ ...component, _renderSpan: 3 }])
    } else {
      // 检查当前行是否还能容纳这个字段
      if (currentRowSpan + columnSpan > 3) {
        // 当前行放不下，开始新行
        if (currentRow.length > 0) {
          formRows.push(currentRow)
        }
        currentRow = [{ ...component, _renderSpan: columnSpan }]
        currentRowSpan = columnSpan
      } else {
        // 当前行可以容纳
        currentRow.push({ ...component, _renderSpan: columnSpan })
        currentRowSpan += columnSpan
      }
    }
  }

  // 添加最后一行
  if (currentRow.length > 0) {
    formRows.push(currentRow)
  }

  return (
    <div className="space-y-6">
      {/* 审批按钮 - 表单内部顶部，右对齐 */}
      {approvalButtons.length > 0 && (
        <div className="flex justify-end mb-4">
          <div className="flex gap-2">
            {approvalButtons.map((component) => (
              <div
                key={component.id}
                className={`relative group ${
                  selectedComponentId === component.id && !previewMode
                    ? "ring-2 ring-blue-500 rounded"
                    : ""
                }`}
              >
                <Button
                  disabled={previewMode ? component.props.disabled : false}
                  style={{ backgroundColor: component.props.color || "#1890ff" }}
                  className="text-white"
                  onClick={() => !previewMode && onSelectApprovalButton && onSelectApprovalButton(component)}
                >
                  {component.props.text}
                </Button>

                {/* 操作按钮 - 与默认按钮保持一致 */}
                {!previewMode && (
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 bg-white border shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDuplicateApprovalButton && onDuplicateApprovalButton(component)
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 bg-white border shadow-sm text-red-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteApprovalButton && onDeleteApprovalButton(component.id)
                      }}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 导入字段按钮 */}
      {!previewMode && otherComponents.length === 0 && (
        <div className="flex justify-center">
          <ImportFieldsDialog onImportFields={onImportFields} />
        </div>
      )}

      {!previewMode && otherComponents.length > 0 && (
        <div className="flex justify-between items-center">
          <ImportFieldsDialog onImportFields={onImportFields} />
          <span className="text-sm text-gray-500">拖拽字段左侧图标可调整顺序</span>
        </div>
      )}

      {/* 表单字段 */}
      {formRows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-3 gap-6">
          {row.map((component: any, colIndex: number) => {
            const componentIndex = otherComponents.findIndex(comp => comp.id === component.id)
            const spanClass = component._renderSpan === 3 ? "col-span-3" :
                             component._renderSpan === 2 ? "col-span-2" : "col-span-1"

            return (
              <div key={component.id} className={spanClass}>
                <DraggableComponent
                  component={component}
                  index={componentIndex}
                  onSelectComponent={onSelectComponent}
                  onDeleteComponent={onDeleteComponent}
                  onDuplicateComponent={onDuplicateComponent}
                  onReorderComponents={onReorderComponents}
                  selectedComponentId={selectedComponentId}
                  previewMode={previewMode}
                  viewType={viewType}
                />
              </div>
            )
          })}
        </div>
      ))}

      {/* 表单底部按钮 - 居中显示（不包括审批按钮） */}
      {regularButtons.length > 0 && (
        <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200">
          {regularButtons.map((component, index) => (
            <div
              key={component.id}
              className={`${
                selectedComponentId === component.id && !previewMode ? "ring-2 ring-blue-500 rounded" : ""
              }`}
              onClick={() => !previewMode && onSelectComponent(component)}
            >
              <div className="flex items-center">
                <RenderComponent component={component} previewMode={previewMode} />
                {!previewMode && (
                  <div className="flex space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDuplicateComponent(component)
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-red-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteComponent(component.id)
                      }}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface RenderComponentProps {
  component: any
  previewMode: boolean
}

const RenderComponent: React.FC<RenderComponentProps> = ({ component, previewMode }) => {
  const [date, setDate] = useState<Date | undefined>()
  const [selectedValue, setSelectedValue] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalSelect = (selectedItems: any[]) => {
    if (selectedItems.length > 0) {
      if (component.props.multiSelect) {
        const displayText = selectedItems
          .map((item) => {
            const firstField = component.props.modalFields?.[0]
            return firstField ? item[firstField.id] : `项目${item.id}`
          })
          .join(", ")
        setSelectedValue(displayText)
      } else {
        const firstField = component.props.modalFields?.[0]
        const displayText = firstField ? selectedItems[0][firstField.id] : `项目${selectedItems[0].id}`
        setSelectedValue(displayText)
      }
    }
    setIsModalOpen(false)
  }

  const getModalWidth = (width: string) => {
    switch (width) {
      case "sm":
        return "max-w-md"
      case "md":
        return "max-w-2xl"
      case "lg":
        return "max-w-4xl"
      case "xl":
        return "max-w-6xl"
      default:
        return "max-w-2xl"
    }
  }

  switch (component.type) {
    case "text":
      return (
        <Input
          type={component.props.type || "text"}
          placeholder={component.props.placeholder}
          disabled={previewMode ? component.props.disabled : false}
          required={component.props.required}
          className="w-full"
        />
      )
    case "textarea":
      return (
        <div className="relative">
          <Input
            placeholder={component.props.placeholder}
            disabled={previewMode ? component.props.disabled : false}
            required={component.props.required}
            className="bg-gray-50 w-full"
          />
          {/* 三个小横线标识 */}
          <div className="absolute bottom-1 right-1 flex flex-col space-y-0.5 pointer-events-none">
            <div className="w-3 h-0.5 bg-gray-400"></div>
            <div className="w-3 h-0.5 bg-gray-400"></div>
            <div className="w-3 h-0.5 bg-gray-400"></div>
          </div>
        </div>
      )
    case "switch":
      return (
        <Switch
          defaultChecked={component.props.defaultChecked}
          disabled={previewMode ? component.props.disabled : false}
        />
      )
    case "select":
      return (
        <Select disabled={previewMode ? component.props.disabled : false}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={component.props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {component.props.options?.map((option: any) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    case "yesno":
      return (
        <Select disabled={previewMode ? component.props.disabled : false}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={component.props.placeholder || "请选择"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">是</SelectItem>
            <SelectItem value="no">否</SelectItem>
          </SelectContent>
        </Select>
      )
    case "datepicker":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              disabled={previewMode ? component.props.disabled : false}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : component.props.placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      )
    case "datetimepicker":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              disabled={previewMode ? component.props.disabled : false}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP HH:mm:ss") : component.props.placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <div className="p-3">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              <div className="mt-3 border-t pt-3">
                <div className="flex items-center space-x-2">
                  <Input
                    type="time"
                    step="1"
                    className="w-full"
                    onChange={(e) => {
                      if (date) {
                        const [hours, minutes, seconds] = e.target.value.split(':');
                        const newDate = new Date(date);
                        newDate.setHours(parseInt(hours) || 0);
                        newDate.setMinutes(parseInt(minutes) || 0);
                        newDate.setSeconds(parseInt(seconds) || 0);
                        setDate(newDate);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )
    case "button":
      return (
        <Button
          disabled={previewMode ? component.props.disabled : false}
          style={{ backgroundColor: component.props.color || "#1890ff" }}
          className="text-white"
        >
          {component.props.text}
        </Button>
      )
    case "modal":
      return (
        <div className="relative">
          <Input
            placeholder={component.props.placeholder || "点击选择..."}
            disabled={previewMode ? component.props.disabled : false}
            required={component.props.required}
            readOnly
            value={selectedValue}
            className="w-full"
          />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                disabled={previewMode ? component.props.disabled : false}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-search"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </Button>
            </DialogTrigger>
            <DialogContent className={`${getModalWidth(component.props.modalWidth || "md")} max-h-[80vh] p-0`}>
              <DialogHeader className="px-6 py-4 border-b">
                <DialogTitle>{component.props.title || "选择项目"}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-hidden">
                <ModalList
                  fields={component.props.modalFields || []}
                  multiSelect={component.props.multiSelect || false}
                  onSelect={handleModalSelect}
                  onClose={() => setIsModalOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )
    case "actionbar":
      return (
        <div className="flex space-x-2">
          {component.props.actions?.map((action: any, index: number) => (
            <Button
              key={index}
              variant={action.type === "danger" ? "destructive" : action.type === "primary" ? "default" : "outline"}
              size="sm"
              disabled={previewMode ? component.props.disabled : false}
            >
              {action.text}
            </Button>
          ))}
        </div>
      )
    case "approval-view-process":
    case "approval-revoke":
    case "approval-return":
    case "approval-custom":
      return (
        <Button
          disabled={previewMode ? component.props.disabled : false}
          style={{ backgroundColor: component.props.color || "#1890ff" }}
          className="text-white"
        >
          {component.props.text}
        </Button>
      )
    default:
      return <div>未知组件类型</div>
  }
}

export default FormPreview
