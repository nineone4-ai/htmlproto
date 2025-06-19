"use client"

import React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash, Import } from "lucide-react"
import type { LayoutItem } from "@/app/page"
import { ImportFieldsDialog } from "./import-fields-dialog"

interface PropertyPanelProps {
  selectedComponent: any
  selectedLayoutItem: LayoutItem | undefined
  onUpdateComponent: (componentId: string, props: any) => void
  onUpdateLayoutItem: (itemId: string, updates: Partial<LayoutItem>) => void
  onChangeComponentType: (componentId: string, newType: string) => void
}

// 字段类型选项
const fieldTypes = [
  { value: "text", label: "单行文本" },
  { value: "textarea", label: "多行文本" },
  { value: "switch", label: "开关" },
  { value: "select", label: "下拉选择框" },
  { value: "yesno", label: "是否下拉" },
  { value: "datepicker", label: "日期选择器" },
  { value: "datetimepicker", label: "时间选择器" },
  { value: "button", label: "按钮" },
  { value: "modal", label: "弹窗选择" },
  { value: "actionbar", label: "操作栏" },
  { value: "approval-view-process", label: "查看流程" },
  { value: "approval-revoke", label: "撤销审批" },
  { value: "approval-return", label: "返回" },
  { value: "approval-custom", label: "自定义按钮" },
]

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedComponent,
  selectedLayoutItem,
  onUpdateComponent,
  onUpdateLayoutItem,
  onChangeComponentType,
}) => {
  const [options, setOptions] = useState(selectedComponent?.props?.options || [])
  const [actions, setActions] = useState(selectedComponent?.props?.actions || [])
  const [modalFields, setModalFields] = useState(selectedComponent?.props?.modalFields || [])

  const handleComponentChange = (key: string, value: any) => {
    if (selectedComponent) {
      onUpdateComponent(selectedComponent.id, { [key]: value })
    }
  }

  const handleLayoutItemChange = (key: string, value: any) => {
    if (selectedLayoutItem) {
      onUpdateLayoutItem(selectedLayoutItem.id, { [key]: value })
    }
  }

  const handleTypeChange = (newType: string) => {
    if (selectedComponent && selectedComponent.type !== newType) {
      onChangeComponentType(selectedComponent.id, newType)
    }
  }

  const handleAddOption = () => {
    const newOption = {
      value: `option${options.length + 1}`,
      label: `选项${options.length + 1}`,
    }
    const newOptions = [...options, newOption]
    setOptions(newOptions)
    handleComponentChange("options", newOptions)
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
    handleComponentChange("options", newOptions)
  }

  const handleUpdateOption = (index: number, key: string, value: string) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [key]: value }
    setOptions(newOptions)
    handleComponentChange("options", newOptions)
  }

  const handleAddAction = () => {
    const newAction = {
      text: `按钮${actions.length + 1}`,
      type: "default",
    }
    const newActions = [...actions, newAction]
    setActions(newActions)
    handleComponentChange("actions", newActions)
  }

  const handleRemoveAction = (index: number) => {
    const newActions = actions.filter((_, i) => i !== index)
    setActions(newActions)
    handleComponentChange("actions", newActions)
  }

  const handleUpdateAction = (index: number, key: string, value: string) => {
    const newActions = [...actions]
    newActions[index] = { ...newActions[index], [key]: value }
    setActions(newActions)
    handleComponentChange("actions", newActions)
  }

  // 弹窗字段管理
  const handleAddModalField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      name: `字段${modalFields.length + 1}`,
      type: "text",
      width: "auto",
    }
    const newFields = [...modalFields, newField]
    setModalFields(newFields)
    handleComponentChange("modalFields", newFields)
  }

  const handleRemoveModalField = (index: number) => {
    const newFields = modalFields.filter((_, i) => i !== index)
    setModalFields(newFields)
    handleComponentChange("modalFields", newFields)
  }

  const handleUpdateModalField = (index: number, key: string, value: string) => {
    const newFields = [...modalFields]
    newFields[index] = { ...newFields[index], [key]: value }
    setModalFields(newFields)
    handleComponentChange("modalFields", newFields)
  }

  const handleImportModalFields = (fields: string[]) => {
    const newFields = fields.map((field, index) => ({
      id: `field_${Date.now()}_${index}`,
      name: field,
      type: "text",
      width: "auto",
    }))
    const updatedFields = [...modalFields, ...newFields]
    setModalFields(updatedFields)
    handleComponentChange("modalFields", updatedFields)
  }

  // 当选中的组件改变时，更新本地状态
  React.useEffect(() => {
    if (selectedComponent) {
      setOptions(selectedComponent.props?.options || [])
      setActions(selectedComponent.props?.actions || [])
      setModalFields(selectedComponent.props?.modalFields || [])
    }
  }, [selectedComponent])

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">属性设置</h3>

      {/* Layout Item Properties */}
      {selectedLayoutItem && !selectedComponent && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">布局项设置</h4>

          <div className="space-y-2">
            <Label htmlFor="itemName">名称</Label>
            <Input
              id="itemName"
              value={selectedLayoutItem.name || ""}
              onChange={(e) => handleLayoutItemChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentType">内容类型</Label>
            <Select
              value={selectedLayoutItem.contentType || ""}
              onValueChange={(value) => handleLayoutItemChange("contentType", value)}
            >
              <SelectTrigger id="contentType">
                <SelectValue placeholder="选择内容类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="form">表单</SelectItem>
                <SelectItem value="list">列表</SelectItem>
                <SelectItem value="checklist">复选框列表</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Component Properties */}
      {selectedComponent && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">组件设置</h4>

          {/* 字段类型选择器 */}
          <div className="space-y-2">
            <Label htmlFor="componentType">字段类型</Label>
            <Select value={selectedComponent.type} onValueChange={handleTypeChange}>
              <SelectTrigger id="componentType">
                <SelectValue placeholder="选择字段类型" />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">更改字段类型会重置部分属性设置</p>
          </div>

          {/* Common Properties */}
          {!(selectedComponent.type === "approval-view-process" ||
            selectedComponent.type === "approval-revoke" ||
            selectedComponent.type === "approval-return" ||
            selectedComponent.type === "approval-custom") && (
            <div className="space-y-2">
              <Label htmlFor="label">标签名称</Label>
              <Input
                id="label"
                value={selectedComponent.props.label || ""}
                onChange={(e) => handleComponentChange("label", e.target.value)}
              />
            </div>
          )}

          {/* Type specific properties */}
          {selectedComponent.type === "text" && (
            <div className="space-y-2">
              <Label htmlFor="type">输入类型</Label>
              <Select
                value={selectedComponent.props.type || "text"}
                onValueChange={(value) => handleComponentChange("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">文本</SelectItem>
                  <SelectItem value="password">密码</SelectItem>
                  <SelectItem value="email">邮箱</SelectItem>
                  <SelectItem value="number">数字</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {(selectedComponent.type === "text" ||
            selectedComponent.type === "textarea" ||
            selectedComponent.type === "select" ||
            selectedComponent.type === "yesno" ||
            selectedComponent.type === "datepicker") && (
            <div className="space-y-2">
              <Label htmlFor="placeholder">占位文本</Label>
              <Input
                id="placeholder"
                value={selectedComponent.props.placeholder || ""}
                onChange={(e) => handleComponentChange("placeholder", e.target.value)}
              />
            </div>
          )}

          {(selectedComponent.type === "button" ||
            selectedComponent.type === "approval-view-process" ||
            selectedComponent.type === "approval-revoke" ||
            selectedComponent.type === "approval-return" ||
            selectedComponent.type === "approval-custom") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="text">按钮文本</Label>
                <Input
                  id="text"
                  value={selectedComponent.props.text || ""}
                  onChange={(e) => handleComponentChange("text", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonType">按钮类型</Label>
                <Select
                  value={selectedComponent.props.type || "default"}
                  onValueChange={(value) => handleComponentChange("type", value)}
                >
                  <SelectTrigger id="buttonType">
                    <SelectValue placeholder="选择按钮类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">默认</SelectItem>
                    <SelectItem value="primary">主要</SelectItem>
                    <SelectItem value="warning">警告</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">按钮颜色</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="color"
                    type="color"
                    value={selectedComponent.props.color || "#1890ff"}
                    onChange={(e) => handleComponentChange("color", e.target.value)}
                    className="w-12 h-8 p-1 border rounded"
                  />
                  <Input
                    value={selectedComponent.props.color || "#1890ff"}
                    onChange={(e) => handleComponentChange("color", e.target.value)}
                    placeholder="#1890ff"
                    className="flex-1"
                  />
                </div>
              </div>
            </>
          )}

          {selectedComponent.type === "modal" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="placeholder">占位文本</Label>
                <Input
                  id="placeholder"
                  value={selectedComponent.props.placeholder || ""}
                  onChange={(e) => handleComponentChange("placeholder", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonText">按钮文本</Label>
                <Input
                  id="buttonText"
                  value={selectedComponent.props.buttonText || ""}
                  onChange={(e) => handleComponentChange("buttonText", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">弹窗标题</Label>
                <Input
                  id="title"
                  value={selectedComponent.props.title || ""}
                  onChange={(e) => handleComponentChange("title", e.target.value)}
                />
              </div>

              {/* 弹窗列表字段配置 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>弹窗列表字段</Label>
                  <div className="flex space-x-2">
                    <ImportFieldsDialog
                      onImportFields={handleImportModalFields}
                      trigger={
                        <Button variant="outline" size="sm" className="h-8">
                          <Import className="h-4 w-4 mr-1" />
                          导入
                        </Button>
                      }
                    />
                    <Button variant="outline" size="sm" onClick={handleAddModalField} className="h-8">
                      <Plus className="h-4 w-4 mr-1" />
                      添加字段
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                  {modalFields.map((field: any, index: number) => (
                    <div key={field.id} className="flex items-center space-x-2 p-2 border rounded">
                      <Input
                        value={field.name}
                        onChange={(e) => handleUpdateModalField(index, "name", e.target.value)}
                        placeholder="字段名称"
                        className="flex-1"
                      />
                      <Select
                        value={field.type}
                        onValueChange={(value) => handleUpdateModalField(index, "type", value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">文本</SelectItem>
                          <SelectItem value="number">数字</SelectItem>
                          <SelectItem value="date">日期</SelectItem>
                          <SelectItem value="status">状态</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveModalField(index)}
                        className="h-8 w-8 text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {modalFields.length === 0 && (
                    <div className="text-center py-4 text-gray-500 text-sm">暂无字段，请添加或导入字段</div>
                  )}
                </div>
              </div>

              {/* 弹窗设置 */}
              <div className="space-y-2">
                <Label htmlFor="modalWidth">弹窗宽度</Label>
                <Select
                  value={selectedComponent.props.modalWidth || "md"}
                  onValueChange={(value) => handleComponentChange("modalWidth", value)}
                >
                  <SelectTrigger id="modalWidth">
                    <SelectValue placeholder="选择弹窗宽度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">小 (400px)</SelectItem>
                    <SelectItem value="md">中 (600px)</SelectItem>
                    <SelectItem value="lg">大 (800px)</SelectItem>
                    <SelectItem value="xl">超大 (1000px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="multiSelect">多选模式</Label>
                <Switch
                  id="multiSelect"
                  checked={selectedComponent.props.multiSelect || false}
                  onCheckedChange={(checked) => handleComponentChange("multiSelect", checked)}
                />
              </div>
            </>
          )}

          {selectedComponent.type === "select" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>选项列表</Label>
                <Button variant="outline" size="sm" onClick={handleAddOption} className="h-8">
                  <Plus className="h-4 w-4 mr-1" />
                  添加选项
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {options.map((option: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option.label}
                      onChange={(e) => handleUpdateOption(index, "label", e.target.value)}
                      placeholder="选项名称"
                      className="flex-1"
                    />
                    <Input
                      value={option.value}
                      onChange={(e) => handleUpdateOption(index, "value", e.target.value)}
                      placeholder="选项值"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      className="h-8 w-8 text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedComponent.type === "actionbar" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>操作按钮</Label>
                <Button variant="outline" size="sm" onClick={handleAddAction} className="h-8">
                  <Plus className="h-4 w-4 mr-1" />
                  添加按钮
                </Button>
              </div>
              <div className="space-y-2 mt-2">
                {actions.map((action: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                    <Input
                      value={action.text}
                      onChange={(e) => handleUpdateAction(index, "text", e.target.value)}
                      placeholder="按钮文本"
                      className="flex-1"
                    />
                    <Select value={action.type} onValueChange={(value) => handleUpdateAction(index, "type", value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">默认</SelectItem>
                        <SelectItem value="primary">主要</SelectItem>
                        <SelectItem value="danger">危险</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAction(index)}
                      className="h-8 w-8 text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Switch specific properties */}
          {selectedComponent.type === "switch" && (
            <div className="flex items-center justify-between">
              <Label htmlFor="defaultChecked">默认选中</Label>
              <Switch
                id="defaultChecked"
                checked={selectedComponent.props.defaultChecked || false}
                onCheckedChange={(checked) => handleComponentChange("defaultChecked", checked)}
              />
            </div>
          )}

          {/* Layout Properties for form fields */}
          {!(selectedComponent.type === "button" ||
            selectedComponent.type === "approval-view-process" ||
            selectedComponent.type === "approval-revoke" ||
            selectedComponent.type === "approval-return" ||
            selectedComponent.type === "approval-custom" ||
            selectedComponent.type === "actionbar") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="columnSpan">栅栏宽度</Label>
                <Select
                  value={selectedComponent.props.columnSpan?.toString() || "1"}
                  onValueChange={(value) => handleComponentChange("columnSpan", parseInt(value))}
                >
                  <SelectTrigger id="columnSpan">
                    <SelectValue placeholder="选择栅栏宽度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1栅栏 (1/3宽度)</SelectItem>
                    <SelectItem value="2">2栅栏 (2/3宽度)</SelectItem>
                    <SelectItem value="3">3栅栏 (全宽度)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="fullWidth">独立一行</Label>
                <Switch
                  id="fullWidth"
                  checked={selectedComponent.props.fullWidth || false}
                  onCheckedChange={(checked) => handleComponentChange("fullWidth", checked)}
                />
              </div>
            </>
          )}

          {/* Common Properties for most field types */}
          {selectedComponent.type !== "actionbar" && (
            <>
              <div className="flex items-center justify-between">
                <Label htmlFor="disabled">
                  {(selectedComponent.type === "button" ||
                    selectedComponent.type === "approval-view-process" ||
                    selectedComponent.type === "approval-revoke" ||
                    selectedComponent.type === "approval-return" ||
                    selectedComponent.type === "approval-custom") ? "禁用按钮" : "禁用编辑"}
                </Label>
                <Switch
                  id="disabled"
                  checked={selectedComponent.props.disabled || false}
                  onCheckedChange={(checked) => handleComponentChange("disabled", checked)}
                />
              </div>

              {/* 审批按钮不需要必填项设置 */}
              {!(selectedComponent.type === "approval-view-process" ||
                selectedComponent.type === "approval-revoke" ||
                selectedComponent.type === "approval-return" ||
                selectedComponent.type === "approval-custom") && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="required">必填项</Label>
                  <Switch
                    id="required"
                    checked={selectedComponent.props.required || false}
                    onCheckedChange={(checked) => handleComponentChange("required", checked)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default PropertyPanel
