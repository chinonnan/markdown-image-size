# Markdown Set Web Image Size

Markdown Set Web Image Size 是一个 VS Code 扩展，用于在 Markdown 文件中获取并设置图像尺寸。

## 功能

- 自动获取 Markdown 文件中图像的尺寸，并将尺寸信息添加到图像 URL 后。
- 支持多种图像格式，包括 PNG、JPG、JPEG 和 GIF。
- 粘贴外链图片时自动添加尺寸信息（可配置）。

## 使用方法

1. 打开一个包含图像 URL 的 Markdown 文件。
2. 右键点击图像 URL，选择 `Markdown: 设置外链图片尺寸`。
3. 或者，使用快捷键 `Ctrl+Alt+S`（Windows 和 Linux）或 `Cmd+Alt+S`（macOS）来触发命令。
4. 粘贴外链图片时，扩展会自动获取图像尺寸并添加到 URL 后。

## 安装

1. 打开 VS Code。
2. 进入扩展视图（按 `Ctrl+Shift+X`）。
3. 搜索 `Markdown Set Web Image Size` 并点击安装。

## 配置

扩展提供了一个配置项，用于控制粘贴时是否自动添加图像尺寸：

- `markdownSetWebImageSize.enablePasteImageSize`：启用或禁用粘贴时自动添加图像尺寸，默认值为 `true`。

### 配置方法

1. 打开 VS Code 设置（按 `Ctrl+,`）。
2. 搜索 `Markdown Set Web Image Size`。
3. 找到 `Enable Paste Image Size` 配置项，并根据需要启用或禁用。

## 开发

确保你已经阅读了扩展指南，并遵循创建扩展的最佳实践。

* [扩展指南](https://code.visualstudio.com/api/references/extension-guidelines)

## 使用 Markdown

你可以使用 Visual Studio Code 编写你的 README。以下是一些有用的编辑器快捷键：

* 分割编辑器（macOS 上使用 `Cmd+\`，Windows 和 Linux 上使用 `Ctrl+\`）。
* 切换预览（macOS 上使用 `Shift+Cmd+V`，Windows 和 Linux 上使用 `Shift+Ctrl+V`）。
* 按 `Ctrl+Space`（Windows、Linux、macOS）查看 Markdown 代码片段列表。

## 更多信息

* [Visual Studio Code 的 Markdown 支持](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown 语法参考](https://help.github.com/articles/markdown-basics/)

**享受使用吧！**