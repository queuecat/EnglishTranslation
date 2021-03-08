const { app, BrowserWindow, globalShortcut, screen, Menu, Tray, clipboard } = require('electron')
const ks = require('node-key-sender');
const path = require("path")


let win = null;


function getQuestion() {
    //获取当前剪切板内容
    const old = clipboard.readText();
    // 剪切当前选中内容
    return Promise.resolve().then(() => {

        return ks.sendCombination(['control', 'c'])

    }
    ).then(() => {
        const text = clipboard.readText();
        console.log(text);
        //将原先内容覆盖会剪切板
        clipboard.writeText(old);
        return text;
    })
    // return Promise.resolve().then(() => {
    //     const text = clipboard.readText();
    //     console.log(text);
    //     //将原先内容覆盖会剪切板
    //     clipboard.writeText(old);
    //     return text;
    // })

}

function createWindow(data) {

    let coordinate = screen.getCursorScreenPoint();
    //判断是单词还是句子

    win = new BrowserWindow({
        width: 300,
        height: 200,
        x: coordinate.x,
        y: coordinate.y,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, './render.js'),
            nodeIntegration: true
        },
        // frame: false,
        transparent: true,
        // show: false,
        backgroundColor: "#fff",
        skipTaskbar: "true",
        icon: "./ioc.ico",
        title: "翻译结果"
    })

    win.loadFile('index.html');
    //优雅显示
    win.on('ready-to-show', () => {
        win.focus();
        // win.show();
        Menu.setApplicationMenu(null)

        // const template = [{
        //     role: "quit"
        // }]
        // const menu = Menu.buildFromTemplate(template)
        // Menu.setApplicationMenu(menu)
    })
    win.webContents.on('did-finish-load', () => {
        win.webContents.send("question", data);
    })

    //页面开发工具控制台
    // win.openDevTools();


}
app.on("browser-window-blur", () => {
    win.destroy();
})
app.on("browser-window-focus", () => {
    console.log("get focus");
})



app.on('ready', () => {
    // createWindow();
    tray = new Tray(path.join(__dirname, './logo.ico'))
    tray.setToolTip('选中句子后按下CTRL+E实现复制')
    const contextMenu = Menu.buildFromTemplate([
        { label: '退出程序', role: "quit" }
    ])
    tray.setContextMenu(contextMenu)

    //注册快捷键
    globalShortcut.register('CommandOrControl+e', () => {
        // if (BrowserWindow.getAllWindows().length > 0) {
        //     BrowserWindow.getAllWindows()[0].close();
        // }

        console.log(123, BrowserWindow.getAllWindows().length);
        // if (BrowserWindow.getAllWindows().length === 0) {
        //     getQuestion().then((data) => {
        //         createWindow(data);
        //     })
        // }
        // getQuestion()
        getQuestion().then((data) => {
            createWindow(data);
            console.log(data);
        })
        // createWindow();
        console.log(123);

    })
})
app.on('window-all-closed', e => e.preventDefault())
console.log("\033[42;30m run \033[0m", "start win");