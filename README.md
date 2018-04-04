# Dumb copy-paste README

Since moving to VS Code from Sublime Text I've been missing one common-sence and obvious general-text-editor-for-programmers feature. This is a basic and simple feature for all popular code editors with exception for VS Code for some misterius reason. I've been looking for solutions reading threads on github, users were asking for it from devs again and again for more than 2 years, devs could not understand words as simple as "just like in Sublime or Atom" or explaining that it could not be implemented in VS Code or would be to complicated due to different formating rules for different langs and so on... Well, then how come other editors have it built in by default???... I've had enough... I've never used TypeScript before, never developed any extension for any app, but it took me two days to implement the `Control+Shift+V` behavior from Sublime O_O... wtf? It turned out to be SOOOOOOOOO simple!!! DUMB SIMPLE!!! And I named it "Dumb copy-paste". VS Code is great for making it that simple and easy to do. And people are very creative when they want something, and very creative when explaining that something can not be done if it's something they dont want to do.

The extension is less than 100 lines of code. So it is my first dumb simple implementation of ctrl+shift+v paste from Sublime. All it does is reindent and then insert multiline copied or cut text from within the editor. It ignores format on paste option as it assumes the pasted piece of code was already formated before copy/cut. It does not work if the text was copied/cut from outside VS Code. It does not work for single line piece of text. The extension substitutes native copy and cut commands in VS Code adding a small overhead to them to note orginal block indentation. The extension also rebinds `ctrl-shift-v` shortcut to 'Dumb: Paste' command. The command does native paste from clipboard if the text was copied/cut from outside the editor and nothing multiline was copied/cut from the editor before that.

## Features

Dumb simple implementation of `ctrl+shift+v` from Sublmie Text:
Just select a block of code, hit `ctrl+c`/`ctrl+x`, move curret to where you want it pasted, `ctrl+shift+v`, BAM! it is pasted keeping copied/cut block of code indentation shape. It cares not about the language of the text you are copy-pasting or format-on-paste option.

## Requirements

No dependencies. To work as expected the extension needs `ctrl+c` mapped to 'Dumb: Copy' command, `ctrl+x` - mapped to 'Dumb: Cut' command and `ctrl+shift+v` - to 'Dumb: Paste' command. It does the bindings itself but needs the user or other extensions not rebind them. Or you can bind the commands to whatever you like, but 'Dumb: Paste' will work correct only after 'Dumb: Copy' or 'Dumb: Cut' command executon.

## Release Notes

### 1.0.0

Initial release
