import type { AppState, LayoutItem, FormMetadata } from "@/app/page"

export interface ParsedComponent {
  id: string
  type: string
  props: any
}

export function parseHtmlFile(htmlContent: string): AppState | null {
  try {
    // 创建一个临时的DOM解析器
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, "text/html")

    // 提取元数据
    const metadata: FormMetadata = {
      templateName:
        doc
          .querySelector('meta[name="description"]')
          ?.getAttribute("content")
          ?.replace("Created with Form Builder by xiaofeng.dai", "")
          .trim() ||
        doc.title ||
        "导入的表单",
      creationDate:
        doc.querySelector('meta[name="creation-date"]')?.getAttribute("content") ||
        new Date().toISOString().slice(0, 10),
      version: doc.querySelector('meta[name="version"]')?.getAttribute("content") || "1.0.0",
    }

    // 检测布局类型
    let layoutType: "tabs" | "accordion" | "flat" | null = null
    const layoutItems: LayoutItem[] = []

    if (doc.querySelector(".tabs")) {
      layoutType = "tabs"
      const tabs = doc.querySelectorAll(".tab")
      const tabContents = doc.querySelectorAll(".tab-content")

      tabs.forEach((tab, index) => {
        const tabId = tab.getAttribute("data-tab") || `item_${Date.now()}_${index}`
        const tabName = tab.textContent?.trim() || `标签页${index + 1}`
        const content = doc.getElementById(tabId)

        const item: LayoutItem = {
          id: tabId,
          name: tabName,
          contentType: null,
          components: [],
        }

        if (content) {
          const parsedContent = parseContent(content)
          item.contentType = parsedContent.contentType
          item.components = parsedContent.components
        }

        layoutItems.push(item)
      })
    } else if (doc.querySelector(".accordion")) {
      layoutType = "accordion"
      const accordionItems = doc.querySelectorAll(".accordion-item")

      accordionItems.forEach((accordionItem, index) => {
        const header = accordionItem.querySelector(".accordion-header")
        const content = accordionItem.querySelector(".accordion-content")
        const itemId = header?.getAttribute("data-accordion") || `item_${Date.now()}_${index}`
        const itemName = header?.textContent?.replace("+", "").replace("-", "").trim() || `折叠项${index + 1}`

        const item: LayoutItem = {
          id: itemId,
          name: itemName,
          contentType: null,
          components: [],
        }

        if (content) {
          const parsedContent = parseContent(content)
          item.contentType = parsedContent.contentType
          item.components = parsedContent.components
        }

        layoutItems.push(item)
      })
    } else if (doc.querySelector(".flat-layout")) {
      layoutType = "flat"
      const cards = doc.querySelectorAll(".card")

      cards.forEach((card, index) => {
        const title = card.querySelector(".card-title")
        const itemName = title?.textContent?.trim() || `卡片${index + 1}`
        const itemId = `item_${Date.now()}_${index}`

        const item: LayoutItem = {
          id: itemId,
          name: itemName,
          contentType: null,
          components: [],
        }

        const parsedContent = parseContent(card)
        item.contentType = parsedContent.contentType
        item.components = parsedContent.components

        layoutItems.push(item)
      })
    }

    // 解析审批按钮（从所有表单中提取）
    const approvalButtons: any[] = []
    const allForms = doc.querySelectorAll("form")
    allForms.forEach((form) => {
      const approvalButtonsContainer = form.querySelector(".approval-buttons-container .approval-buttons")
      if (approvalButtonsContainer) {
        const buttons = approvalButtonsContainer.querySelectorAll("button")
        Array.from(buttons).forEach((button, index) => {
          const text = button.textContent?.trim() || "按钮"
          const className = button.className
          let type = "default"
          let componentType = "approval-custom"

          if (className.includes("btn-warning")) type = "warning"
          else if (className.includes("btn-primary")) type = "primary"

          // 根据按钮文本确定类型
          if (text.includes("查看流程")) componentType = "approval-view-process"
          else if (text.includes("撤销审批")) componentType = "approval-revoke"
          else if (text.includes("返回")) componentType = "approval-return"
          else componentType = "approval-custom"

          const approvalButton = {
            id: `${componentType}_${Date.now()}_${index}`,
            type: componentType,
            props: {
              text,
              type,
              disabled: button.hasAttribute("disabled"),
            },
          }
          approvalButtons.push(approvalButton)
        })
      }
    })

    return {
      layoutType,
      layoutItems,
      selectedItemId: layoutItems[0]?.id || null,
      selectedComponent: null,
      metadata,
      approvalButtons,
    }
  } catch (error) {
    console.error("解析HTML文件失败:", error)
    return null
  }
}

function parseContent(element: Element): { contentType: "form" | "list" | null; components: ParsedComponent[] } {
  const components: ParsedComponent[] = []
  let contentType: "form" | "list" | null = null

  // 检查是否是表单
  const form = element.querySelector("form")
  if (form) {
    contentType = "form"

    // 解析表单字段
    const formGroups = form.querySelectorAll(".form-group")
    formGroups.forEach((group, index) => {
      const label = group.querySelector(".form-label")
      const input = group.querySelector("input, select, textarea")
      const isRequired = label?.querySelector(".required") !== null

      if (input && label) {
        const component = parseFormField(input, label, isRequired, index)
        if (component) {
          components.push(component)
        }
      }
    })

    // 审批按钮现在在独立状态中处理，不在这里解析

    // 解析普通按钮
    const buttons = form.querySelectorAll(".button-group button")
    buttons.forEach((button, index) => {
      const component = parseButton(button as HTMLButtonElement, index)
      if (component) {
        components.push(component)
      }
    })
  }

  // 检查是否是列表
  const table = element.querySelector("table")
  if (table) {
    contentType = "list"

    // 解析表头
    const headers = table.querySelectorAll("thead th")
    headers.forEach((header, index) => {
      const headerText = header.textContent?.replace("*", "").trim()
      const isRequired = header.querySelector(".required") !== null

      if (headerText && headerText !== "操作") {
        const component: ParsedComponent = {
          id: `field_${Date.now()}_${index}`,
          type: "text",
          props: {
            label: headerText,
            required: isRequired,
            placeholder: "请输入",
            disabled: false,
          },
        }
        components.push(component)
      } else if (headerText === "操作") {
        // 操作栏
        const component: ParsedComponent = {
          id: `actionbar_${Date.now()}_${index}`,
          type: "actionbar",
          props: {
            actions: [
              { text: "删除", type: "danger" },
              { text: "编辑", type: "primary" },
              { text: "查看", type: "default" },
            ],
          },
        }
        components.push(component)
      }
    })

    // 解析列表上方的按钮
    const listButtons = element.querySelectorAll(".button-group button")
    listButtons.forEach((button, index) => {
      const component = parseButton(button as HTMLButtonElement, index)
      if (component) {
        components.push(component)
      }
    })
  }

  return { contentType, components }
}

function parseFormField(input: Element, label: Element, isRequired: boolean, index: number): ParsedComponent | null {
  const labelText = label.textContent?.replace("*", "").trim() || `字段${index + 1}`
  const placeholder = input.getAttribute("placeholder") || ""
  const disabled = input.hasAttribute("disabled")

  const baseProps = {
    label: labelText,
    required: isRequired,
    disabled,
    placeholder,
  }

  if (input.tagName === "INPUT") {
    const inputElement = input as HTMLInputElement
    const type = inputElement.type

    switch (type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return {
          id: `text_${Date.now()}_${index}`,
          type: "text",
          props: { ...baseProps, type },
        }
      case "date":
        return {
          id: `datepicker_${Date.now()}_${index}`,
          type: "datepicker",
          props: baseProps,
        }
      case "datetime-local":
        return {
          id: `datetimepicker_${Date.now()}_${index}`,
          type: "datetimepicker",
          props: { ...baseProps, showTime: true },
        }
      case "checkbox":
        return {
          id: `switch_${Date.now()}_${index}`,
          type: "switch",
          props: {
            label: labelText,
            defaultChecked: inputElement.checked,
            disabled,
          },
        }
      default:
        return {
          id: `text_${Date.now()}_${index}`,
          type: "text",
          props: baseProps,
        }
    }
  } else if (input.tagName === "SELECT") {
    const options = Array.from(input.querySelectorAll("option"))
      .filter((option) => option.value !== "")
      .map((option) => ({
        value: option.value,
        label: option.textContent?.trim() || option.value,
      }))

    // 检查是否是是/否下拉
    if (
      options.length === 2 &&
      options.some((opt) => opt.value === "yes") &&
      options.some((opt) => opt.value === "no")
    ) {
      return {
        id: `yesno_${Date.now()}_${index}`,
        type: "yesno",
        props: baseProps,
      }
    }

    return {
      id: `select_${Date.now()}_${index}`,
      type: "select",
      props: { ...baseProps, options },
    }
  }

  return null
}

function parseButton(button: HTMLButtonElement, index: number): ParsedComponent | null {
  const text = button.textContent?.trim() || `按钮${index + 1}`
  const style = button.getAttribute("style") || ""
  const colorMatch = style.match(/background-color:\s*([^;]+)/)
  const color = colorMatch ? colorMatch[1].trim() : "#1890ff"

  return {
    id: `button_${Date.now()}_${index}`,
    type: "button",
    props: {
      text,
      color,
      disabled: button.disabled,
    },
  }
}
