"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

interface HelpDialogProps {
  trigger?: React.ReactNode
}

export function HelpDialog({ trigger }: HelpDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger || (
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">帮助</span>
        </Button>
      )}
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">表单生成器使用说明</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="zh">
          <TabsList className="mb-4">
            <TabsTrigger value="zh">中文</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
          </TabsList>
          <TabsContent value="zh" className="space-y-4">
            <h2 className="text-lg font-semibold">快速入门</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>选择布局类型</strong>：在顶部工具栏选择"标签布局"、"折叠布局"或"平铺布局"。
              </li>
              <li>
                <strong>添加布局项</strong>：点击"添加标签页/折叠项/卡片"按钮添加新的布局项。
              </li>
              <li>
                <strong>设置内容类型</strong>：选择布局项后，在左侧面板选择"表单"或"列表"作为内容类型。
              </li>
              <li>
                <strong>添加组件</strong>：从左侧组件面板中选择需要的字段组件，添加到布局项中。
              </li>
              <li>
                <strong>配置属性</strong>：点击组件后，在右侧属性面板中设置组件的属性。
              </li>
              <li>
                <strong>预览</strong>：点击顶部工具栏的"预览"按钮查看表单效果。
              </li>
              <li>
                <strong>导出HTML</strong>：点击"导出HTML"按钮将表单导出为HTML文件。
              </li>
            </ol>

            <h2 className="text-lg font-semibold mt-6">布局类型</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>标签布局</strong>：创建带有多个标签页的表单，用户可以在不同标签页之间切换。
              </li>
              <li>
                <strong>折叠布局</strong>：创建可折叠的内容区域，用户可以展开或折叠不同部分。
              </li>
              <li>
                <strong>平铺布局</strong>：将所有内容平铺显示，适合简单的表单。
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">内容类型</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>表单</strong>：创建用于数据输入的表单，字段以网格形式排列。
              </li>
              <li>
                <strong>列表</strong>：创建表格形式的列表，适合数据展示和操作。
                <ul className="list-circle pl-5 mt-1">
                  <li>列表视图支持横向滚动和列宽调整</li>
                  <li>拖动列头部边缘可调整列宽</li>
                </ul>
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">可用组件</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>单行文本</strong>：用于输入短文本，可设置为不同类型（文本、密码、邮箱、数字）。
              </li>
              <li>
                <strong>多行文本</strong>：用于输入长文本。
              </li>
              <li>
                <strong>开关</strong>：开/关切换控件。
              </li>
              <li>
                <strong>下拉选择框</strong>：从预定义选项中选择一项。
              </li>
              <li>
                <strong>是否下拉</strong>：简化的是/否选择控件。
              </li>
              <li>
                <strong>日期选择器</strong>：选择日期。
              </li>
              <li>
                <strong>按钮</strong>：可自定义文本和颜色的按钮。
              </li>
              <li>
                <strong>弹窗选择</strong>：打开弹窗进行选择。
              </li>
              <li>
                <strong>操作栏</strong>：在列表中显示操作按钮组。
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">表单元数据</h2>
            <p>您可以在顶部设置表单的基本信息：</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>模板名称</strong>：表单的名称，将用于导出的HTML文件名。
              </li>
              <li>
                <strong>创建日期</strong>：表单的创建日期。
              </li>
              <li>
                <strong>版本号</strong>：表单的版本号，将与模板名称一起用于导出的HTML文件名。
              </li>
            </ul>

            <div className="mt-8 text-sm text-gray-500">
              <p>表单生成器 v1.0.0 | 作者: xiaofeng.dai</p>
            </div>
          </TabsContent>

          <TabsContent value="en" className="space-y-4">
            <h2 className="text-lg font-semibold">Quick Start</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Choose a layout type</strong>: Select "Tab Layout", "Accordion Layout", or "Flat Layout" from
                the top toolbar.
              </li>
              <li>
                <strong>Add layout items</strong>: Click the "Add Tab/Accordion Item/Card" button to add new layout
                items.
              </li>
              <li>
                <strong>Set content type</strong>: After selecting a layout item, choose "Form" or "List" as the content
                type in the left panel.
              </li>
              <li>
                <strong>Add components</strong>: Select field components from the left panel and add them to your layout
                item.
              </li>
              <li>
                <strong>Configure properties</strong>: Click on a component to configure its properties in the right
                panel.
              </li>
              <li>
                <strong>Preview</strong>: Click the "Preview" button in the top toolbar to see how your form looks.
              </li>
              <li>
                <strong>Export HTML</strong>: Click the "Export HTML" button to export your form as an HTML file.
              </li>
            </ol>

            <h2 className="text-lg font-semibold mt-6">Layout Types</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Tab Layout</strong>: Create a form with multiple tabs that users can switch between.
              </li>
              <li>
                <strong>Accordion Layout</strong>: Create collapsible content areas that users can expand or collapse.
              </li>
              <li>
                <strong>Flat Layout</strong>: Display all content in a flat structure, suitable for simple forms.
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">Content Types</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Form</strong>: Create a form for data input with fields arranged in a grid.
              </li>
              <li>
                <strong>List</strong>: Create a table-style list suitable for data display and operations.
                <ul className="list-circle pl-5 mt-1">
                  <li>List view supports horizontal scrolling and column width adjustment</li>
                  <li>Drag the edge of column headers to adjust column width</li>
                </ul>
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">Available Components</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Single Line Text</strong>: For short text input, can be set to different types (text, password,
                email, number).
              </li>
              <li>
                <strong>Multi-line Text</strong>: For longer text input.
              </li>
              <li>
                <strong>Switch</strong>: On/off toggle control.
              </li>
              <li>
                <strong>Dropdown Select</strong>: Select one option from predefined choices.
              </li>
              <li>
                <strong>Yes/No Dropdown</strong>: Simplified yes/no selection control.
              </li>
              <li>
                <strong>Date Picker</strong>: Select a date.
              </li>
              <li>
                <strong>Button</strong>: Button with customizable text and color.
              </li>
              <li>
                <strong>Modal Selection</strong>: Open a modal dialog for selection.
              </li>
              <li>
                <strong>Action Bar</strong>: Display action buttons in a list.
              </li>
            </ul>

            <h2 className="text-lg font-semibold mt-6">Form Metadata</h2>
            <p>You can set basic information for your form at the top:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Template Name</strong>: The name of your form, which will be used for the exported HTML
                filename.
              </li>
              <li>
                <strong>Creation Date</strong>: The date the form was created.
              </li>
              <li>
                <strong>Version Number</strong>: The version number of your form, which will be used along with the
                template name for the exported HTML filename.
              </li>
            </ul>

            <div className="mt-8 text-sm text-gray-500">
              <p>Form Builder v1.0.0 | Author: xiaofeng.dai</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
