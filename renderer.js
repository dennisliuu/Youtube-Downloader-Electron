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

document.querySelector('#btnDownload1').disabled = true
document.querySelector('#btnDownload2').disabled = true
document
.querySelector('#btnWrite')
.addEventListener('click', () => {
	let newURL = document.getElementById('URLs').value
	newURL = newURL.split("&")[0]
	listURL.push(newURL)
	document.querySelector('#btnDownload1').disabled = true
	document.querySelector('#btnDownload2').disabled = true
	tempArr = newURL.split("=");
	ytdl.getInfo(tempArr[1], (err, info) => {
		if (err) throw err;
		listName.push(info.title)
		var list = document.getElementById("lists")
		var listItem = document.createElement("LI")
		listItem.classList.add("list-group-item")
		listItem.textContent = info.title
		list.appendChild(listItem)
		document.querySelector('#progress-bar').style.width = '0%'
		document.querySelector('#btnDownload1').disabled = false
		document.querySelector('#btnDownload2').disabled = false
	})
	document.getElementById('URLs').value = ""
});

document
.querySelector('#btnDownload1')
.addEventListener('click', () => {
	document.querySelector('#btnWrite').disabled = true
	for (var i = 0; i < listURL.length; i++) {
		let video = ytdl(listURL[i])
		video.pipe(fs.createWriteStream(listName[i] + '.mp3'))
		video.on('progress', (chunkLength, downloaded, total) => {
		  const floatDownloaded = ((downloaded / total) * 100).toFixed(2);
		  document.querySelector('#progress-bar').style.width = floatDownloaded*3 + '%'
		  document.querySelector('#progress-bar').setAttribute('aria-valuenow', floatDownloaded);
		  document.querySelector('#progress-bar').innerHTML = floatDownloaded
		  // console.log(floatDownloaded);
		});
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

document
.querySelector('#btnDownload2')
.addEventListener('click', () => {
	document.querySelector('#btnWrite').disabled = true
	for (var i = 0; i < listURL.length; i++) {
		let video = ytdl(listURL[i])

		video.pipe(fs.createWriteStream(listName[i] + '.mp4'))

		video.on('progress', (chunkLength, downloaded, total) => {
		  const floatDownloaded = ((downloaded / total) * 100).toFixed(2);
		  document.querySelector('#progress-bar').style.width = floatDownloaded*3 + '%'
		  document.querySelector('#progress-bar').setAttribute('aria-valuenow', floatDownloaded);
		  document.querySelector('#progress-bar').innerHTML = floatDownloaded
		  // console.log(floatDownloaded);
		});
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
	// for /r C:\ %f in (*.jpg) do @copy "%f" D:\pictures\
	var command = 'for /r . %f in (*.mp3,*.mp4) do @move "%f" ' + os.homedir() + '\\Music\\YTSongs\\'
	exec(command, (err) => {
		if (err) { throw err }
	})
}
