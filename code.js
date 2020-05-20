
/***********************************/
/*http://www.layabox.com  2017/12/12*/
/***********************************/
var gameName ="tanchixiaotutu";
var displayName = '贪吃小兔兔';
var templateId = 'a5bw9rdlj633oh18qt';

var shareText = null;
var videoPath = null;
var loading = false;
let onTap = function(touches, changedTouches, timeStamp){
	console.log(touches.changedTouches[0])
	if(!loading && touches.changedTouches[0].clientX < 300 && touches.changedTouches[0].clientY <100){
		loading = true;
		startRequest();
	}
}
tt.onTouchEnd(onTap);
let canvas = tt.createCanvas();

let ctx = canvas.getContext('2d');
createPath(0,0,300,100);
drawText();
function startRequest(){

showToast(`加载中...`);
let task = tt.request({
    url: 'https://dzy.mplayad.com/myphone/functions/getGameVideo',
    data: {
        game:gameName
    },
    header: {
		"X-Parse-Application-Id":"apollo_online",
        'content-type': 'application/json'
    },
	method:"POST",
    success (res) {
        
		shareText = res.data.result.text;
		setJianjiban(shareText);
		tt.downloadFile({
			url: res.data.result.url,
			success (res) {
				showToast(`download完成`);
				videoPath = res.tempFilePath;
				onStartClick();
				loading=false;
			},
			fail (res) {
				loading=false;
				showToast(`下载失败`);
			}
		});
    },
    fail (res) {
		loading=false;
        showToast(`API请求失败`);
    }
});
}
function onStartClick(){
		if (videoPath != null){
		tt.shareAppMessage({
			channel: 'video',
			title: displayName,
			desc: shareText,
			imageUrl: 'game/shard.png',
			templateId: templateId, 
			query: '',
			extra: {
				videoPath: videoPath, // 可替换成录屏得到的视频地址
				videoTopics: [displayName],
				createChallenge: true
			},
			success() {
				showToast('分享视频成功');
				exitMiniProgram();
			},
			fail(e) {
				reportError(shareText, videoPath,e);
				showToast('分享视频失败');
			}
			})
		}
	}
	
	function showToast(text){
		tt.showToast({
			title: text,
			duration: 2000,
			success (res) {
				//showToast(`${res}`);
			},
			fail (res) {
				showToast(`showToast调用失败`);
			}
		});
	}

	function setJianjiban(text){
		tt.setClipboardData({
			data: text,
			success (res) {
				console.log(`setClipboardData调用成功`);
			},
			fail (res) {
				console.log(`setClipboardData调用失败`);
			}
		});
	}


function createPath(x, y, width, height, radius) {
            ctx.rect(0,0,300,100);
			ctx.fillStyle="#0022ee";
			ctx.fill();	
			
        }

function drawText(){
     var xoffset = ctx.measureText("开始").width;
     var x = 0,
         y = 0;
     ctx.save();
     ctx.beginPath();
     ctx.font = "30px Micosoft yahei";
     ctx.fillStyle = "#000";
     ctx.textBaseline = 'middle';
     ctx.textAlign = 'center';
     ctx.fillText("开始", x + (300 - xoffset) / 2 + 10, y + (100 - 22) / 2 + 5, 300);
     ctx.closePath();
     ctx.restore();
 }


 function reportError(txt,url,e){
	 let reportTask = tt.request({
    url: 'https://dzy.mplayad.com/myphone/functions/uploadFailedInfo',
    data: {
        imei:"",game:gameName,text:txt,url:url,errMsg:e
    },
    header: {
		"X-Parse-Application-Id":"apollo_online",
        'content-type': 'application/json'
    },
	method:"POST",
    success (res) {
    },
    fail (res) {
		loading=false;
        showToast(`上报API请求失败`);
    }
});
}