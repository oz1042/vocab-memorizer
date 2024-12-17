// 要素の取得
const modal = document.getElementById("modal"); // 説明モーダル
const startButton = document.getElementById("startButton");
const app = document.getElementById("app");
const playBtn = document.getElementById("play");
const resetBtn = document.getElementById("reset");
const timerEl = document.getElementById("timer");
const phaseEl = document.getElementById("phase");
const settingsButton = document.getElementById("settingsButton");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");
const settingsForm = document.getElementById("settingsForm");
const totalTimeEl = document.getElementById("totalTime");

const sound1 = document.getElementById("sound1"); // フェーズ切り替え音
const sound2 = document.getElementById("sound2"); // モーダル操作音

// デフォルト設定
const defaultSettings = {
    phase1: 5, // 意味確認フェーズ秒数
    phase2: 10, // 発音フェーズ秒数
    phase3: 30, // 文作成フェーズ秒数
};

let settings = { ...defaultSettings };
let currentPhase = 1;
let remainingSeconds = settings.phase1;
let timerInterval = null;
let isPlaying = false;
let totalSeconds = 0;

// ローカルストレージから設定を読み込む
function loadSettings() {
    const storedSettings = localStorage.getItem("settings");
    if (storedSettings) {
        settings = JSON.parse(storedSettings);
    } else {
        settings = { ...defaultSettings };
    }

    // 設定フォームに反映
    settingsForm.phase1.value = settings.phase1;
    settingsForm.phase2.value = settings.phase2;
    settingsForm.phase3.value = settings.phase3;
}

// ローカルストレージから総学習時間を読み込む
function loadTotalTime() {
    const storedTotal = localStorage.getItem("totalTime");
    if (storedTotal) {
        totalSeconds = parseInt(storedTotal, 10);
    } else {
        totalSeconds = 0;
    }
    updateTotalTimeDisplay();
}

function saveSettings(newSettings) {
    settings = { ...newSettings };
    localStorage.setItem("settings", JSON.stringify(settings));
}

function saveTotalTime() {
    localStorage.setItem("totalTime", totalSeconds.toString());
}

function formatTotalTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
}

function updateTotalTimeDisplay() {
    totalTimeEl.textContent = formatTotalTime(totalSeconds);
}

function updateTimer() {
    timerEl.textContent = formatTime(remainingSeconds);
}

function updatePhase() {
    switch (currentPhase) {
        case 1:
            phaseEl.textContent = "意味確認フェーズ";
            break;
        case 2:
            phaseEl.textContent = "発音フェーズ";
            break;
        case 3:
            phaseEl.textContent = "文作成フェーズ";
            break;
        default:
            phaseEl.textContent = "終了";
            stopTimer();
            return;
    }
}

// フェーズを次に進める
function nextPhase() {
    if (currentPhase < 3) {
        currentPhase++;
    } else {
        currentPhase = 1;
    }

    remainingSeconds = settings[`phase${currentPhase}`];
    updatePhase();
    updateTimer();

    // フェーズ切り替え時にsound2再生（フェーズ用音）
    sound2.play().catch((error) => {
        console.error("フェーズ音再生エラー:", error);
    });
}

// タイマーを開始
function startTimer() {
    if (isPlaying) return;
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playBtn.classList.add("playing");

    // 初期フェーズ表示更新（このタイミングでは音不要、最初のフェーズは nextPhase未呼出）
    updatePhase();

    timerInterval = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds -= 1;
            totalSeconds += 1;
            updateTimer();
            updateTotalTimeDisplay();
            saveTotalTime();
        } else {
            nextPhase();
        }
    }, 1000);
}

// タイマーを一時停止
function pauseTimer() {
    if (!isPlaying) return;
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    playBtn.classList.remove("playing");
    clearInterval(timerInterval);
}

// タイマーをリセット
function resetTimer() {
    pauseTimer();
    currentPhase = 1;
    remainingSeconds = settings.phase1;
    updatePhase();
    updateTimer();
}

// タイマーを停止
function stopTimer() {
    pauseTimer();
    currentPhase = 1;
    remainingSeconds = settings.phase1;
    updatePhase();
    updateTimer();
}

// イベントリスナー

// 設定モーダルの「閉じる」ボタン
closeSettings.addEventListener("click", () => {
    settingsModal.style.display = "none";
    // モーダル操作音：sound1
    sound1.play().catch((error)=>{
        console.error("モーダル音再生エラー:", error);
    });
    // 設定を保存せずに閉じる場合は単に画面に戻る
});

// 設定フォームの送信
settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newSettings = {
        phase1: parseInt(settingsForm.phase1.value, 10),
        phase2: parseInt(settingsForm.phase2.value, 10),
        phase3: parseInt(settingsForm.phase3.value, 10),
    };
    saveSettings(newSettings);
    settingsModal.style.display = "none";
    resetTimer();
    // 設定保存時もモーダル操作なのでsound1
    sound1.play().catch((error)=>{
        console.error("モーダル音再生エラー:", error);
    });
});

// アプリの説明モーダルの「はじめる」ボタン
startButton.addEventListener("click", () => {
    modal.style.display = "none";
    app.classList.remove("hidden");
    loadSettings();
    loadTotalTime();
    resetTimer();
    // 「はじめる」ボタン押下もモーダル操作扱い → sound1
    sound1.play().catch((error)=>{
        console.error("モーダル音再生エラー:", error);
    });
});

// Play/Pauseボタン
playBtn.addEventListener("click", () => {
    // ボタン操作もモーダル扱い？ユーザ要求は「説明画面や設定画面時は別の音」とあるが
    // Play/Pauseはフェーズ音とは別にするならsound1鳴らしてもよい
    sound1.play().catch((error)=>{
        console.error("モーダル音再生エラー:", error);
    });
    if (isPlaying) {
        pauseTimer();
    } else {
        startTimer();
    }
});

// Resetボタン
resetBtn.addEventListener("click", () => {
    sound1.play().catch((error)=>{
        console.error("モーダル音再生エラー:", error);
    });
    resetTimer();
});

// 設定ボタン（アプリ内から設定モーダルを開く）
settingsButton.addEventListener("click", () => {
    sound1.play().catch((error)=>{
        console.error("モーダル音再生エラー:", error);
    });
    settingsModal.style.display = "flex";
});

// 初期ロード
window.addEventListener("load", () => {
    loadSettings();
    loadTotalTime();
    resetTimer();
});
