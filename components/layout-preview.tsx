"use client"

import type React from "react"
import { useDrop } from "react-dnd"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import FormPreview from "@/components/form-preview"
import type { AppState, LayoutItem } from "@/app/page"

interface LayoutPreviewProps {
  appState: AppState
  onSelectLayoutItem: (itemId: string) => void
  onUpdateLayoutItem: (itemId: string, updates: Partial<LayoutItem>) => void
  onDeleteLayoutItem: (itemId: string) => void
  onSelectComponent: (component: any) => void
  onDeleteComponent: (itemId: string, componentId: string) => void
  onDuplicateComponent: (itemId: string, component: any) => void
  onReorderComponents: (itemId: string, dragIndex: number, hoverIndex: number) => void
  onImportFields: (itemId: string, fields: string[]) => void
  previewMode: boolean
}

const LayoutPreview: React.FC<LayoutPreviewProps> = ({
  appState,
  onSelectLayoutItem,
  onUpdateLayoutItem,
  onDeleteLayoutItem,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onReorderComponents,
  onImportFields,
  previewMode,
}) => {
  const { layoutType, layoutItems, selectedItemId } = appState

  const handleSetContentType = (itemId: string, contentType: "form" | "list") => {
    onUpdateLayoutItem(itemId, { contentType })
  }

  if (layoutItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          暂无内容，请添加{layoutType === "tabs" ? "标签页" : layoutType === "accordion" ? "折叠项" : "卡片"}
        </p>
      </div>
    )
  }

  if (layoutType === "tabs") {
    return (
      <Tabs value={selectedItemId || layoutItems[0]?.id} onValueChange={onSelectLayoutItem}>
        <TabsList className="flex w-full">
          {layoutItems.map((item) => (
            <TabsTrigger key={item.id} value={item.id} className="relative group flex-1">
              {item.name}
              {!previewMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteLayoutItem(item.id)
                  }}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {layoutItems.map((item) => (
          <TabsContent key={item.id} value={item.id} className="mt-4">
            <LayoutItemContent
              item={item}
              isSelected={selectedItemId === item.id}
              onSetContentType={handleSetContentType}
              onSelectComponent={onSelectComponent}
              onDeleteComponent={onDeleteComponent}
              onDuplicateComponent={onDuplicateComponent}
              onReorderComponents={onReorderComponents}
              onImportFields={onImportFields}
              previewMode={previewMode}
            />
          </TabsContent>
        ))}
      </Tabs>
    )
  }

  if (layoutType === "accordion") {
    return (
      <Accordion
        type="single"
        collapsible
        value={selectedItemId || layoutItems[0]?.id}
        onValueChange={onSelectLayoutItem}
      >
        {layoutItems.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <span>{item.name}</span>
                {!previewMode && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteLayoutItem(item.id)
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <LayoutItemContent
                item={item}
                isSelected={selectedItemId === item.id}
                onSetContentType={handleSetContentType}
                onSelectComponent={onSelectComponent}
                onDeleteComponent={onDeleteComponent}
                onDuplicateComponent={onDuplicateComponent}
                onReorderComponents={onReorderComponents}
                onImportFields={onImportFields}
                previewMode={previewMode}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  if (layoutType === "flat") {
    return (
      <div className="flex flex-col space-y-4 h-full">
        {layoutItems.map((item) => (
          <Card
            key={item.id}
            className={`cursor-pointer transition-all flex-1 ${selectedItemId === item.id ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => !previewMode && onSelectLayoutItem(item.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                {!previewMode && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteLayoutItem(item.id)
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <LayoutItemContent
                item={item}
                isSelected={selectedItemId === item.id}
                onSetContentType={handleSetContentType}
                onSelectComponent={onSelectComponent}
                onDeleteComponent={onDeleteComponent}
                onDuplicateComponent={onDuplicateComponent}
                onReorderComponents={onReorderComponents}
                onImportFields={onImportFields}
                previewMode={previewMode}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return null
}

interface LayoutItemContentProps {
  item: LayoutItem
  isSelected: boolean
  onSetContentType: (itemId: string, contentType: "form" | "list") => void
  onSelectComponent: (component: any) => void
  onDeleteComponent: (itemId: string, componentId: string) => void
  onDuplicateComponent: (itemId: string, component: any) => void
  onReorderComponents: (itemId: string, dragIndex: number, hoverIndex: number) => void
  onImportFields: (itemId: string, fields: string[]) => void
  previewMode: boolean
}

const LayoutItemContent: React.FC<LayoutItemContentProps> = ({
  item,
  isSelected,
  onSetContentType,
  onSelectComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onReorderComponents,
  onImportFields,
  previewMode,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "COMPONENT",
    drop: (droppedItem: any) => {
      return { itemId: item.id }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  if (!item.contentType) {
    return (
      <div
        ref={drop}
        className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg ${
          isOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        {!previewMode ? (
          <>
            <p className="text-gray-500 text-sm mb-2">选择内容类型</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onSetContentType(item.id, "form")}>
                表单
              </Button>
              <Button variant="outline" size="sm" onClick={() => onSetContentType(item.id, "list")}>
                列表
              </Button>
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-sm">暂无内容</p>
        )}
      </div>
    )
  }

  return (
    <div ref={drop} className="min-h-[200px]">
      <FormPreview
        components={item.components}
        onSelectComponent={onSelectComponent}
        onDeleteComponent={(componentId) => onDeleteComponent(item.id, componentId)}
        onDuplicateComponent={(component) => onDuplicateComponent(item.id, component)}
        onReorderComponents={(dragIndex, hoverIndex) => onReorderComponents(item.id, dragIndex, hoverIndex)}
        onImportFields={(fields) => onImportFields(item.id, fields)}
        selectedComponentId={isSelected ? undefined : null}
        viewType={item.contentType}
        previewMode={previewMode}
      />
    </div>
  )
}

export default LayoutPreview
