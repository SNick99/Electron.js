const electron = require("electron");
const  app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");

let win;

function CreateWindow() {
    win = new BrowserWindow({
        width: 610,
        height: 448,
        title: "Snake",
        resizable: false,
        darkTheme: true,
        center: true
    });
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true
        })
    );
        win.on('closed', () =>{
            win = null;
        });
       // win.webContents.openDevTools();
}

app.on('ready', CreateWindow);

app.on('window-all-closed', () =>{
   if(process.platform !== 'drawin'){
       app.quit()
   }
});

app.on('active', () =>{
   if(win === null){
       CreateWindow()
   }
});