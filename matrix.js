// 後ろで流れるマトリックス風の文字の雨
(function () {
  const cv = document.getElementById('rain');
  if (!cv) return;
  const cx = cv.getContext('2d');
  const CH = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ0123456789超CHOCORIN';
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, fs, cols, y, dpr;
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fs = W < 600 ? 14 : 18;
    cols = Math.ceil(W / fs);
    y = Array.from({ length: cols }, () => Math.random() * -H / fs);
    cx.fillStyle = '#000'; cx.fillRect(0, 0, W, H);
    if (still) drawStill();
  }
  function ch() { return CH[(Math.random() * CH.length) | 0]; }
  function drawStill() {
    cx.font = fs + 'px monospace';
    for (let i = 0; i < cols; i++) {
      const n = (Math.random() * 14) | 0, s = (Math.random() * H / fs) | 0;
      for (let k = 0; k < n; k++) {
        cx.fillStyle = 'rgba(0,255,102,' + (0.08 + 0.3 * k / n) + ')';
        cx.fillText(ch(), i * fs, (s + k) * fs);
      }
    }
  }
  let last = 0;
  function step(t) {
    requestAnimationFrame(step);
    if (t - last < 55 || document.hidden) return;
    last = t;
    cx.fillStyle = 'rgba(0,0,0,0.08)'; cx.fillRect(0, 0, W, H);
    cx.font = fs + 'px monospace';
    for (let i = 0; i < cols; i++) {
      const yy = y[i] * fs;
      cx.fillStyle = 'rgba(0,255,102,0.55)'; cx.fillText(ch(), i * fs, yy - fs);
      cx.fillStyle = 'rgba(210,255,225,0.85)'; cx.fillText(ch(), i * fs, yy);
      if (yy > H && Math.random() > 0.975) y[i] = 0;
      y[i]++;
    }
  }
  size();
  addEventListener('resize', () => { clearTimeout(size.t); size.t = setTimeout(size, 150); });
  if (!still) requestAnimationFrame(step);
})();

// 題名の下の文字を 1 文字ずつ出す
(function () {
  const el = document.getElementById('typed');
  if (!el) return;
  const lines = JSON.parse(el.dataset.lines);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.innerHTML = lines.map(l => '&gt; ' + l).join('<br>') + ' <span class="cur"></span>';
    return;
  }
  let li = 0, ci = 0, out = '';
  function tick() {
    if (li >= lines.length) { el.innerHTML = out + ' <span class="cur"></span>'; return; }
    const l = lines[li];
    if (ci === 0) out += (li ? '<br>' : '') + '&gt; ';
    out += l[ci++];
    el.innerHTML = out + '<span class="cur"></span>';
    if (ci >= l.length) { li++; ci = 0; setTimeout(tick, 380); } else setTimeout(tick, 45);
  }
  setTimeout(tick, 500);
})();
