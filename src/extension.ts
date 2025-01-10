import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const reloadHandler = () => {
    vscode.commands.executeCommand("workbench.action.files.revert");
  };
  const reloadActiveFileCommands = [
    "reload-files.reload.file",
    "reload-files.reload.file.context",
    "reload-files.reload.file.icon",
  ];
  const disposables = reloadActiveFileCommands.map((command) =>
    vscode.commands.registerCommand(command, reloadHandler)
  );

  context.subscriptions.push(...disposables);
}
