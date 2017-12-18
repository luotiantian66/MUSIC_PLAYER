function $(selector){
  return document.querySelector(selector)
}
function $$(selector){
  return document.querySelectorAll(selector)
}

//audioObj.pause()
// 加载音乐
var curIndex = 0
var songNum,musicList,clock 
var audioObj = new Audio()
audioObj.autoplay = true


function loadMusic(music){
	audioObj.src = music.songurl
	$('.show').style.background = "url("+ music.imgurl + ")" + "no-repeat"
	$('.show').style.backgroundSize = "cover"
	$('.show').style.backgroundColor = "rgba(255,255,255,0.5)"
	for(i=0;i<songNum;i++){
		if(i!==curIndex){
			$$('.list-song p')[i].style.color = "black"
		}else{
			$$('.list-song p')[i].style.color = "#BB3D00"
		}
	}
	// wordsUrl = "/words/" +  curIndex + ".lrc"
	// console.log(wordsUrl)
	// getMusicWords('wordsUrl')
	//$('.show img').src = music.imgurl
	$('.name p').innerText = music.name + '---' + music.singer
	if((audioObj.paused) == true ) {
		$('.icon-play').style.display = "none"
		$('.icon-pause').style.display = "inline"
	}
}	

function loadList(music){
	for(i = 0;i< music.length;i++){
	$('.list-song').innerHTML += '<p>' + music[i].name + '----' + music[i].singer + '</p>'
	}
	//getMusicWords('url')
}

getMusicList(function(list){
	loadMusic(list[curIndex])
	loadList(list)
})

// 获取音乐数据
function getMusicList(callback){
	var xhr = new XMLHttpRequest()
	xhr.open('GET','js/music.json',true)
	xhr.onload = function(){
		if((xhr.status >= 200 && xhr.status <= 300) || xhr.status ===304){
			callback(JSON.parse(this.responseText))
			songNum = (JSON.parse(this.responseText)).length
			musicList = JSON.parse(this.responseText)
		}else {
			console.log('获取数据失败')
		}	
	}
	xhr.onerror = function(){
		alert('网络异常')
	}
	xhr.send()
}


// 监听音乐事件，修改时长和进度条
	
audioObj.onplay = function(){
	$$('.list-song p')[curIndex].style.color = "#BB3D00"
	// for(i=0;i<songNum;i++){
	// 	if(i!==curIndex){
	// 		$$('.list-song p')[i].style.color = "black"
	// 	}else{
	// 		$$('.list-song p')[i].style.color = "#BB3D00"
	// 	}
	// }
	clock = setInterval(function(){
	var totalmin = Math.floor(audioObj.duration/60)+''
	var totalsec = Math.floor(audioObj.duration%60)+''
	totalsec = totalsec.length === 2 ? totalsec :'0' + totalsec	
	var curmin = Math.floor(audioObj.currentTime/60)
	var cursec = Math.floor(audioObj.currentTime%60)+''
	cursec = cursec.length === 2 ? cursec : '0' + cursec
	$('.timenum').innerText = curmin + ':' + cursec + '/' + totalmin + ':' + totalsec
	$('.curtimebar').style.width = (audioObj.currentTime/audioObj.duration)*100 + '%'		
	},1000)
}
audioObj.onpause = function(){
	clearInterval(clock)
	
}
audioObj.onended = function(){
	curIndex = curIndex===songNum-1 ? curIndex + 1 - songNum : curIndex + 1;
	loadMusic(musicList[curIndex])
}

//绑定事件

// 播放面板控制
//1、进度条和音量控制
$('.totaltimebar').onclick = function(e){
	percentT = e.offsetX/parseInt(getComputedStyle(this).width)
	audioObj.currentTime = percentT * audioObj.duration
	$('.curtimebar').style.width = (audioObj.currentTime/audioObj.duration)*100 + '%'
}

$('.volbar').onclick = function(e){
	percentV = e.offsetX/parseInt(getComputedStyle(this).width)
	audioObj.volume = percentV 
	$('.curvolbar').style.width = percentV *100 +'%'
}

//2、播放按钮
$('.icon-last').onclick = function(){
	$$('.list-song p')[curIndex].style.color = "black"
	curIndex = curIndex===0 ? curIndex - 1 + songNum : curIndex - 1;
	loadMusic(musicList[curIndex])
}
$('.icon-next').onclick = function(){
	$$('.list-song p')[curIndex].style.color = "black"
	curIndex = curIndex===songNum-1 ? curIndex + 1 - songNum : curIndex + 1;
	loadMusic(musicList[curIndex])
}
$('.icon-pause').onclick = function(){
	audioObj.pause()
	this.style.display = "none"
	$('.icon-play').style.display = "inline"
}

$('.icon-play').onclick = function(){
	audioObj.play()
	this.style.display = "none"
	$('.icon-pause').style.display = "inline"
}

//播放顺序按钮
//1、单曲循环
$('.icon-inturn-copy').onclick = function(){
	this.style.display = "none"
	$('.icon-loop').style.display = "inline"
	audioObj.onended = function(){
		curIndex = curIndex
		loadMusic(musicList[curIndex])
	}
}

//2、随机播放

$('.icon-loop').onclick = function() {
	this.style.display = "none"
	$('.icon-random').style.display = "inline"

	$('.icon-last').onclick = function(){
		$$('.list-song p')[curIndex].style.color = "black"
		curIndex = Math.floor(Math.random()*songNum)
		loadMusic(musicList[curIndex])
	}
	$('.icon-next').onclick = function(){
		$$('.list-song p')[curIndex].style.color = "black"
		curIndex = Math.floor(Math.random()*songNum)
		loadMusic(musicList[curIndex])
	}

	audioObj.onended = function(){
		$$('.list-song p')[curIndex].style.color = "black"
		curIndex = Math.floor(Math.random()*songNum)
		loadMusic(musicList[curIndex])
	}
}

//3、顺序播放
$('.icon-random').onclick = function(){
	this.style.display = "none"
	$('.icon-inturn-copy').style.display = "inline"

	$('.icon-last').onclick = function(){
		$$('.list-song p')[curIndex].style.color = "black"
		curIndex = curIndex===0 ? curIndex - 1 + songNum : curIndex - 1;
		loadMusic(musicList[curIndex])
	}
	$('.icon-next').onclick = function(){
		$$('.list-song p')[curIndex].style.color = "black"
		curIndex = curIndex===songNum-1 ? curIndex + 1 - songNum : curIndex + 1;
		loadMusic(musicList[curIndex])
	}
}

//4、点击列表播放
$('.list-song').ondblclick = function(e){
	

	(e.target).style.color = "#BB3D00"

	for (i=0;i<songNum;i++){
		if ((e.target).innerText == $$('.list-song p')[i].innerText){
			curIndex = i 
			loadMusic(musicList[curIndex])	
		}
	}
}


//获取歌词
function getMusicWords(url){
	var xhr = new XMLHttpRequest()
	xhr.open('GET',url,true)
	xhr.onload = function(){
		if((xhr.status >= 200 && xhr.status <= 300) || xhr.status ===304){
			var lines = xhr.response
			//解析歌词
			// lines = lines.split('\n')
			// var pattern = /\[\d{2}:\d{2}.d{2}\]/g
			// if(pattern.test(lines[0]) == false){
			// 	lines = lines.slice(1)
			// }
			// lines.pop()
			// for(i=0;i<lines.length;i++){
			// 	lines[i] = lines[i].split(']')[1]
			// 	$('.words').innerHTML += '<p>' + lines[i] + '</p>'
			// }

			parseLyric(lines)
			return lines
		}else {
			console.log('获取数据失败')
		}	
	}
	xhr.onerror = function(){
		alert('网络异常')
	}
	xhr.send()
}

function parseLyric(text){
	text = text.split('\n')
	var pattern = /\[\d{2}:\d{2}.d{2}\]/g
	if(pattern.test(text[0]) == false){
		text = text.slice(1)
	}
	text.pop()
	for(i=0;i<text.length;i++){
		text[i] = text[i].split(']')[1]
		$('.words').innerHTML += '<p>' + text[i] + '</p>'
	}
}

text1 = getMusicWords('../words/1.lrc')
//text2 = getMusicWords('/words/2.lrc')
//text3 = getMusicWords('/words/3.lrc')





