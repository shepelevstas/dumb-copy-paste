'use strict';
import {commands, ExtensionContext, TextEditor, Range, Position} from 'vscode'

export function activate(context: ExtensionContext) {
    let dumb = new Dumb()
    let copy = commands.registerTextEditorCommand('dumb.copy',(editor:TextEditor)=>{
        dumb.copy(editor)
        commands.executeCommand("editor.action.clipboardCopyAction")
    })
    let cut = commands.registerTextEditorCommand('dumb.cut', (editor:TextEditor)=>{
        dumb.copy(editor)
        commands.executeCommand('editor.action.clipboardCutAction')
    })
    let paste = commands.registerTextEditorCommand('dumb.paste', (editor:TextEditor)=>{
        if (!dumb.paste(editor)) commands.executeCommand('editor.action.clipboardPasteAction')
    })
    context.subscriptions.push(dumb)
    context.subscriptions.push(copy)
    context.subscriptions.push(cut)
    context.subscriptions.push(paste)
}

export function deactivate() {}

class Dumb{
    private static indReg:RegExp = /^(\s*)/
    private hasContent: boolean = false
    private lines:string[]

    private static spaces(line:string, tabSize:number):number{
        let ind = line.match(Dumb.indReg)[1]
        return ind.length+(tabSize-1)*(ind.split('\t').length-1)
    }

    public copy(editor: TextEditor){
        let sel = editor.selection

        if (sel.isSingleLine){
            this.hasContent = false
            return
        }
        this.hasContent = true

        let tabSize = Number(editor.options.tabSize)
        let lines = editor.document.getText(sel).split('\n')
        let blockIndent = 0
        let skipStartLines = 1
        let skipEndLines = 0
        if (sel.start.character>0){
            let lineStart = new Position(sel.start.line, 0)
            let pre = editor.document.getText(new Range(lineStart, sel.start))
            blockIndent = Dumb.spaces(pre, tabSize)
        } else if (lines.slice(-1)[0].length==0) {
            blockIndent = Dumb.spaces(lines[0], tabSize)
            skipStartLines = 0
            skipEndLines = 1
        }

        for (let i = skipStartLines, l = lines.length-skipEndLines; i < l; i++) {
            let spaces = Dumb.spaces(lines[i], tabSize)
            let ind = spaces - blockIndent
            if (ind > 0) {
                let _ind = '\t'.repeat(Math.floor(ind / tabSize)) + ' '.repeat(ind % tabSize)
                lines[i] = _ind + lines[i].trim()
            } else {
                lines[i] = lines[i].trim()
            }
        }
        this.lines = lines
    }

    public paste(editor: TextEditor):boolean{
        if (this.hasContent){
            let sel = editor.selection
            let tabSize = Number(editor.options.tabSize)
            let insertSp = Boolean(editor.options.insertSpaces)
            let blockIndent = 0
            if (sel.start.character>0){
                let lineStart = new Position(sel.start.line, 0)
                let pre = editor.document.getText(new Range(lineStart, sel.start))
                blockIndent = Dumb.spaces(pre, tabSize)
            }
            let lines = this.lines.slice()
            for (let i = 1, l = lines.length; i < l; i++){
                let spaces = Dumb.spaces(lines[i], tabSize)
                if (insertSp){
                    lines[i] = ' '.repeat(blockIndent+spaces) + lines[i].trim()
                } else {
                    let _ind = '\t'.repeat(Math.floor((blockIndent + spaces) / tabSize)) + ' '.repeat((blockIndent + spaces) % tabSize)
                    lines[i] = _ind + lines[i].trim()
                }
            }

            editor.edit((e)=>{
                if (!sel.isEmpty)
                    e.delete(sel)
                e.insert(sel.start, lines.join('\n'))
            })

            return true
        }
        return false
    }

    public dispose(){}
}
