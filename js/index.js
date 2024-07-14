/**
 * 请求单词数据
 * @param {string} unit 目录config/下的json文件名
 * @returns {Promise} 加载成功resove否则reject
 */
const requesthWords = (unit) => {
    return fetch("config/" + unit + '.json')
        .then(response => response.json())
        .catch((error) => {
            console.log("fetch error " + unit, error);
            return Promise.reject(error);
        });
}

/**
 * 播放音频
 * @param {number} x id
 */
const playAudio = (x) => {
    const audio = document.getElementById('music' + x);
    audio.play();
}

/**
 * 更新页面显示
 * @param {object} data 数据，即目录config/下json文件中的数据 
 */
const updateDisplay = (data) => {
    // 更新标题
    const titleEle = document.querySelector(".content h1");
    titleEle.innerText = data.title;

    // 更新单词
    const wordsEle = document.querySelector(".content #word-ul");
    wordsEle.scrollTop = 0;
    while (wordsEle.firstChild) {
        wordsEle.removeChild(wordsEle.firstChild);
    }
    data.words.forEach((word) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="word">单词：${word.word}</span>
            <span class="translation">解释：${word.translation}</span>
            <span class="phonetic">音标：${word.phonetic}</span>
            <span class="usage">用法：${word.usage}</span>
            <span class="explain">说明：${word.explain}</span>
            <button onclick="playAudio(${word.id})">播放发音</button>
            <audio controls id="music${word.id}" preload="none" src="http://dict.youdao.com/dictvoice?type=0&audio=${word.word}" hidden></audio>`;
        wordsEle.appendChild(li);
    });
}

const style = document.createElement('style');
style.innerHTML = `
    .content ul li {
        list-style: none;
        margin: 10px 0;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f9f9f9;
        font-size: 1.2em;
    }
    .content ul li .word {
        font-size: 2.5em;
        font-weight: bold;
        color: #333;
    }
    .content ul li .translation, 
    .content ul li .phonetic, 
    .content ul li .usage, 
    .content ul li .explain {
        display: block;
        margin-top: 5px;
        font-size: 1em;
        color: #666;
    }
    .content ul li button {
        margin-top: 10px;
        padding: 5px 10px;
        font-size: 1em;
        color: #fff;
        background-color: #007bff;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }
    .content ul li button:hover {
        background-color: #0056b3;
    }
    .content ul li audio {
        display: none;
    }
`;
document.head.appendChild(style);


/**
 * 设置指定导航为活跃状态
 * @param {HTMLLIElement} item 导航中的li元素
 */
const setActiveNavItem = (item) => {
    activeNavItem && activeNavItem.classList.remove("active");
    item.classList.add("active");
    activeNavItem = item;
}
let activeNavItem;

// 点击导航时的回调
const onClickNav = function () {
    if (this.classList.contains("active")) {
        return;
    }

    const unit = this.dataset ? this.dataset.unit : this.getAttribute("data-unit");
    requesthWords(unit).then((data) => {
        const content = document.querySelector(".content");
        content.classList.remove("show");
        setTimeout(() => {
            setActiveNavItem(this);
            updateDisplay(data);
            content.classList.add("show");
        }, 150);
    });
}
// 导航中的li元素
const navItems = document.querySelectorAll("nav ul li");
navItems.forEach((item) => {
    item.addEventListener("click", onClickNav);
});
onClickNav.call(navItems[0]);

document.body.style.height = window.innerHeight + "px";
window.addEventListener("resize", () => {
    document.body.style.height = window.innerHeight + "px";
});