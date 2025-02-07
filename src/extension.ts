// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as https from 'https';
import sizeOf from 'image-size';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log("Extension 'getImageSizes' is now active!");
  let disposable = vscode.commands.registerCommand('extension.getImageSizes', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }
    const document = editor.document;
    const text = document.getText();
    const imageObj = getImageUrls(text)

    for (const img of imageObj) {
      try {
        const currentText = document.getText();
        const dimensions = await getImageDimensions(img.url);

        const newText = currentText.replaceAll(img.fullText,
          img.fullText.substring(0, img.fullText.lastIndexOf(')')) + ` =${dimensions.width}x${dimensions.height})`);
        const edit = new vscode.WorkspaceEdit();
        const startPos = document.positionAt(0);
        const endPos = document.positionAt(newText.length);
        edit.replace(document.uri, new vscode.Range(startPos, endPos), newText);
        await vscode.workspace.applyEdit(edit);
      } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to get dimensions for ${img.url}: ${error.message}`);
      }
    }
  });
  context.subscriptions.push(disposable);

  // 监听粘贴事件
  vscode.workspace.onDidChangeTextDocument(async (event) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') {
      return;
    }

    // 读取配置项
    const config = vscode.workspace.getConfiguration('markdownSetWebImageSize');
    const enablePasteImageSize = config.get<boolean>('enablePasteImageSize', true);

    if (!enablePasteImageSize) {
      return;
    }

    const changes = event.contentChanges;
    for (const change of changes) {
      let pastedText = change.text;

      const imageObj = getImageUrls(pastedText)

      for (const img of imageObj) {
        try {
          const dimensions = await getImageDimensions(img.url);

          const newText = pastedText.replaceAll(img.fullText,
            img.fullText.substring(0, img.fullText.lastIndexOf(')')) + ` =${dimensions.width}x${dimensions.height})`);

          pastedText = newText;

          const edit = new vscode.WorkspaceEdit();
          const startPos = editor.document.positionAt(change.rangeOffset);
          const endPos = editor.document.positionAt(change.rangeOffset + pastedText.length);
          edit.replace(editor.document.uri, new vscode.Range(startPos, endPos), newText);
          await vscode.workspace.applyEdit(edit);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Failed to get dimensions for ${img.url}: ${error.message}`);
        }
      }
    }
  });
}
function getImageUrls(text: string): { fullText: string; url: string }[] {
  const regex = /!\[.*?\]\((https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif)(\?[^\s]*)?)(?:\s+"[^"]*")?\)(?!\s*=\d*x\d*\s*)/g;
  const matches: { fullText: string; url: string }[] = [];
  let match: any[] | null;
  while ((match = regex.exec(text)) !== null) {
    console.log("match", match)
    if (!matches.find(i => i.fullText === match?.[0]) && !match[1].match(/\s*=\d*x\d*$/)) {
      matches.push({
        fullText: match[0],
        url: match[1]
      });
    }
  }
  return matches;
}

function getImageDimensions(url: string): Promise<{ width: number, height: number }> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks: Uint8Array[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        try {
          const dimensions = sizeOf(buffer);
          if (dimensions.width !== undefined && dimensions.height !== undefined) {
            resolve({ width: dimensions.width, height: dimensions.height });
          } else {
            reject(new Error('Invalid image dimensions'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// This method is called when your extension is deactivated
export function deactivate() { }