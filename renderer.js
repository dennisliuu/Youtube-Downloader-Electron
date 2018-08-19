// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// renderer process, for example app/renderer.js
const {ipcRenderer} = require('electron')
const { exec } = require('child_process')
const { remote } = window.require('electron')
const fs  = require("fs")
const ytdl = require('ytdl-core')
const os = require('os')
const {Menu} = remote;

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    Menu.getApplicationMenu().popup(remote.getCurrentWindow());
}, false);

listURL = []
listName = []
count = 0

document.
querySelector('#btnOpenfolder').
addEventListener('click', () => {
	var command = 'start ' + os.homedir() + '\\Music\\YTSongs'
	exec(command)
})

document.querySelector('#btnDownload').disabled = true
document
.querySelector('#btnWrite')
.addEventListener('click', () => {
	let newURL = document.getElementById('URLs').value 
	listURL.push(newURL)
	document.querySelector('#btnDownload').disabled = true
	tempArr = newURL.split("=");
	ytdl.getInfo(tempArr[1], (err, info) => {
		if (err) throw err;
		listName.push(info.title)
		var list = document.getElementById("lists")
		var listItem = document.createElement("LI")
		listItem.textContent = info.title
		list.appendChild(listItem)
		document.querySelector('#btnDownload').disabled = false
	})
	document.getElementById('URLs').value = ""
});

document
.querySelector('#btnDownload')
.addEventListener('click', () => {
	for (var i = 0; i < listURL.length; i++) {
		let video = ytdl(listURL[i])
		video.pipe(fs.createWriteStream(listName[i] + '.mp3'))
		video.on('end', () => {
			movefile()
			count += 1
			if (count == listURL.length) { 
				var command = 'start ' + os.homedir() + '\\Music\\YTSongs'
				exec(command)
				setTimeout(function() {
				    ipcRenderer.send('close')
				}, 3000);
				
			}
		});
	}
});

function movefile() {
	var dir = os.homedir() + '\\Music\\YTSongs'
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}
	var command = 'move *.mp3 ' + os.homedir() + '\\Music\\YTSongs\\'
	exec(command, (err) => {
		if (err) { throw err }
	})
}
