// Petualangan Pintu Bilangan Bulat — Kelas VII SMP
// Aturan: 5 level, tiap level 5 pintu, 3 nyawa, benar = +10 poin, bonus +5 tiap 3 benar beruntun.
(function () {
  "use strict";

  var LEVELS = [
    { name: "Level 1 — Hutan Tambah-Kurang", desc: "Penjumlahan dan pengurangan bilangan bulat sederhana." },
    { name: "Level 2 — Gua Kali-Bagi", desc: "Perkalian dan pembagian bilangan bulat." },
    { name: "Level 3 — Jembatan Campuran", desc: "Operasi campuran sederhana dan tanda kurung." },
    { name: "Level 4 — Menara Tanda Kurung", desc: "Operasi campuran bertingkat dengan bilangan lebih besar." },
    { name: "Level 5 — Istana Bilangan Bulat", desc: "Operasi campuran kompleks. Ini tantangan akhir!" }
  ];
  var DOORS_PER_LEVEL = 5;
  var TOTAL_DOORS = 25;

  var state = { level: 1, doorsOpened: 0, score: 0, lives: 3, streak: 0, question: null, nextAction: "next" };
  var soundOn = true;
  var audioCtx = null;

  // ---------- Util ----------
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function fmt(n) { return n < 0 ? "(" + n + ")" : String(n); }
  function fmtFirst(n) { return String(n); }
  function signRule(a, b, op) {
    if (op === "x") {
      if ((a < 0) === (b < 0)) return "Kedua bilangan bertanda sama, jadi hasilnya positif.";
      return "Kedua bilangan berbeda tanda, jadi hasilnya negatif.";
    }
    if (op === ":") {
      if ((a < 0) === (b < 0)) return "Pembagian dua bilangan bertanda sama hasilnya positif.";
      return "Pembagian dua bilangan berbeda tanda hasilnya negatif.";
    }
    return "";
  }

  function makeOptions(answer) {
    var candidates = shuffle([answer + 1, answer - 1, answer + 2, answer - 2, -answer, answer + 10, answer - 10, answer + 5, answer - 5]);
    var chosen = [];
    for (var i = 0; i < candidates.length && chosen.length < 3; i++) {
      if (candidates[i] !== answer && chosen.indexOf(candidates[i]) === -1) chosen.push(candidates[i]);
    }
    return shuffle([answer].concat(chosen));
  }

  // ---------- Pembuat soal ----------
  function level1() {
    var a = randInt(-20, 20), b = randInt(-20, 20), op = pick(["+", "-"]);
    var ans, expl;
    if (op === "+") {
      ans = a + b;
      expl = b < 0
        ? fmtFirst(a) + " + " + fmt(b) + " = " + fmtFirst(a) + " − " + Math.abs(b) + " = " + ans + ". Menambah bilangan negatif sama dengan mengurangi."
        : fmtFirst(a) + " + " + b + " = " + ans + ". Menambah bilangan positif berarti bergerak ke kanan pada garis bilangan.";
    } else {
      ans = a - b;
      expl = b < 0
        ? fmtFirst(a) + " − " + fmt(b) + " = " + fmtFirst(a) + " + " + Math.abs(b) + " = " + ans + ". Mengurangi bilangan negatif sama dengan menambah lawannya."
        : fmtFirst(a) + " − " + b + " = " + ans + ".";
    }
    return { text: fmtFirst(a) + " " + op + " " + fmt(b) + " = … ?", answer: ans, explanation: expl };
  }

  function level2() {
    if (Math.random() < 0.5) {
      var a = randInt(-12, 12), b = randInt(-12, 12);
      if (a === 0) a = 6; if (b === 0) b = -4;
      var ans = a * b;
      return {
        text: fmtFirst(a) + " × " + fmt(b) + " = … ?",
        answer: ans,
        explanation: fmtFirst(a) + " × " + fmt(b) + " = " + ans + ". " + signRule(a, b, "x") + " Kalikan nilai mutlaknya, lalu tentukan tandanya."
      };
    }
    var divisor = randInt(-12, 12); if (divisor === 0) divisor = 4;
    var quotient = randInt(-12, 12); if (quotient === 0) quotient = -3;
    var dividend = divisor * quotient;
    return {
      text: fmtFirst(dividend) + " : " + fmt(divisor) + " = … ?",
      answer: quotient,
      explanation: fmtFirst(dividend) + " : " + fmt(divisor) + " = " + quotient + ", karena " + fmt(divisor) + " × " + fmt(quotient) + " = " + dividend + ". " + signRule(dividend, divisor, ":")
    };
  }

  function level3() {
    var kind = randInt(1, 6);
    if (kind === 1 || kind === 2) {
      var a = randInt(-20, 20), b = randInt(-10, 10), c = randInt(-5, 5);
      if (c === 0) c = 3;
      var prod = b * c, ans, op = kind === 1 ? "+" : "-";
      ans = kind === 1 ? a + prod : a - prod;
      return {
        text: fmtFirst(a) + " " + op + " " + fmt(b) + " × " + fmt(c) + " = … ?",
        answer: ans,
        explanation: "Kerjakan perkalian dulu: " + fmtFirst(b) + " × " + fmt(c) + " = " + prod + ". Lalu " + fmtFirst(a) + " " + op + " " + fmt(prod) + " = " + ans + "."
      };
    }
    if (kind === 3 || kind === 4) {
      var p = randInt(-15, 15), q = randInt(-15, 15), r = randInt(-4, 4);
      if (r === 0) r = -2;
      var inside = kind === 3 ? p + q : p - q, res = inside * r;
      var op2 = kind === 3 ? "+" : "-";
      return {
        text: "(" + p + " " + op2 + " " + fmt(q) + ") × " + fmt(r) + " = … ?",
        answer: res,
        explanation: "Kerjakan yang di dalam kurung dulu: " + p + " " + op2 + " " + fmt(q) + " = " + inside + ". Lalu " + fmtFirst(inside) + " × " + fmt(r) + " = " + res + "."
      };
    }
    if (kind === 5) {
      var m = randInt(-12, 12), n = randInt(-12, 12), o = randInt(-20, 20);
      if (m === 0) m = 5; if (n === 0) n = -3;
      var pr = m * n, total = pr + o;
      return {
        text: fmtFirst(m) + " × " + fmt(n) + " + " + fmt(o) + " = … ?",
        answer: total,
        explanation: "Perkalian dulu: " + fmtFirst(m) + " × " + fmt(n) + " = " + pr + ". Lalu " + fmtFirst(pr) + " + " + fmt(o) + " = " + total + "."
      };
    }
    var div = randInt(-10, 10); if (div === 0) div = 5;
    var quo = randInt(-10, 10); if (quo === 0) quo = 4;
    var dvd = div * quo, add = randInt(-20, 20);
    return {
      text: fmtFirst(dvd) + " : " + fmt(div) + " + " + fmt(add) + " = … ?",
      answer: quo + add,
      explanation: "Pembagian dulu: " + fmtFirst(dvd) + " : " + fmt(div) + " = " + quo + ". Lalu " + fmtFirst(quo) + " + " + fmt(add) + " = " + (quo + add) + "."
    };
  }

  function level4() {
    var kind = randInt(1, 5);
    if (kind === 1) {
      var a = randInt(-15, 15), b = randInt(-15, 15), c = randInt(-15, 15), d = randInt(-15, 15);
      var s1 = a + b, s2 = c - d, ans = s1 * s2;
      return {
        text: "(" + a + " + " + fmt(b) + ") × (" + c + " − " + fmt(d) + ") = … ?",
        answer: ans,
        explanation: "Kurung dulu: " + a + " + " + fmt(b) + " = " + s1 + " dan " + c + " − " + fmt(d) + " = " + s2 + ". Lalu " + fmtFirst(s1) + " × " + fmt(s2) + " = " + ans + "."
      };
    }
    if (kind === 2) {
      var e = randInt(-12, 12), f = randInt(-12, 12), g = randInt(-12, 12), h = randInt(-12, 12);
      if (e === 0) e = 4; if (f === 0) f = -3; if (g === 0) g = 5; if (h === 0) h = -2;
      var p1 = e * f, p2 = g * h, res = p1 - p2;
      return {
        text: fmtFirst(e) + " × " + fmt(f) + " − " + fmt(g) + " × " + fmt(h) + " = … ?",
        answer: res,
        explanation: "Perkalian dulu: " + fmtFirst(e) + " × " + fmt(f) + " = " + p1 + " dan " + fmtFirst(g) + " × " + fmt(h) + " = " + p2 + ". Lalu " + fmtFirst(p1) + " − " + fmt(p2) + " = " + res + "."
      };
    }
    if (kind === 3) {
      var i = randInt(-12, 12), j = randInt(-12, 12);
      if (i === 0) i = 6; if (j === 0) j = -4;
      var div2 = randInt(-10, 10); if (div2 === 0) div2 = 5;
      var quo2 = randInt(-10, 10); if (quo2 === 0) quo2 = 3;
      var dvd2 = div2 * quo2, pr2 = i * j, total2 = pr2 + quo2;
      return {
        text: fmtFirst(i) + " × " + fmt(j) + " + " + fmtFirst(dvd2) + " : " + fmt(div2) + " = … ?",
        answer: total2,
        explanation: "Perkalian dan pembagian dulu: " + fmtFirst(i) + " × " + fmt(j) + " = " + pr2 + " dan " + fmtFirst(dvd2) + " : " + fmt(div2) + " = " + quo2 + ". Lalu " + fmtFirst(pr2) + " + " + fmt(quo2) + " = " + total2 + "."
      };
    }
    if (kind === 4) {
      var div3 = randInt(-9, 9); if (div3 === 0) div3 = -3;
      var quo3 = randInt(-12, 12); if (quo3 === 0) quo3 = 5;
      var diff = div3 * quo3, aa = randInt(-20, 20), bb = aa - diff, add3 = randInt(-20, 20);
      return {
        text: "(" + aa + " − " + fmt(bb) + ") : " + fmt(div3) + " + " + fmt(add3) + " = … ?",
        answer: quo3 + add3,
        explanation: "Kurung dulu: " + aa + " − " + fmt(bb) + " = " + diff + ". Lalu " + fmtFirst(diff) + " : " + fmt(div3) + " = " + quo3 + ", kemudian " + fmtFirst(quo3) + " + " + fmt(add3) + " = " + (quo3 + add3) + "."
      };
    }
    var k = randInt(-20, 20), l = randInt(-10, 10), m = randInt(-5, 5), n = randInt(-20, 20);
    if (m === 0) m = 4;
    var pr3 = l * m, res3 = k + pr3 - n;
    return {
      text: fmtFirst(k) + " + " + fmt(l) + " × " + fmt(m) + " − " + fmt(n) + " = … ?",
      answer: res3,
      explanation: "Perkalian dulu: " + fmtFirst(l) + " × " + fmt(m) + " = " + pr3 + ". Lalu dari kiri ke kanan: " + fmtFirst(k) + " + " + fmt(pr3) + " − " + fmt(n) + " = " + res3 + "."
    };
  }

  function level5() {
    var kind = randInt(1, 5);
    if (kind === 1) {
      var div = randInt(-12, 12); if (div === 0) div = 6;
      var quo = randInt(-12, 12); if (quo === 0) quo = -4;
      var dvd = div * quo, a = randInt(-20, 20), b = randInt(-9, 9), c = randInt(-5, 5);
      if (c === 0) c = 3;
      var pr = b * c, inside = a + pr, ans = inside - quo;
      return {
        text: "(" + a + " + " + fmt(b) + " × " + fmt(c) + ") − " + fmtFirst(dvd) + " : " + fmt(div) + " = … ?",
        answer: ans,
        explanation: "Di dalam kurung, perkalian dulu: " + fmtFirst(b) + " × " + fmt(c) + " = " + pr + ", sehingga kurung = " + inside + ". Pembagian: " + fmtFirst(dvd) + " : " + fmt(div) + " = " + quo + ". Lalu " + fmtFirst(inside) + " − " + fmt(quo) + " = " + ans + "."
      };
    }
    if (kind === 2) {
      var p = randInt(-20, 20), q = randInt(-20, 20), r = randInt(-8, 8), s = randInt(-10, 10), t = randInt(-10, 10);
      if (r === 0) r = -3; if (s === 0) s = 4; if (t === 0) t = -5;
      var diff = p - q, pr1 = diff * r, pr2 = s * t, total = pr1 + pr2;
      return {
        text: "(" + p + " − " + fmt(q) + ") × " + fmt(r) + " + " + fmt(s) + " × " + fmt(t) + " = … ?",
        answer: total,
        explanation: "Kurung dulu: " + p + " − " + fmt(q) + " = " + diff + ". Lalu " + fmtFirst(diff) + " × " + fmt(r) + " = " + pr1 + " dan " + fmtFirst(s) + " × " + fmt(t) + " = " + pr2 + ". Jumlahnya: " + fmtFirst(pr1) + " + " + fmt(pr2) + " = " + total + "."
      };
    }
    if (kind === 3) {
      // Cari a x b yang habis dibagi c dengan mencoba beberapa kali.
      var a3 = 6, b3 = 8, c3 = 4, q3 = 12, prod3 = 48;
      for (var tries = 0; tries < 50; tries++) {
        var ta = randInt(-15, 15), tc = randInt(-9, 9);
        if (ta === 0 || tc === 0) continue;
        var tq = randInt(-15, 15); if (tq === 0) continue;
        var tp = tc * tq;
        if (tp % ta === 0) { a3 = ta; c3 = tc; q3 = tq; prod3 = tp; b3 = tp / ta; break; }
      }
      var add3 = randInt(-30, 30);
      return {
        text: fmtFirst(a3) + " × " + fmt(b3) + " : " + fmt(c3) + " + " + fmt(add3) + " = … ?",
        answer: q3 + add3,
        explanation: "Perkalian dan pembagian dulu: " + fmtFirst(a3) + " × " + fmt(b3) + " = " + prod3 + ", lalu " + fmtFirst(prod3) + " : " + fmt(c3) + " = " + q3 + ". Kemudian " + fmtFirst(q3) + " + " + fmt(add3) + " = " + (q3 + add3) + "."
      };
    }
    if (kind === 4) {
      var u = randInt(-20, 20), v = randInt(-20, 20), w = randInt(-15, 15), x = randInt(-15, 15), y = randInt(-25, 25);
      var sA = u + v, sB = w - x, prA = sA * sB, ans4 = prA + y;
      return {
        text: "(" + u + " + " + fmt(v) + ") × (" + w + " − " + fmt(x) + ") + " + fmt(y) + " = … ?",
        answer: ans4,
        explanation: "Kurung dulu: " + u + " + " + fmt(v) + " = " + sA + " dan " + w + " − " + fmt(x) + " = " + sB + ". Lalu " + fmtFirst(sA) + " × " + fmt(sB) + " = " + prA + ", kemudian " + fmtFirst(prA) + " + " + fmt(y) + " = " + ans4 + "."
      };
    }
    var div5 = randInt(-12, 12); if (div5 === 0) div5 = -4;
    var quo5 = randInt(-12, 12); if (quo5 === 0) quo5 = 6;
    var dvd5 = div5 * quo5, a5 = randInt(-30, 30), b5 = randInt(-9, 9), c5 = randInt(-6, 6);
    if (c5 === 0) c5 = -2;
    var pr5 = b5 * c5, ans5 = a5 - pr5 + quo5;
    return {
      text: fmtFirst(a5) + " − " + fmt(b5) + " × " + fmt(c5) + " + " + fmtFirst(dvd5) + " : " + fmt(div5) + " = … ?",
      answer: ans5,
      explanation: "Perkalian dan pembagian dulu: " + fmtFirst(b5) + " × " + fmt(c5) + " = " + pr5 + " dan " + fmtFirst(dvd5) + " : " + fmt(div5) + " = " + quo5 + ". Lalu dari kiri ke kanan: " + fmtFirst(a5) + " − " + fmt(pr5) + " + " + fmt(quo5) + " = " + ans5 + "."
    };
  }

  var GENERATORS = [null, level1, level2, level3, level4, level5];
  function newQuestionObject() { return GENERATORS[state.level](); }

  // ---------- Suara sederhana (Web Audio, tanpa file eksternal) ----------
  function beep(freq, dur) {
    if (!soundOn) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.type = "sine"; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + dur);
    } catch (e) { /* suara opsional, game tetap jalan */ }
  }

  // ---------- DOM ----------
  function el(id) { return document.getElementById(id); }
  function showScreen(id) {
    ["start-screen", "game-screen", "end-screen"].forEach(function (sid) {
      el(sid).classList.toggle("active", sid === id);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function hearts(n) {
    var out = "";
    for (var i = 0; i < 3; i++) out += i < n ? "❤️" : "🤍";
    return out;
  }

  function renderStatus() {
    el("level-label").textContent = state.level + " / 5";
    el("score-label").textContent = state.score;
    el("lives-label").textContent = hearts(state.lives);
    el("lives-label").setAttribute("aria-label", state.lives + " nyawa");
    el("streak-label").textContent = state.streak;
    el("level-name").textContent = LEVELS[state.level - 1].name;
    el("level-desc").textContent = LEVELS[state.level - 1].desc;
    var overall = ((state.level - 1) * DOORS_PER_LEVEL + state.doorsOpened) / TOTAL_DOORS * 100;
    el("track-fill").style.width = overall + "%";
    el("player").style.left = Math.min(96, overall) + "%";
    var doorsEl = el("doors"); doorsEl.innerHTML = "";
    for (var i = 0; i < DOORS_PER_LEVEL; i++) {
      var d = document.createElement("div");
      d.className = "door" + (i < state.doorsOpened ? " open" : "") + (i === state.doorsOpened && state.doorsOpened < DOORS_PER_LEVEL ? " current" : "");
      d.innerHTML = (i < state.doorsOpened ? "✅" : "🚪") + "<small>Pintu " + (i + 1) + "</small>";
      doorsEl.appendChild(d);
    }
    el("door-label").textContent = state.doorsOpened >= DOORS_PER_LEVEL
      ? "Semua pintu di level ini terbuka!"
      : "Pintu " + (state.doorsOpened + 1) + " dari 5 masih terkunci.";
    el("door-number").textContent = Math.min(state.doorsOpened + 1, DOORS_PER_LEVEL);
  }

  function newQuestion() {
    state.question = newQuestionObject();
    var options = makeOptions(state.question.answer);
    renderStatus();
    el("question-text").textContent = state.question.text;
    var answersEl = el("answers"); answersEl.innerHTML = "";
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "answer-btn"; btn.textContent = opt;
      btn.addEventListener("click", function () { onAnswer(opt, btn); });
      answersEl.appendChild(btn);
    });
    var fb = el("feedback"); fb.className = "feedback"; fb.innerHTML = ""; fb.hidden = true;
    var next = el("next-btn"); next.hidden = true;
  }

  function onAnswer(selected, btn) {
    var q = state.question, correct = selected === q.answer;
    var buttons = el("answers").querySelectorAll(".answer-btn");
    buttons.forEach(function (b) {
      b.disabled = true;
      if (Number(b.textContent) === q.answer) b.classList.add("correct");
    });
    var fb = el("feedback"); fb.hidden = false;
    var next = el("next-btn");
    if (correct) {
      btn.classList.add("correct");
      beep(660, 0.18);
      state.score += 10;
      state.streak += 1;
      var bonus = "";
      if (state.streak % 3 === 0) { state.score += 5; bonus = " Bonus beruntun +5 poin!"; }
      state.doorsOpened += 1;
      fb.className = "feedback show good";
      fb.innerHTML = "<strong>Benar! Pintu terbuka! 🎉</strong>" + q.explanation + bonus;
      renderStatus();
      if (state.doorsOpened >= DOORS_PER_LEVEL) {
        state.nextAction = "level";
        next.textContent = state.level >= 5 ? "Lihat Hasil Akhir 🏆" : "Lanjut ke Level " + (state.level + 1) + " →";
      } else {
        state.nextAction = "next";
        next.textContent = "Pintu Berikutnya →";
      }
    } else {
      btn.classList.add("wrong");
      beep(180, 0.25);
      state.lives -= 1;
      state.streak = 0;
      fb.className = "feedback show bad";
      fb.innerHTML = "<strong>Belum tepat. Pintu masih terkunci.</strong>Jawaban yang benar adalah <strong>" + q.answer + "</strong>. " + q.explanation + " Nyawamu tersisa " + state.lives + ".";
      renderStatus();
      if (state.lives <= 0) {
        state.nextAction = "lose";
        next.textContent = "Lihat Hasil";
      } else {
        state.nextAction = "retry";
        next.textContent = "Coba Pintu Ini Lagi ↻";
      }
    }
    next.hidden = false;
    next.focus();
  }

  function showEnd(win) {
    el("end-emoji").textContent = win ? "🏆" : "💪";
    el("end-title").textContent = win ? "Kamu Menang!" : "Permainan Berakhir";
    el("end-message").textContent = win
      ? "Luar biasa! Kamu membuka semua 25 pintu dan menaklukkan Istana Bilangan Bulat."
      : "Jangan menyerah! Kamu sudah berjuang membuka pintu-pintu itu. Pelajari pembahasannya, lalu coba lagi.";
    el("final-score").textContent = state.score;
    el("final-level").textContent = state.level + " / 5";
    el("final-lives").textContent = hearts(Math.max(0, state.lives));
    el("end-tip").textContent = win
      ? "Coba lagi untuk meningkatkan skormu, atau tantang temanmu untuk mengalahkan skor ini."
      : "Tip: perhatikan tanda negatif, kerjakan kurung dulu, lalu perkalian dan pembagian sebelum penjumlahan dan pengurangan.";
    showScreen("end-screen");
    if (win) beep(880, 0.3);
  }

  function startGame() {
    state.level = 1; state.doorsOpened = 0; state.score = 0; state.lives = 3; state.streak = 0;
    showScreen("game-screen");
    newQuestion();
  }

  // ---------- Event ----------
  el("start-btn").addEventListener("click", function () { beep(520, 0.12); startGame(); });
  el("play-again-btn").addEventListener("click", startGame);
  el("restart-btn").addEventListener("click", startGame);
  el("back-btn").addEventListener("click", function () { showScreen("start-screen"); });
  el("next-btn").addEventListener("click", function () {
    beep(520, 0.1);
    if (state.nextAction === "lose") { showEnd(false); return; }
    if (state.nextAction === "level") {
      if (state.level >= 5) { showEnd(true); return; }
      state.level += 1; state.doorsOpened = 0;
    }
    newQuestion();
  });
  el("sound-btn").addEventListener("click", function () {
    soundOn = !soundOn;
    el("sound-btn").textContent = soundOn ? "🔊 Suara: Nyala" : "🔇 Suara: Mati";
    if (soundOn) beep(520, 0.1);
  });
})();
