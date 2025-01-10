import * as assert from "node:assert";
import * as vscode from "vscode";
import path from "node:path";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

suite("Extension Test Suite", () => {
  test("Single File Reload", async () => {
    const uri = vscode.Uri.file(
      path.resolve(__dirname, "tests-fs", "single.txt")
    );
    // read original text from file
    const originalFileContent = new TextDecoder().decode(
      await vscode.workspace.fs.readFile(uri)
    );

    const editor = await vscode.window.showTextDocument(uri);
    const editorContent = editor.document.getText();
    // making sure the file is opened in editor with the right text
    assert.strictEqual(
      editorContent,
      originalFileContent,
      "Editor file content is not the same as the fs content"
    );

    // edit the text in file to: "modified"
    await editor.edit((editBuilder) => {
      editBuilder.replace(new vscode.Range(0, 0, 0, 8), "modified");
    });

    // making sure the change was made
    const editorContentAfterModification = editor.document.getText();
    assert.notEqual(
      editorContentAfterModification,
      originalFileContent,
      "Editor file content is the same as the fs content despite the modification"
    );

    // call "File: reload" command
    await vscode.commands.executeCommand("reload-files.reload.file");

    await sleep(1000); // wait for the file to reload, TODO: find a better way to get notified when the file is reloaded

    // check if editor content is reverted
    const editorContentAfterReload = editor.document.getText();
    assert.strictEqual(
      editorContentAfterReload,
      originalFileContent,
      "Editor file content is not the same as the original fs content after reload"
    );
  });
});
