"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Import } from "lucide-react"

interface ImportFieldsDialogProps {
  onImportFields: (fields: string[]) => void
  trigger?: React.ReactNode
}

export function ImportFieldsDialog({ onImportFields, trigger }: ImportFieldsDialogProps) {
  const [open, setOpen] = useState(false)
  const [fieldText, setFieldText] = useState("")
  const [previewFields, setPreviewFields] = useState<string[]>([])

  const parseFields = (text: string): string[] => {
    if (!text.trim()) return []

    // 支持多种分隔符：英文逗号、中文逗号、空格、换行
    const separators = /[,，\s\n]+/
    return text
      .split(separators)
      .map((field) => field.trim())
      .filter((field) => field.length > 0)
  }

  const handleTextChange = (text: string) => {
    setFieldText(text)
    setPreviewFields(parseFields(text))
  }

  const handleImport = () => {
    if (previewFields.length > 0) {
      onImportFields(previewFields)
      setOpen(false)
      setFieldText("")
      setPreviewFields([])
    }
  }

  const handleCancel = () => {
    setOpen(false)
    setFieldText("")
    setPreviewFields([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Import className="h-4 w-4 mr-2" />
            导入字段
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>导入字段</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fieldText">字段文本</Label>
            <p className="text-sm text-gray-500 mb-2">支持多种分隔符：英文逗号(,)、中文逗号(，)、空格、换行</p>
            <Textarea
              id="fieldText"
              value={fieldText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="请输入字段名称，例如：&#10;姓名,年龄,性别&#10;或&#10;姓名&#10;年龄&#10;性别"
              className="min-h-[120px]"
            />
          </div>

          {previewFields.length > 0 && (
            <div>
              <Label>预览字段 ({previewFields.length} 个)</Label>
              <div className="mt-2 p-3 border rounded-lg bg-gray-50 max-h-40 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {previewFields.map((field, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      <span className="truncate">{field}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                所有字段将默认创建为"单行文本"类型，导入后可在属性面板中修改字段类型
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <Button onClick={handleImport} disabled={previewFields.length === 0}>
              导入 {previewFields.length > 0 && `(${previewFields.length}个字段)`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
