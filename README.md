# Open in IDEA

When you run the "Open in IDEA" action (default keybinding "ctrl + alt + i") VS Code will open the Active Editors, and their workspace, in IntelliJ IDEA including the current cursor position.
I created this as an experiment using OpenCode, using Grok Code, because I want to use IntelliJ IDEA's refactor tools but their Vim mode frustrates me.
I did look for existing extensions first but missed that there were several.
However, the one that seemed almost identical, [JetBrains Link](https://marketplace.visualstudio.com/items?itemName=fr000g.jetbrains-link), had messages in Chinese.
Between the Chinese and concern about trusting third-party extensions I decided to keep this for myself.

## Development

1. Install dependencies,

    ```sh
    npm install
    ```

2. Compile TypeScript → JavaScript,

    ```sh
    npm run compile
    ```

3. Package,

    ```sh
    npm run package
    ```


4. Install,

    ```sh
    npm run install-extension
    ```
