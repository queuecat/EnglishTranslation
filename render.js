const { ipcRenderer, clipboard } = require('electron')
const axios = require('axios')

function getEn(en) {
    return "https://fanyi.baidu.com/gettts?lan=en&text=" + en + "&spd=5&source=web"
}

function getUk(en) {
    return "https://fanyi.baidu.com/gettts?lan=uk&text=" + en + "&spd=5&source=web"
}

function getZh(en) {
    return "https://fanyi.baidu.com/gettts?lan=zh&text=" + en + "&spd=5&source=web"
}
ipcRenderer.on('question', (event, arg) => {
    console.log(arg) // prints "pong"
    getTranslate(arg);
})

function getTranslate(question) {
    axios({
        url: "https://aidemo.youdao.com/trans",
        method: "post",
        data: "q=" + question
    }).then(({ data: res }) => {
        var audio = document.querySelector("audio");
        var result = res.translation;
        if (/.*[\u4e00-\u9fa5]+.*$/.test(result)) {
            audio.src = getZh(result);
        } else {
            audio.src = getEn(result);
        }
        console.log(audio.src);
        console.log(res);
        // document.querySelector("#zh").innerHTML = question
        document.querySelector("#en").innerHTML = res.translation
        document.querySelector("#copy").addEventListener("click", () => {
            clipboard.writeText(document.querySelector("#en").innerHTML);
            document.querySelector("#copy svg").style.fill = "#4caf50";
            setTimeout(() => {
                document.querySelector("#copy svg").style.fill = "#000";
            }, 2000)
        })
        document.querySelector("#pronunciation").addEventListener("click", function() {
            this.classList.add("sound");
            document.querySelector("#pronunciationSvg").style.opacity = 0;
            try {
                audio.play()
            } catch (error) {
                audio.src = getZh("出现TM的错误了");
                audio.play()
            }
        })
        audio.addEventListener("ended", () => {
            if (document.querySelector("#pronunciation").className.indexOf("sound") != -1) {
                document.querySelector("#pronunciation").classList.remove("sound")
                document.querySelector("#pronunciationSvg").style.opacity = 1;
            }
            console.log(456);
        })
    })
}