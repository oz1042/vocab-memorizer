// 要素の取得
const modal = document.getElementById("modal"); // アプリの説明モーダル
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
const currentWordEl = document.getElementById("currentWord");

const sound1 = document.getElementById("sound1");
const sound2 = document.getElementById("sound2");
const sound3 = document.getElementById("sound3");

// デフォルト設定
const defaultSettings = {
    phase1: 5, // 意味確認
    phase2: 10, // 発音
    phase3: 50, // 文作成
};

// 単語リストの例
const words = [
    { word: "apple", meaning: "リンゴ" },
    { word: "book", meaning: "本" },
    { word: "cat", meaning: "猫" },
    // 追加の単語...
];

// アプリの状態
let settings = { ...defaultSettings };
let currentPhase = 1;
let currentWordIndex = 0;
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

// 設定を保存する
function saveSettings(newSettings) {
    settings = { ...newSettings };
    localStorage.setItem("settings", JSON.stringify(settings));
}

// 総学習時間を保存する
function saveTotalTime() {
    localStorage.setItem("totalTime", totalSeconds.toString());
}

// 総学習時間を表示形式に変換
function formatTotalTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// タイマーを表示形式に変換
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
}

// 総学習時間の表示を更新
function updateTotalTimeDisplay() {
    totalTimeEl.textContent = formatTotalTime(totalSeconds);
}

// タイマーの更新
function updateTimer() {
    timerEl.textContent = formatTime(remainingSeconds);
}

// フェーズの更新
function updatePhase() {
    switch (currentPhase) {
        case 1:
            phaseEl.textContent = "意味確認フェーズ";
            if (isPlaying) {
                sound1.play().catch((error) => {
                    console.error("音声再生エラー (sound1):", error);
                });
            }
            break;
        case 2:
            phaseEl.textContent = "発音フェーズ";
            if (isPlaying) {
                sound2.play().catch((error) => {
                    console.error("音声再生エラー (sound2):", error);
                });
            }
            break;
        case 3:
            phaseEl.textContent = "文作成フェーズ";
            if (isPlaying) {
                sound3.play().catch((error) => {
                    console.error("音声再生エラー (sound3):", error);
                });
            }
            break;
        default:
            phaseEl.textContent = "終了";
            stopTimer();
            break;
    }
}

// 単語を表示
function displayCurrentWord() {
    if (currentWordIndex >= words.length) {
        phaseEl.textContent = "全ての単語を学習しました！";
        stopTimer();
        return;
    }
    const currentWord = words[currentWordIndex];
    currentWordEl.textContent = currentWord.word;
}

// フェーズを次に進める
function nextPhase() {
    if (currentPhase < 3) {
        currentPhase += 1;
    } else {
        currentPhase = 1;
        currentWordIndex += 1;
        displayCurrentWord();
    }

    if (currentWordIndex >= words.length) {
        phaseEl.textContent = "全ての単語を学習しました！";
        stopTimer();
        return;
    }

    remainingSeconds = settings[`phase${currentPhase}`];
    updatePhase();
    updateTimer();
}

// タイマーを開始
function startTimer() {
    if (isPlaying) return;
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    playBtn.classList.add("playing");

    // 初期フェーズと単語の表示
    if (currentWordIndex === 0 && currentPhase === 1) {
        displayCurrentWord();
        updatePhase();
    }

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
    currentWordIndex = 0;
    remainingSeconds = settings.phase1;
    displayCurrentWord();
    updatePhase();
    updateTimer();
}

// タイマーを停止
function stopTimer() {
    pauseTimer();
    currentPhase = 1;
    currentWordIndex = 0;
    remainingSeconds = settings.phase1;
    displayCurrentWord();
    updatePhase();
    updateTimer();
}

// イベントリスナー

// 設定モーダルの「閉じる」ボタン
closeSettings.addEventListener("click", () => {
    console.log("Close settings button clicked"); // デバッグ用ログ
    settingsModal.style.display = "none"; // 直接スタイルを変更
    // 設定を保存せずに閉じる場合、必要に応じて設定をリロード
});

// 設定フォームの送信
settingsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Save button clicked"); // デバッグ用ログ
    console.log(
        settingsForm.phase1.value,
        settingsForm.phase2.value,
        settingsForm.phase3.value
    ); // デバッグ用ログ
    const newSettings = {
        phase1: parseInt(settingsForm.phase1.value, 10),
        phase2: parseInt(settingsForm.phase2.value, 10),
        phase3: parseInt(settingsForm.phase3.value, 10),
    };
    saveSettings(newSettings);
    settingsModal.style.display = "none"; // 直接スタイルを変更
    // アプリの説明モーダルを表示
    modal.style.display = "flex";
    resetTimer();
});

// アプリの説明モーダルの「はじめる」ボタン
startButton.addEventListener("click", () => {
    console.log("Start button clicked"); // デバッグ用ログ
    modal.style.display = "none"; // 直接スタイルを変更
    app.classList.remove("hidden");
    loadSettings();
    loadTotalTime();
    resetTimer();
});

// Play/Pauseボタン
playBtn.addEventListener("click", () => {
    if (isPlaying) {
        pauseTimer();
    } else {
        startTimer();
    }
});

// Resetボタン
resetBtn.addEventListener("click", resetTimer);

// 設定ボタン（アプリ内から設定モーダルを開く）
settingsButton.addEventListener("click", () => {
    settingsModal.style.display = "flex"; // 直接スタイルを変更
});

// 初期ロード
window.addEventListener("load", () => {
    loadSettings();
    loadTotalTime();
    resetTimer();
});
