// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "npm-script-commands" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("npm-script-commands.npmRun", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    fs.readFile(path.resolve(workspaceFolder?.uri.fsPath ?? "", "package.json"), "utf8", (err, data) => {
      if (err) {
        return console.error(err);
      }
      let packageConfig: { scripts?: Record<string, string> } = {};
      try {
        packageConfig = JSON.parse(data);
      } catch (error) {
        console.error(error);
      }

      const quickpick = vscode.window.createQuickPick();
      if (!Object.keys(packageConfig?.scripts).length) {
        vscode.window.showWarningMessage("No scripts found in package.json");
        return;
      }

      quickpick.items = Object.keys(packageConfig.scripts).map((key) => ({
        label: key,
        description: packageConfig.scripts[key],
      }));

      vscode.window.showQuickPick(quickpick.items).then((pick) => console.log(pick));
    });
  });
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
