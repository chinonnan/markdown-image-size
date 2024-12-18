// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as https from 'https';
import sizeOf from 'image-size';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.getImageSizes', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor found');
      return;
    }
    const document = editor.document;
    const text = document.getText();
    const imageUrls = [...new Set(getImageUrls(text))];

    for (const url of imageUrls) {
        try {
          const currentText = document.getText();
          const dimensions = await getImageDimensions(url);
          const escapedSrc = escapeRegExp(url);
          const pattern = new RegExp(`(${escapedSrc})`, "g");

          const newText = currentText.replaceAll(pattern, (match) => {
            return `${match} =${dimensions.width}x${dimensions.height}`;
          });
          const edit = new vscode.WorkspaceEdit();
          const startPos = document.positionAt(0);
          const endPos = document.positionAt(newText.length);
          edit.replace(document.uri, new vscode.Range(startPos, endPos), newText);
          await vscode.workspace.applyEdit(edit);
        } catch (error: any) {
          vscode.window.showErrorMessage(`Failed to get dimensions for ${url}: ${error.message}`);
        }
    }
  });
  context.subscriptions.push(disposable);
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& 表示整个匹配的字符串
}

function getImageUrls(text: string): string[] {
  const regex = /!\[.*?\]\((https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif))(?=\s*=\d*x\d*\s*\))?\)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (!match[1].match(/\s*=\d*x\d*$/)) {
      matches.push(match[1]);
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