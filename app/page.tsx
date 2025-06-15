"use client"

import type React from "react"

import { useState, useRef } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Button } from "@/components/ui/button"
import { Download, Eye, Trash2, Plus, Info, Upload } from "lucide-react"
import ComponentSidebar from "@/components/component-sidebar"
import LayoutPreview from "@/components/layout-preview"
import PropertyPanel from "@/components/property-panel"
import { generateHtml } from "@/lib/html-generator"
import { parseHtmlFile } from "@/lib/html-parser"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { HelpDialog } from "@/components/help-dialog"

export interface LayoutItem {
  id: string
  name: string
  contentType: "form" | "list" | null
  components: any[]
}

export interface FormMetadata {
  templateName: string
  creationDate: string
  version: string
}

export interface AppState {
  layoutType: "tabs" | "accordion" | "flat" | null
  layoutItems: LayoutItem[]
  selectedItemId: string | null
  selectedComponent: any
  metadata: FormMetadata
}

export default function FormBuilder() {
  const [appState, setAppState] = useState<AppState>({
    layoutType: null,
    layoutItems: [],
    selectedItemId: null,
    selectedComponent: null,
    metadata: {
      templateName: "新建表单",
      creationDate: format(new Date(), "yyyy-MM-dd"),
      version: "1.0.0",
    },
  })
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleLayoutTypeChange = (layoutType: "tabs" | "accordion" | "flat") => {
    if (appState.layoutItems.length > 0) {
      // 如果已有布局项，则切换布局类型
      setAppState((prev) => ({
        ...prev,
        layoutType,
      }))
    } else {
      // 如果没有布局项，则创建新的
      const newItem: LayoutItem = {
        id: `item_${Date.now()}`,
        name: layoutType === "tabs" ? "标签页1" : layoutType === "accordion" ? "折叠项1" : "卡片1",
        contentType: null,
        components: [],
      }

      setAppState({
        ...appState,
        layoutType,
        layoutItems: [newItem],
        selectedItemId: newItem.id,
        selectedComponent: null,
      })
    }
  }

  const handleAddLayoutItem = () => {
    if (!appState.layoutType) return

    const newItem: LayoutItem = {
      id: `item_${Date.now()}`,
      name:
        appState.layoutType === "tabs"
          ? `标签页${appState.layoutItems.length + 1}`
          : appState.layoutType === "accordion"
            ? `折叠项${appState.layoutItems.length + 1}`
            : `卡片${appState.layoutItems.length + 1}`,
      contentType: null,
      components: [],
    }

    setAppState((prev) => ({
      ...prev,
      layoutItems: [...prev.layoutItems, newItem],
      selectedItemId: newItem.id,
    }))
  }

  const handleUpdateLayoutItem = (itemId: string, updates: Partial<LayoutItem>) => {
    setAppState((prev) => ({
      ...prev,
      layoutItems: prev.layoutItems.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    }))
  }

  const handleDeleteLayoutItem = (itemId: string) => {
    setAppState((prev) => ({
      ...prev,
      layoutItems: prev.layoutItems.filter((item) => item.id !== itemId),
      selectedItemId: prev.selectedItemId === itemId ? null : prev.selectedItemId,
    }))
  }

  const handleSelectLayoutItem = (itemId: string) => {
    setAppState((prev) => ({
      ...prev,
      selectedItemId: itemId,
      selectedComponent: null,
    }))
  }

  const handleAddComponent = (component: any, itemId: string) => {
    // 处理设置内容类型的特殊情况
    if (component.contentType) {
      handleUpdateLayoutItem(itemId, { contentType: component.contentType })
      return
    }

    const newComponent = {
      ...component,
      id: `${component.type}_${Date.now()}`,
      props: {
        label: `${component.label || component.type}`,
        required: false,
        disabled: false,
        ...component.props,
      },
    }

    setAppState((prev) => ({
      ...prev,
      layoutItems: prev.layoutItems.map((item) =>
        item.id === itemId ? { ...item, components: [...item.components, newComponent] } : item,
      ),
    }))
  }

  const handleSelectComponent = (component: any) => {
    setAppState((prev) => ({
      ...prev,
      selectedComponent: component,
    }))
  }

  const handleUpdateComponent = (itemId: string, componentId: string, props: any) => {
    setAppState((prev) => ({
      ...prev,
      layoutItems: prev.layoutItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              components: item.components.map((comp) =>
                comp.id === componentId ? { ...comp, props: { ...comp.props, ...props } } : comp,
              ),
            }
          : item,
      ),
    }))

    if (appState.selectedComponent && appState.selectedComponent.id === componentId) {
      setAppState((prev) => ({
        ...prev,
        selectedComponent: { ...prev.selectedComponent, props: { ...prev.selectedComponent.props, ...props } },
      }))
    }
  }

  const handleDeleteComponent = (itemId: string, componentId: string) => {
    setAppState((prev) => ({
      ...prev,
      layoutItems: prev.layoutItems.map((item) =>
        item.id === itemId ? { ...item, components: item.components.filter((comp) => comp.id !== componentId) } : item,
      ),
      selectedComponent:
        prev.selectedComponent && prev.selectedComponent.id === componentId ? null : prev.selectedComponent,
    }))
  }

  const handleDuplicateComponent = (itemId: string, component: any) => {
    const newComponent = {
      ...component,
      id: `${component.type}_${Date.now()}`,
    }

    setAppState((prev) => ({
      ...prev,
      layoutItems: prev.layoutItems.map((item) =>
        item.id === itemId ? { ...item, components: [...item.components, newComponent] } : item,
      ),
    }))
  }

  const handleChangeComponentType = (itemId: string, componentId: string, newType: string) => {
    setAppState((prev) => ({
      ...prev,
      layoutItems: prev.layoutItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              components: item.components.map((comp) =>
                comp.id === componentId ? createComponentWithNewType(comp, newType) : comp,
              ),
            }
          : item,
      ),
    }))

    // 如果当前选中的组件被修改了类型，也要更新选中状态
    if (appState.selectedComponent && appState.selectedComponent.id === componentId) {
      const updatedComponent = appState.layoutItems
        .find((item) => item.id === itemId)
        ?.components.find((comp) => comp.id === componentId)

      if (updatedComponent) {
        setAppState((prev) => ({
          ...prev,
          selectedComponent: createComponentWithNewType(updatedComponent, newType),
        }))
      }
    }
  }

  // 创建新类型组件的辅助函数
  const createComponentWithNewType = (originalComponent: any, newType: string) => {
    // 保留基本属性
    const baseProps = {
      label: originalComponent.props.label || `${getFieldTypeLabel(newType)}`,
      required: originalComponent.props.required || false,
      disabled: originalComponent.props.disabled || false,
    }

    // 根据新类型设置默认属性
    let typeSpecificProps = {}

    switch (newType) {
      case "text":
        typeSpecificProps = {
          type: "text",
          placeholder: originalComponent.props.placeholder || "请输入",
        }
        break
      case "textarea":
        typeSpecificProps = {
          placeholder: originalComponent.props.placeholder || "请输入",
        }
        break
      case "switch":
        typeSpecificProps = {
          defaultChecked: originalComponent.props.defaultChecked || false,
        }
        break
      case "select":
        typeSpecificProps = {
          placeholder: originalComponent.props.placeholder || "请选择",
          options: originalComponent.props.options || [
            { value: "option1", label: "选项1" },
            { value: "option2", label: "选项2" },
          ],
        }
        break
      case "yesno":
        typeSpecificProps = {
          placeholder: originalComponent.props.placeholder || "请选择",
        }
        break
      case "datepicker":
        typeSpecificProps = {
          placeholder: originalComponent.props.placeholder || "请选择日期",
        }
        break
      case "button":
        typeSpecificProps = {
          text: originalComponent.props.text || "按钮",
          color: originalComponent.props.color || "#1890ff",
        }
        break
      case "modal":
        typeSpecificProps = {
          placeholder: originalComponent.props.placeholder || "点击选择...",
          buttonText: originalComponent.props.buttonText || "打开选择",
          title: originalComponent.props.title || "选择项目",
        }
        break
      case "actionbar":
        typeSpecificProps = {
          actions: originalComponent.props.actions || [
            { text: "删除", type: "danger" },
            { text: "编辑", type: "primary" },
            { text: "查看", type: "default" },
          ],
        }
        break
      default:
        typeSpecificProps = {
          placeholder: "请输入",
        }
    }

    return {
      ...originalComponent,
      type: newType,
      props: {
        ...baseProps,
        ...typeSpecificProps,
      },
    }
  }

  // 获取字段类型标签的辅助函数
  const getFieldTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      text: "单行文本",
      textarea: "多行文本",
      switch: "开关",
      select: "下拉选择框",
      yesno: "是否下拉",
      datepicker: "日期选择器",
      button: "按钮",
      modal: "弹窗选择",
      actionbar: "操作栏",
    }
    return typeMap[type] || type
  }

  const handleReorderComponents = (itemId: string, dragIndex: number, hoverIndex: number) => {
    setAppState((prev) => ({
      ...prev,
      layoutItems: prev.layoutItems.map((item) => {
        if (item.id === itemId) {
          const newComponents = [...item.components]
          const dragComponent = newComponents[dragIndex]
          newComponents.splice(dragIndex, 1)
          newComponents.splice(hoverIndex, 0, dragComponent)
          return { ...item, components: newComponents }
        }
        return item
      }),
    }))
  }

  const handleImportFields = (itemId: string, fields: string[]) => {
    const newComponents = fields.map((field, index) => ({
      id: `text_${Date.now()}_${index}`,
      type: "text",
      props: {
        label: field,
        required: false,
        disabled: false,
        placeholder: "请输入",
        type: "text",
      },
    }))

    setAppState((prev) => ({
      ...prev,
      layoutItems: prev.layoutItems.map((item) =>
        item.id === itemId ? { ...item, components: [...item.components, ...newComponents] } : item,
      ),
    }))

    toast({
      title: "导入成功",
      description: `已成功导入 ${fields.length} 个字段`,
    })
  }

  const handleClearAll = () => {
    if (confirm("确定要清空所有内容吗？")) {
      setAppState({
        ...appState,
        layoutType: null,
        layoutItems: [],
        selectedItemId: null,
        selectedComponent: null,
      })
      toast({
        title: "已清空",
        description: "所有内容已被移除",
      })
    }
  }

  const handleExportHtml = () => {
    if (!appState.layoutType || appState.layoutItems.length === 0) {
      toast({
        title: "无法导出",
        description: "请先选择布局并添加内容",
        variant: "destructive",
      })
      return
    }

    const html = generateHtml(appState)
    const fileName = `${appState.metadata.templateName}-${appState.metadata.version}.html`

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "导出成功",
      description: `已成功导出HTML文件: ${fileName}`,
    })
  }

  const handleImportHtml = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".html")) {
      toast({
        title: "文件格式错误",
        description: "请选择HTML文件",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const htmlContent = e.target?.result as string
      const parsedState = parseHtmlFile(htmlContent)

      if (parsedState) {
        setAppState(parsedState)
        toast({
          title: "导入成功",
          description: "HTML文件已成功导入，可以继续编辑",
        })
      } else {
        toast({
          title: "导入失败",
          description: "无法解析HTML文件，请确保文件格式正确",
          variant: "destructive",
        })
      }
    }

    reader.readAsText(file)
    // 清空input值，允许重复选择同一文件
    event.target.value = ""
  }

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode)
  }

  const handleUpdateMetadata = (field: keyof FormMetadata, value: string) => {
    setAppState((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
    }))
  }

  const selectedLayoutItem = appState.layoutItems.find((item) => item.id === appState.selectedItemId)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* 隐藏的文件输入 */}
        <input ref={fileInputRef} type="file" accept=".html" onChange={handleFileChange} className="hidden" />

        {/* Left Sidebar - Component Selection */}
        {!previewMode && (
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
            <ComponentSidebar
              layoutType={appState.layoutType}
              selectedItemId={appState.selectedItemId}
              selectedLayoutItem={selectedLayoutItem}
              onAddComponent={handleAddComponent}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col min-w-0 ${previewMode ? "w-full" : ""}`}>
          {/* Top Toolbar */}
          <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h1 className="text-xl font-bold mr-2">表单生成器</h1>
                <HelpDialog />
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleImportHtml}>
                  <Upload className="h-4 w-4 mr-1" />
                  导入HTML
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  清空
                </Button>
                <Button variant="outline" size="sm" onClick={togglePreviewMode}>
                  <Eye className="h-4 w-4 mr-1" />
                  {previewMode ? "编辑" : "预览"}
                </Button>
                <Button variant="default" size="sm" onClick={handleExportHtml}>
                  <Download className="h-4 w-4 mr-1" />
                  导出HTML
                </Button>
              </div>
            </div>

            {/* 表单元数据 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">
                  模板名称
                </label>
                <Input
                  id="templateName"
                  value={appState.metadata.templateName}
                  onChange={(e) => handleUpdateMetadata("templateName", e.target.value)}
                  className="h-9"
                />
              </div>
              <div>
                <label htmlFor="creationDate" className="block text-sm font-medium text-gray-700 mb-1">
                  创建日期
                </label>
                <Input
                  id="creationDate"
                  type="date"
                  value={appState.metadata.creationDate}
                  onChange={(e) => handleUpdateMetadata("creationDate", e.target.value)}
                  className="h-9"
                />
              </div>
              <div>
                <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
                  版本号
                </label>
                <Input
                  id="version"
                  value={appState.metadata.version}
                  onChange={(e) => handleUpdateMetadata("version", e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            {/* Layout Type Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">布局类型：</span>
                <Select value={appState.layoutType || ""} onValueChange={handleLayoutTypeChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="选择布局" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tabs">标签布局</SelectItem>
                    <SelectItem value="accordion">折叠布局</SelectItem>
                    <SelectItem value="flat">平铺布局</SelectItem>
                  </SelectContent>
                </Select>
                {appState.layoutType && (
                  <Button variant="outline" size="sm" onClick={handleAddLayoutItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    添加
                    {appState.layoutType === "tabs"
                      ? "标签页"
                      : appState.layoutType === "accordion"
                        ? "折叠项"
                        : "卡片"}
                  </Button>
                )}
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <Info className="h-3 w-3 mr-1" />
                作者: xiaofeng.dai
              </div>
            </div>
          </div>

          {/* Layout Preview Area */}
          <div className="flex-1 overflow-hidden p-4 min-w-0">
            {!appState.layoutType ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-600 mb-2">欢迎使用表单生成器</h2>
                  <p className="text-gray-500 mb-4">请先在上方选择一个布局类型开始设计</p>
                  <Button variant="outline" onClick={handleImportHtml}>
                    <Upload className="h-4 w-4 mr-2" />
                    或导入现有HTML文件
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow h-full overflow-hidden flex flex-col">
                <div className="p-6 flex-1 overflow-auto min-w-0">
                  <LayoutPreview
                    appState={appState}
                    onSelectLayoutItem={handleSelectLayoutItem}
                    onUpdateLayoutItem={handleUpdateLayoutItem}
                    onDeleteLayoutItem={handleDeleteLayoutItem}
                    onSelectComponent={handleSelectComponent}
                    onDeleteComponent={handleDeleteComponent}
                    onDuplicateComponent={handleDuplicateComponent}
                    onReorderComponents={handleReorderComponents}
                    onImportFields={handleImportFields}
                    previewMode={previewMode}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Property Configuration */}
        {!previewMode && (appState.selectedComponent || selectedLayoutItem) && (
          <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
            <PropertyPanel
              selectedComponent={appState.selectedComponent}
              selectedLayoutItem={selectedLayoutItem}
              onUpdateComponent={(componentId, props) => {
                if (appState.selectedItemId) {
                  handleUpdateComponent(appState.selectedItemId, componentId, props)
                }
              }}
              onUpdateLayoutItem={(itemId, updates) => handleUpdateLayoutItem(itemId, updates)}
              onChangeComponentType={(componentId, newType) => {
                if (appState.selectedItemId) {
                  handleChangeComponentType(appState.selectedItemId, componentId, newType)
                }
              }}
            />
          </div>
        )}
      </div>
    </DndProvider>
  )
}
