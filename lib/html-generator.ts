import type { AppState } from "@/app/page"

export const generateHtml = (appState: AppState) => {
  const { layoutType, layoutItems, metadata, approvalButtons = [] } = appState

  // Generate basic HTML structure with improved styling
  let html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metadata.templateName} - ${metadata.version}</title>
  <meta name="description" content="Created with Form Builder by xiaofeng.dai">
  <meta name="author" content="xiaofeng.dai">
  <meta name="creation-date" content="${metadata.creationDate}">
  <meta name="version" content="${metadata.version}">
  <style>
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
      color: #374151;
      margin: 0;
      padding: 20px;
      background-color: #f9fafb;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      padding: 24px;
    }
    
    .form-metadata {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .form-metadata-item {
      flex: 1;
      min-width: 200px;
    }
    
    .form-metadata-label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    
    .form-metadata-value {
      font-size: 16px;
      font-weight: 500;
      color: #111827;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 24px;
    }

    .col-span-1 {
      grid-column: span 1;
    }

    .col-span-2 {
      grid-column: span 2;
    }

    .col-span-3 {
      grid-column: span 3;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      display: flex;
      align-items: center;
    }
    
    .required {
      color: #ef4444;
      margin-right: 4px;
    }
    
    .form-control {
      width: 100%;
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background-color: white;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-control.textarea-style {
      background-color: #f9fafb;
      position: relative;
    }
    
    .textarea-indicator {
      position: absolute;
      bottom: 4px;
      right: 4px;
      display: flex;
      flex-direction: column;
      gap: 1px;
      pointer-events: none;
    }
    
    .textarea-indicator div {
      width: 12px;
      height: 2px;
      background-color: #9ca3af;
    }
    
    .form-select {
      width: 100%;
      padding: 8px 12px;
      font-size: 14px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background-color: white;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 8px center;
      background-size: 16px 12px;
      cursor: pointer;
    }
    
    .form-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }
    
    .form-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    
    .form-switch-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #d1d5db;
      transition: .3s;
      border-radius: 24px;
    }
    
    .form-switch-slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
    
    .form-switch input:checked + .form-switch-slider {
      background-color: #3b82f6;
    }
    
    .form-switch input:checked + .form-switch-slider:before {
      transform: translateX(20px);
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: 14px;
      padding: 8px 16px;
      border-radius: 6px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }
    
    .btn-primary {
      background-color: #1890ff;
      color: white;
      border-color: #1890ff;
    }
    
    .btn-primary:hover {
      background-color: #1677ff;
      border-color: #1677ff;
    }
    
    .btn-outline {
      background-color: white;
      color: #374151;
      border-color: #d1d5db;
    }
    
    .btn-outline:hover {
      background-color: #f9fafb;
    }
    
    .btn-danger {
      background-color: #ef4444;
      color: white;
      border-color: #ef4444;
    }
    
    .btn-danger:hover {
      background-color: #dc2626;
      border-color: #dc2626;
    }

    .btn-warning {
      background-color: white;
      color: #f59e0b;
      border-color: #f59e0b;
    }

    .btn-warning:hover {
      background-color: #fef3c7;
      border-color: #f59e0b;
    }

    .button-group {
      display: flex;
      justify-content: center;
      gap: 16px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .approval-buttons-container {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }

    .approval-buttons {
      display: flex;
      gap: 8px;
    }
    
    .table-container {
      overflow-x: auto;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      min-width: max-content;
    }

    .table th,
    .table td {
      padding: 12px;
      text-align: left;
      border-right: 1px solid #e5e7eb;
      white-space: nowrap;
      min-width: 100px;
    }

    .table th:last-child,
    .table td:last-child {
      border-right: none;
    }

    .table th {
      background-color: #f9fafb;
      font-weight: 500;
      color: #374151;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .table tbody tr:hover {
      background-color: #f9fafb;
    }
    
    .tabs {
      width: 100%;
    }
    
    .tab-list {
      display: flex;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 24px;
    }
    
    .tab {
      padding: 12px 24px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      font-weight: 500;
      color: #6b7280;
      transition: all 0.2s;
      flex: 1;
      text-align: center;
    }
    
    .tab.active {
      color: #3b82f6;
      border-bottom-color: #3b82f6;
    }
    
    .tab:hover {
      color: #374151;
    }
    
    .tab-content {
      display: none;
    }
    
    .tab-content.active {
      display: block;
    }
    
    .accordion {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .accordion-item {
      border-bottom: 1px solid #e5e7eb;
    }
    
    .accordion-item:last-child {
      border-bottom: none;
    }
    
    .accordion-header {
      padding: 16px 20px;
      cursor: pointer;
      background-color: #f9fafb;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background-color 0.2s;
    }
    
    .accordion-header:hover {
      background-color: #f3f4f6;
    }
    
    .accordion-content {
      padding: 20px;
      display: none;
    }
    
    .accordion-content.show {
      display: block;
    }
    
    .card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
      background-color: white;
    }
    
    .card-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #111827;
    }
    
    .flat-layout {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
    }
    
    .modal-content {
      background-color: white;
      margin: 10% auto;
      padding: 24px;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    
    .modal-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
    
    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #6b7280;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: color 0.2s;
    }
    
    .modal-close:hover {
      color: #374151;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .form-metadata {
        flex-direction: column;
      }
      
      .tab-list {
        flex-direction: column;
      }
      
      .tab {
        flex: none;
        text-align: left;
      }
      
      .button-group {
        flex-direction: column;
        align-items: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- 表单元数据 -->
    <div class="form-metadata">
      <div class="form-metadata-item">
        <div class="form-metadata-label">模板名称</div>
        <div class="form-metadata-value">${metadata.templateName}</div>
      </div>
      <div class="form-metadata-item">
        <div class="form-metadata-label">创建日期</div>
        <div class="form-metadata-value">${metadata.creationDate}</div>
      </div>
      <div class="form-metadata-item">
        <div class="form-metadata-label">版本号</div>
        <div class="form-metadata-value">${metadata.version}</div>
      </div>
    </div>
`

  // Generate layout-specific HTML
  if (layoutType === "tabs") {
    html += generateTabsHtml(layoutItems, approvalButtons)
  } else if (layoutType === "accordion") {
    html += generateAccordionHtml(layoutItems, approvalButtons)
  } else if (layoutType === "flat") {
    html += generateFlatHtml(layoutItems, approvalButtons)
  }

  // Add footer
  html += `
    <div class="footer">
      <p>Created with Form Builder v1.0.0 | Author: xiaofeng.dai</p>
    </div>
  </div>
`

  // Add JavaScript for interactivity
  html += `
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        this.classList.add('active');
        const selectedContent = document.getElementById(tabId);
        if (selectedContent) selectedContent.classList.add('active');
      });
    });

    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
      header.addEventListener('click', function() {
        const contentId = this.getAttribute('data-accordion');
        const content = document.getElementById(contentId);
        const indicator = this.querySelector('.accordion-indicator');
        
        if (content.classList.contains('show')) {
          content.classList.remove('show');
          if (indicator) indicator.textContent = '+';
        } else {
          content.classList.add('show');
          if (indicator) indicator.textContent = '-';
        }
      });
    });

    // Modal functionality
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', function() {
        const modalId = this.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'block';
      });
    });

    const modalCloses = document.querySelectorAll('.modal-close');
    modalCloses.forEach(close => {
      close.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) modal.style.display = 'none';
      });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
      if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
      }
    });

    // Form submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('表单提交成功！');
      });
    });

    // Modal item selection
    function selectModalItem(row) {
      const modal = row.closest('.modal');
      const input = document.querySelector(\`[data-modal="\${modal.id}"]\`).previousElementSibling;
      const cells = row.querySelectorAll('td');
      input.value = cells[0].textContent;
      modal.style.display = 'none';
    }
  });
</script>
</body>
</html>
`

  return html
}

function generateTabsHtml(layoutItems: any[], approvalButtons: any[] = []) {
  let html = `
    <div class="tabs">
      <div class="tab-list">
`

  layoutItems.forEach((item, index) => {
    html += `        <div class="tab ${index === 0 ? "active" : ""}" data-tab="${item.id}">${item.name}</div>
`
  })

  html += `      </div>
`

  layoutItems.forEach((item, index) => {
    html += `      <div class="tab-content ${index === 0 ? "active" : ""}" id="${item.id}">
`
    if (item.contentType && (item.components.length > 0 || approvalButtons.length > 0)) {
      html += generateContentHtml(item.components, item.contentType, approvalButtons)
    } else {
      html += `        <p style="text-align: center; color: #6b7280; padding: 40px;">暂无内容</p>
`
    }
    html += `      </div>
`
  })

  html += `    </div>
`

  return html
}

function generateAccordionHtml(layoutItems: any[], approvalButtons: any[] = []) {
  let html = `    <div class="accordion">
`

  layoutItems.forEach((item) => {
    html += `      <div class="accordion-item">
        <div class="accordion-header" data-accordion="${item.id}">
          <span>${item.name}</span>
          <span class="accordion-indicator">+</span>
        </div>
        <div class="accordion-content" id="${item.id}">
`
    if (item.contentType && (item.components.length > 0 || approvalButtons.length > 0)) {
      html += generateContentHtml(item.components, item.contentType, approvalButtons)
    } else {
      html += `          <p style="text-align: center; color: #6b7280; padding: 40px;">暂无内容</p>
`
    }
    html += `        </div>
      </div>
`
  })

  html += `    </div>
`

  return html
}

function generateFlatHtml(layoutItems: any[], approvalButtons: any[] = []) {
  let html = `    <div class="flat-layout">
`

  layoutItems.forEach((item) => {
    html += `      <div class="card">
        <h3 class="card-title">${item.name}</h3>
`
    if (item.contentType && (item.components.length > 0 || approvalButtons.length > 0)) {
      html += generateContentHtml(item.components, item.contentType, approvalButtons)
    } else {
      html += `        <p style="text-align: center; color: #6b7280; padding: 40px;">暂无内容</p>
`
    }
    html += `      </div>
`
  })

  html += `    </div>
`

  return html
}

function generateContentHtml(components: any[], contentType: string, approvalButtons: any[] = []) {
  let html = ""

  if (contentType === "form") {
    const buttons = components.filter((comp) => comp.type === "button")
    const otherComponents = components.filter((comp) => comp.type !== "button")

    html += `        <form>
`

    // 添加审批按钮到表单内部顶部
    if (approvalButtons.length > 0) {
      html += `          <div class="approval-buttons-container" style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
            <div class="approval-buttons" style="display: flex; gap: 8px;">
`
      approvalButtons.forEach((component) => {
        const buttonStyle = component.props.color
          ? `style="background-color: ${component.props.color}; border-color: ${component.props.color}; color: white;"`
          : `style="background-color: #1890ff; border-color: #1890ff; color: white;"`
        html += `              <button type="button" class="btn btn-primary" ${buttonStyle} ${component.props.disabled ? "disabled" : ""}>${component.props.text}</button>
`
      })
      html += `            </div>
          </div>
`
    }

    // 生成智能表单布局
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

    // 渲染表单行
    formRows.forEach((row) => {
      html += `          <div class="form-row">
`
      row.forEach((component) => {
        const spanClass = component._renderSpan === 3 ? "col-span-3" :
                         component._renderSpan === 2 ? "col-span-2" : "col-span-1"

        html += `            <div class="form-group ${spanClass}">
              <label class="form-label">
                ${component.props.required ? '<span class="required">*</span>' : ""}
                ${component.props.label || component.type}
              </label>
`

      switch (component.type) {
        case "text":
          html += `              <input type="${component.props.type || "text"}" class="form-control" placeholder="${component.props.placeholder || ""}" ${component.props.required ? "required" : ""} ${component.props.disabled ? "disabled" : ""}>
`
          break
        case "textarea":
          html += `              <div style="position: relative;">
                <input type="text" class="form-control textarea-style" placeholder="${component.props.placeholder || ""}" ${component.props.required ? "required" : ""} ${component.props.disabled ? "disabled" : ""}>
                <div class="textarea-indicator">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
`
          break
        case "switch":
          html += `              <label class="form-switch">
                <input type="checkbox" ${component.props.defaultChecked ? "checked" : ""} ${component.props.disabled ? "disabled" : ""}>
                <span class="form-switch-slider"></span>
              </label>
`
          break
        case "select":
          html += `              <select class="form-select" ${component.props.required ? "required" : ""} ${component.props.disabled ? "disabled" : ""}>
                <option value="" disabled selected>${component.props.placeholder || "请选择"}</option>
`
          if (component.props.options) {
            component.props.options.forEach((option: any) => {
              html += `                <option value="${option.value}">${option.label}</option>
`
            })
          }
          html += `              </select>
`
          break
        case "yesno":
          html += `              <select class="form-select" ${component.props.required ? "required" : ""} ${component.props.disabled ? "disabled" : ""}>
                <option value="" disabled selected>${component.props.placeholder || "请选择"}</option>
                <option value="yes">是</option>
                <option value="no">否</option>
              </select>
`
          break
        case "datepicker":
          html += `              <input type="date" class="form-control" ${component.props.required ? "required" : ""} ${component.props.disabled ? "disabled" : ""}>
`
          break
        case "datetimepicker":
          html += `              <input type="datetime-local" class="form-control" step="1" ${component.props.required ? "required" : ""} ${component.props.disabled ? "disabled" : ""}>
`
          break
        case "modal":
          const modalFieldsHtml =
            component.props.modalFields
              ?.map(
                (field: any) => `
<th style="min-width: 120px; white-space: nowrap;">${field.name}</th>`,
              )
              .join("") || "<th style='min-width: 120px;'>名称</th><th style='min-width: 120px;'>状态</th>"

          // 只生成1条示例数据，内容均为"示例数据"
          const modalDataHtml = `
<tr onclick="selectModalItem(this)" style="cursor: pointer;">
  ${
    component.props.modalFields?.map(() => `<td style="padding: 8px; white-space: nowrap;">示例数据</td>`).join("") ||
    '<td style="padding: 8px;">示例数据</td><td style="padding: 8px;">示例数据</td>'
  }
</tr>`

          html += `              <div style="position: relative;">
            <input type="text" class="form-control" placeholder="${component.props.placeholder || "点击选择..."}" readonly ${component.props.required ? "required" : ""} ${component.props.disabled ? "disabled" : ""}>
            <button type="button" data-modal="modal-${component.id}" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer;" ${component.props.disabled ? "disabled" : ""}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
          </div>
          <div id="modal-${component.id}" class="modal">
            <div class="modal-content" style="max-width: ${component.props.modalWidth === "sm" ? "400px" : component.props.modalWidth === "lg" ? "800px" : component.props.modalWidth === "xl" ? "1000px" : "600px"};">
              <div class="modal-header">
                <h3 class="modal-title">${component.props.title || "选择项目"}</h3>
                <button class="modal-close">&times;</button>
              </div>
              <div style="padding: 16px;">
                <div style="margin-bottom: 16px;">
                  <input type="text" placeholder="搜索..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="max-height: 400px; overflow: auto; border: 1px solid #ddd; border-radius: 4px;">
                  <table style="width: 100%; border-collapse: collapse; min-width: max-content;">
                    <thead style="background-color: #f9fafb; position: sticky; top: 0; z-index: 10;">
                      <tr>
                        ${modalFieldsHtml}
                      </tr>
                    </thead>
                    <tbody>
                      ${modalDataHtml}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
`
          break
        default:
          html += `              <div>未知组件类型</div>
`
      }
        html += `            </div>
`
      })
      html += `          </div>
`
    })

    if (buttons.length > 0) {
      html += `          <div class="button-group">
`
      buttons.forEach((component) => {
        const buttonStyle = component.props.color
          ? `style="background-color: ${component.props.color}; border-color: ${component.props.color};"`
          : ""
        html += `            <button type="button" class="btn btn-primary" ${buttonStyle} ${component.props.disabled ? "disabled" : ""}>${component.props.text || "按钮"}</button>
`
      })
      html += `          </div>
`
    }

    html += `        </form>
`
  } else if (contentType === "list" || contentType === "checklist") {
    const buttons = components.filter((comp) => comp.type === "button")
    const otherComponents = components.filter((comp) => comp.type !== "button")

    if (buttons.length > 0) {
      html += `        <div class="button-group" style="border: none; padding-bottom: 16px; justify-content: flex-start;">
`
      buttons.forEach((component) => {
        const buttonStyle = component.props.color
          ? `style="background-color: ${component.props.color}; border-color: ${component.props.color};"`
          : ""
        html += `          <button type="button" class="btn btn-primary" ${buttonStyle} ${component.props.disabled ? "disabled" : ""}>${component.props.text || "按钮"}</button>
`
      })
      html += `        </div>
`
    }

    html += `        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
`
    otherComponents.forEach((component) => {
      html += `              <th>
                ${component.props.required ? '<span class="required">*</span>' : ""}
                ${component.props.label || component.type}
              </th>
`
    })
    html += `            </tr>
            </thead>
            <tbody>
              <tr>
`
    otherComponents.forEach((component) => {
      html += `                <td>`

      switch (component.type) {
        case "text":
          html += `<input type="${component.props.type || "text"}" class="form-control" placeholder="${component.props.placeholder || ""}" ${component.props.disabled ? "disabled" : ""}>`
          break
        case "textarea":
          html += `<div style="position: relative;">
            <input type="text" class="form-control textarea-style" placeholder="${component.props.placeholder || ""}" ${component.props.disabled ? "disabled" : ""}>
            <div class="textarea-indicator">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>`
          break
        case "switch":
          html += `<label class="form-switch">
            <input type="checkbox" ${component.props.defaultChecked ? "checked" : ""} ${component.props.disabled ? "disabled" : ""}>
            <span class="form-switch-slider"></span>
          </label>`
          break
        case "select":
          html += `<select class="form-select" ${component.props.disabled ? "disabled" : ""}>
            <option value="" disabled selected>${component.props.placeholder || "请选择"}</option>`
          if (component.props.options) {
            component.props.options.forEach((option: any) => {
              html += `<option value="${option.value}">${option.label}</option>`
            })
          }
          html += `</select>`
          break
        case "yesno":
          html += `<select class="form-select" ${component.props.disabled ? "disabled" : ""}>
            <option value="" disabled selected>${component.props.placeholder || "请选择"}</option>
            <option value="yes">是</option>
            <option value="no">否</option>
          </select>`
          break
        case "datepicker":
          html += `<input type="date" class="form-control" ${component.props.disabled ? "disabled" : ""}>`
          break
        case "datetimepicker":
          html += `<input type="datetime-local" class="form-control" step="1" ${component.props.disabled ? "disabled" : ""}>`
          break
        case "actionbar":
          html += `<div style="display: flex; gap: 8px;">`
          if (component.props.actions) {
            component.props.actions.forEach((action: any) => {
              const buttonClass =
                action.type === "danger" ? "btn-danger" : action.type === "primary" ? "btn-primary" : "btn-outline"
              html += `<button type="button" class="btn ${buttonClass}" ${component.props.disabled ? "disabled" : ""}>${action.text}</button>`
            })
          }
          html += `</div>`
          break
        default:
          html += `<span>数据</span>`
      }

      html += `</td>
`
    })
    html += `              </tr>
            </tbody>
          </table>
        </div>
`
  }

  return html
}
