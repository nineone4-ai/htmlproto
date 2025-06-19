"use client"

import type React from "react"
import { useDrag } from "react-dnd"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  FormInput,
  Type,
  AlignLeft,
  ToggleLeft,
  List,
  Calendar,
  Clock,
  BoxIcon as ButtonIcon,
  Maximize2,
  ListFilter,
  Settings,
  CheckCircle,
  FileCheck,
} from "lucide-react"
import type { LayoutItem } from "@/app/page"

const fieldComponents = [
  {
    type: "text",
    icon: <Type className="h-4 w-4 mr-2" />,
    label: "单行文本",
    props: {
      type: "text",
      placeholder: "请输入",
    },
  },
  {
    type: "textarea",
    icon: <AlignLeft className="h-4 w-4 mr-2" />,
    label: "多行文本",
    props: {
      placeholder: "请输入",
    },
  },
  {
    type: "switch",
    icon: <ToggleLeft className="h-4 w-4 mr-2" />,
    label: "开关",
    props: {
      defaultChecked: false,
    },
  },
  {
    type: "select",
    icon: <List className="h-4 w-4 mr-2" />,
    label: "下拉选择框",
    props: {
      options: [
        { value: "option1", label: "选项1" },
        { value: "option2", label: "选项2" },
        { value: "option3", label: "选项3" },
      ],
      placeholder: "请选择",
    },
  },
  {
    type: "yesno",
    icon: <CheckCircle className="h-4 w-4 mr-2" />,
    label: "是否下拉",
    props: {
      placeholder: "请选择",
    },
  },
  {
    type: "datepicker",
    icon: <Calendar className="h-4 w-4 mr-2" />,
    label: "日期选择器",
    props: {
      placeholder: "请选择日期",
    },
  },
  {
    type: "datetimepicker",
    icon: <Clock className="h-4 w-4 mr-2" />,
    label: "时间选择器",
    props: {
      placeholder: "请选择日期时间",
      showTime: true,
    },
  },
  {
    type: "button",
    icon: <ButtonIcon className="h-4 w-4 mr-2" />,
    label: "按钮",
    props: {
      text: "按钮",
      color: "#1890ff",
    },
  },
  {
    type: "modal",
    icon: <Maximize2 className="h-4 w-4 mr-2" />,
    label: "弹窗选择",
    props: {
      buttonText: "打开选择",
      title: "选择项目",
      placeholder: "点击选择...",
    },
  },
  {
    type: "actionbar",
    icon: <Settings className="h-4 w-4 mr-2" />,
    label: "操作栏",
    props: {
      actions: [
        { text: "删除", type: "danger" },
        { text: "编辑", type: "primary" },
        { text: "查看", type: "default" },
      ],
    },
  },
]

// 默认按钮组件
const defaultButtons = [
  { text: "上一步", color: "#6c757d" },
  { text: "下一步", color: "#1890ff" },
  { text: "保存", color: "#52c41a" },
  { text: "提交", color: "#1890ff" },
  { text: "发布", color: "#722ed1" },
  { text: "删除", color: "#ff4d4f" },
  { text: "返回", color: "#6c757d" },
  { text: "添加", color: "#1890ff" },
]

interface DraggableComponentProps {
  component: any
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({ component }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "COMPONENT",
    item: component,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`flex items-center p-2 mb-2 rounded cursor-move border border-gray-200 hover:bg-gray-50 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {component.icon}
      <span>{component.label}</span>
    </div>
  )
}

interface ComponentSidebarProps {
  layoutType: "tabs" | "accordion" | "flat" | null
  selectedItemId: string | null
  selectedLayoutItem: LayoutItem | undefined
  onAddComponent: (component: any, itemId: string) => void
}

const ComponentSidebar: React.FC<ComponentSidebarProps> = ({
  layoutType,
  selectedItemId,
  selectedLayoutItem,
  onAddComponent,
}) => {
  if (!layoutType) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">组件</h2>
        <p className="text-gray-500 text-sm">请先选择布局类型</p>
      </div>
    )
  }

  if (!selectedItemId || !selectedLayoutItem) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">组件</h2>
        <p className="text-gray-500 text-sm">
          请先选择一个{layoutType === "tabs" ? "标签页" : layoutType === "accordion" ? "折叠项" : "卡片"}
        </p>
      </div>
    )
  }

  if (!selectedLayoutItem.contentType) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">组件</h2>
        <p className="text-gray-500 text-sm mb-4">请先为当前项设置内容类型</p>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddComponent({ contentType: "form" }, selectedItemId)}
          >
            <FormInput className="h-4 w-4 mr-2" />
            表单
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddComponent({ contentType: "list" }, selectedItemId)}
          >
            <ListFilter className="h-4 w-4 mr-2" />
            列表
          </Button>
        </div>
      </div>
    )
  }

  // 根据内容类型过滤可用组件
  const availableComponents = fieldComponents.filter((component) => {
    if (component.type === "actionbar") {
      return selectedLayoutItem.contentType === "list"
    }
    return true
  })

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">组件</h2>
      <div className="mb-4 p-2 bg-blue-50 rounded text-sm">
        当前：{selectedLayoutItem.name} ({selectedLayoutItem.contentType === "form" ? "表单" : "列表"})
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="fields">
          <AccordionTrigger className="py-2">
            <div className="flex items-center">
              <Type className="h-4 w-4 mr-2" />
              <span>字段组件</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-2">
              {availableComponents.map((component) => (
                <div
                  key={component.type}
                  onClick={() => onAddComponent(component, selectedItemId)}
                  className="cursor-pointer"
                >
                  <DraggableComponent component={component} />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="buttons">
          <AccordionTrigger className="py-2">
            <div className="flex items-center">
              <ButtonIcon className="h-4 w-4 mr-2" />
              <span>默认按钮</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {defaultButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() =>
                    onAddComponent(
                      {
                        type: "button",
                        icon: <ButtonIcon className="h-4 w-4 mr-2" />,
                        label: button.text,
                        props: {
                          text: button.text,
                          color: button.color,
                        },
                      },
                      selectedItemId,
                    )
                  }
                >
                  {button.text}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="approval">
          <AccordionTrigger className="py-2">
            <div className="flex items-center">
              <FileCheck className="h-4 w-4 mr-2" />
              <span>审批按钮</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="mt-2 space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  onAddComponent(
                    {
                      type: "approval-view-process",
                      icon: <FileCheck className="h-4 w-4 mr-2" />,
                      label: "查看流程",
                      props: {
                        text: "查看流程",
                        type: "default",
                        position: "top-right",
                      },
                    },
                    selectedItemId,
                  )
                }
              >
                查看流程
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  onAddComponent(
                    {
                      type: "approval-revoke",
                      icon: <FileCheck className="h-4 w-4 mr-2" />,
                      label: "撤销审批",
                      props: {
                        text: "撤销审批",
                        type: "warning",
                        position: "top-right",
                      },
                    },
                    selectedItemId,
                  )
                }
              >
                撤销审批
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  onAddComponent(
                    {
                      type: "approval-return",
                      icon: <FileCheck className="h-4 w-4 mr-2" />,
                      label: "返回",
                      props: {
                        text: "返回",
                        type: "default",
                        position: "top-right",
                      },
                    },
                    selectedItemId,
                  )
                }
              >
                返回
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  onAddComponent(
                    {
                      type: "approval-custom",
                      icon: <FileCheck className="h-4 w-4 mr-2" />,
                      label: "自定义按钮",
                      props: {
                        text: "自定义按钮",
                        type: "primary",
                        position: "top-right",
                      },
                    },
                    selectedItemId,
                  )
                }
              >
                自定义按钮
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default ComponentSidebar
