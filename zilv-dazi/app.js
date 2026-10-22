(() => {
  // ---------- helpers ----------
  const $ = (s) => document.querySelector(s);
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const k of kids.flat()) {
      if (k == null || k === false) continue;
      el.append(k.nodeType ? k : document.createTextNode(String(k)));
    }
    return el;
  }
  const pad = (n) => String(n).padStart(2, "0");
  const dkey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const WD = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const longDate = (d) => `${d.getMonth() + 1}月${d.getDate()}日 ${WD[d.getDay()]}`;
  function friendlyDate(k) {
    if (k === dkey()) return "今天";
    if (k === dkey(addDays(new Date(), -1))) return "昨天";
    return longDate(parseKey(k));
  }
  const hm = (iso) => { const d = new Date(iso); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 2800);
  }
  const COLORS = ["#C8352B", "#2B7A68", "#3E63B8", "#9A5BB0", "#C27A1A", "#2F8FA6"];
  function colorOf(id) { let n = 0; for (const c of id || "") n = (n * 31 + c.charCodeAt(0)) >>> 0; return COLORS[n % COLORS.length]; }

  // ---------- config ----------
  const cfg = window.ZILV_CONFIG || {};
  if (!window.supabase || !cfg.SUPABASE_URL || cfg.SUPABASE_URL.includes("YOUR-PROJECT")) {
    $("#loading").hidden = true; $("#config-missing").hidden = false; return;
  }
  const sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

  // ---------- state ----------
  const S = {
    uid: null, profiles: {}, goals: [], checkins: [], comments: [], cheers: [], loaded: false,
    draft: { done: new Set(), note: "", photoUrl: null, dirty: false, synced: false },
    manage: false, feedLimit: 30, cdraft: {}, view: "today", seenFeed: 0, channel: null,
  };
  try { S.seenFeed = Number(localStorage.getItem("zl-seen") || 0); } catch (e) {}

  const myGoals = () => S.goals.filter((g) => g.user_id === S.uid);
  const myToday = () => S.checkins.find((c) => c.user_id === S.uid && c.date === dkey());
  const memberIds = () => Object.keys(S.profiles);
  const nameOf = (uid) => (S.profiles[uid] && S.profiles[uid].nick) || "搭子";
  function avatar(uid, small) {
    const n = nameOf(uid);
    const el = h("span", { class: "av initial" + (small ? " sm" : ""), "aria-hidden": "true", text: [...n][0] || "?" });
    el.style.setProperty("--ring", colorOf(uid));
    return el;
  }
  function errMsg(e) {
    const m = (e && (e.message || e.error_description)) || "";
    if (/row-level security|permission/i.test(m)) return "没有权限，请重新登录后再试。";
    if (/Failed to fetch|NetworkError|network/i.test(m)) return "网络不太好，没有保存成功，请再试一次。";
    return "没有保存成功：" + (m || "未知错误");
  }
  async function run(promise) {
    const { data, error } = await promise;
    if (error) { toast(errMsg(error)); return null; }
    return data ?? true;
  }

  // ---------- data ----------
  async function loadAll() {
    const [p, g, c, m, ch] = await Promise.all([
      sb.from("profiles").select("id,nick"),
      sb.from("goals").select("id,user_id,title,created_at").order("created_at"),
      sb.from("checkins").select("*").order("date", { ascending: false }).order("updated_at", { ascending: false }).limit(1000),
      sb.from("comments").select("*").order("created_at").limit(2000),
      sb.from("cheers").select("checkin_id,user_id"),
    ]);
    const err = [p, g, c, m, ch].find((r) => r.error);
    if (err) { toast(errMsg(err.error)); return; }
    S.profiles = Object.fromEntries(p.data.map((r) => [r.id, r]));
    S.goals = g.data; S.checkins = c.data; S.comments = m.data; S.cheers = ch.data;
    S.loaded = true;
    renderAll();
  }
  let reloadT;
  const reloadSoon = () => { clearTimeout(reloadT); reloadT = setTimeout(loadAll, 300); };

  function subscribe() {
    if (S.channel) return;
    S.channel = sb.channel("zilv-all");
    for (const t of ["profiles", "goals", "checkins", "comments", "cheers"]) {
      S.channel.on("postgres_changes", { event: "*", schema: "public", table: t }, reloadSoon);
    }
    S.channel.subscribe();
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden && S.uid) loadAll(); });

  // ---------- stats ----------
  function statsFor(uid) {
    const mine = S.checkins.filter((c) => c.user_id === uid);
    const days = new Set(mine.map((c) => c.date));
    let streak = 0, cur = new Date();
    if (!days.has(dkey(cur))) cur = addDays(cur, -1);
    while (days.has(dkey(cur))) { streak++; cur = addDays(cur, -1); }
    const now = new Date(), dow = (now.getDay() + 6) % 7, monday = addDays(now, -dow);
    const weekKeys = new Set(); for (let i = 0; i <= dow; i++) weekKeys.add(dkey(addDays(monday, i)));
    let week = 0, weekGoals = 0;
    for (const c of mine) if (weekKeys.has(c.date)) { week++; weekGoals += (c.goals || []).filter((g) => g.done).length; }
    let best = 0, run = 0, prev = null;
    for (const k of [...days].sort()) {
      run = prev && dkey(addDays(parseKey(prev), 1)) === k ? run + 1 : 1;
      best = Math.max(best, run); prev = k;
    }
    return { streak, week, weekGoals, total: days.size, best, days, dow };
  }

  // ---------- render ----------
  function renderAll() { renderTop(); renderToday(); renderFeed(); renderBoard(); }

  function renderTop() {
    const box = $("#me"); box.replaceChildren();
    if (!S.uid) return;
    box.append(h("span", { text: nameOf(S.uid) }), avatar(S.uid),
      h("button", { class: "linkbtn", type: "button", onclick: logout }, "退出"));
    const unseen = S.checkins.filter((c) => c.user_id !== S.uid && new Date(c.updated_at).getTime() > S.seenFeed).length;
    const ft = $("#tab-feed"); ft.replaceChildren("动态");
    if (unseen && S.view !== "feed") ft.append(h("span", { class: "dot", "aria-label": "有新动态" }));
  }

  function renderToday() {
    if (!S.loaded) return;
    const isMember = !!S.profiles[S.uid];
    $("#onboard").hidden = isMember;
    $("#today-main").hidden = !isMember;
    if (!isMember) return;
    $("#today-date").textContent = longDate(new Date());

    const existing = myToday();
    if (existing && !S.draft.dirty && !S.draft.synced) {
      S.draft.done = new Set((existing.goals || []).filter((g) => g.done).map((g) => g.id));
      S.draft.note = existing.note || "";
      S.draft.photoUrl = existing.photo_url || null;
      $("#note").value = S.draft.note;
      S.draft.synced = true;
    }
    $("#today-stamp").hidden = !existing;
    $("#checkin-btn").textContent = existing ? "更新今天的打卡" : "打卡";
    const pv = $("#photo-preview");
    pv.hidden = !S.draft.photoUrl; if (S.draft.photoUrl) pv.src = S.draft.photoUrl;
    $("#photo-remove").hidden = !S.draft.photoUrl;
    $("#photo-btn").textContent = S.draft.photoUrl ? "换一张" : "添加照片";
    $("#manage-btn").textContent = S.manage ? "完成" : "管理目标";

    const list = $("#goal-list"); list.replaceChildren();
    const goals = myGoals();
    if (!goals.length) list.append(h("li", { class: "empty-goals", text: "还没有目标。先在下面加一两个每天想坚持的小事。" }));
    for (const g of goals) {
      const on = S.draft.done.has(g.id);
      list.append(h("li", { class: "goal" },
        h("button", { class: "tick", type: "button", role: "checkbox", "aria-checked": on ? "true" : "false", "aria-label": g.title,
          onclick: () => { on ? S.draft.done.delete(g.id) : S.draft.done.add(g.id); S.draft.dirty = true; renderToday(); } }, "完"),
        h("span", { class: "t" + (on ? " done" : ""), text: g.title }),
        S.manage ? h("button", { class: "x", type: "button", "aria-label": "删除目标 " + g.title, onclick: () => removeGoal(g) }, "×") : null));
    }

    const ids = memberIds();
    const box = $("#buddies"); box.replaceChildren(h("div", { class: "eyebrow", text: "搭子们今天" }));
    if (ids.length < 2) {
      box.append(h("p", { class: "hint", style: "margin-top:8px" },
        "还没有搭子加入。把这个网站的网址发给朋友，她注册一个账号、起好名字，就会出现在这里。"));
    }
    for (const id of ids) {
      const st = statsFor(id);
      const did = S.checkins.some((c) => c.user_id === id && c.date === dkey());
      box.append(h("div", { class: "buddy", style: "margin-top:12px" },
        avatar(id, true),
        h("div", { class: "who" }, h("b", { text: nameOf(id) + (id === S.uid ? "（我）" : "") }),
          h("div", { class: "hint", text: `连续 ${st.streak} 天 · 本周 ${st.week} 天` })),
        h("span", { class: "pill " + (did ? "ok" : "wait"), text: did ? "已打卡" : "还没打卡" })));
    }
  }

  function renderFeed() {
    if (!S.loaded) return;
    const box = $("#v-feed");
    const active = document.activeElement && document.activeElement.id;
    const sel = active && document.activeElement.selectionStart;
    const posts = S.checkins.slice(0, S.feedLimit);
    const nodes = [];
    if (!posts.length) nodes.push(h("div", { class: "card" }, h("h2", { text: "还没有动态" }),
      h("p", { class: "hint", text: "在「今天」里打第一个卡，你和搭子的每日记录都会出现在这里，可以互相评论和加油。" })));
    for (const c of posts) {
      const goals = c.goals || [];
      const doneN = goals.filter((g) => g.done).length;
      const cheers = S.cheers.filter((x) => x.checkin_id === c.id);
      const iCheered = cheers.some((x) => x.user_id === S.uid);
      const cmts = S.comments.filter((x) => x.checkin_id === c.id);
      const inputId = "c-" + c.id;
      nodes.push(h("article", { class: "card post" },
        h("header", null, avatar(c.user_id, true),
          h("div", { class: "meta" }, h("b", { text: nameOf(c.user_id) }), h("br"),
            h("small", { text: `${friendlyDate(c.date)} · ${hm(c.updated_at)}` })),
          goals.length ? h("span", { class: "pill " + (doneN === goals.length ? "ok" : "wait"), text: `完成 ${doneN}/${goals.length}` }) : null),
        goals.length ? h("ul", { class: "chips" }, goals.map((g) => h("li", { class: "chip" + (g.done ? " done" : ""), text: (g.done ? "✓ " : "") + g.title }))) : null,
        c.note ? h("p", { class: "note", text: c.note }) : null,
        c.photo_url ? h("img", { class: "photo", src: c.photo_url, alt: "打卡照片", loading: "lazy" }) : null,
        h("div", { class: "actions" },
          h("button", { class: "cheer", type: "button", "aria-pressed": iCheered ? "true" : "false", onclick: () => toggleCheer(c, iCheered) },
            `加油${cheers.length ? " · " + cheers.length : ""}`),
          cheers.length ? h("span", { class: "cheerers", text: cheers.map((x) => nameOf(x.user_id)).join("、") + " 给了加油" }) : null),
        h("div", { class: "comments" },
          cmts.map((m) => h("div", { class: "cmt" }, h("b", { text: nameOf(m.user_id) }), m.text,
            h("small", { text: hm(m.created_at) }),
            m.user_id === S.uid ? h("button", { class: "linkbtn", type: "button", style: "margin-left:6px", onclick: () => removeComment(m) }, "删除") : null)),
          h("form", { class: "cform", onsubmit: (e) => { e.preventDefault(); addComment(c, inputId); } },
            h("label", { class: "sr", for: inputId, text: "写评论" }),
            h("input", { type: "text", id: inputId, maxlength: "300", placeholder: c.user_id === S.uid ? "补充点什么…" : "夸夸 TA，或者督促一下…",
              value: S.cdraft[inputId] || "", oninput: (e) => (S.cdraft[inputId] = e.target.value) }),
            h("button", { class: "ghost", type: "submit" }, "发送")))));
    }
    if (S.checkins.length > S.feedLimit) nodes.push(h("button", { class: "ghost", type: "button", onclick: () => { S.feedLimit += 30; renderFeed(); } }, "显示更早的打卡"));
    box.replaceChildren(...nodes);
    if (active && active.startsWith("c-")) {
      const el = document.getElementById(active);
      if (el) { el.focus(); try { el.setSelectionRange(sel, sel); } catch (e) {} }
    }
  }

  function renderBoard() {
    if (!S.loaded) return;
    const box = $("#v-board");
    const rows = memberIds().map((id) => ({ id, st: statsFor(id) }))
      .sort((a, b) => b.st.streak - a.st.streak || b.st.week - a.st.week || b.st.total - a.st.total);
    const leader = rows.length > 1 && (rows[0].st.streak > rows[1].st.streak || (rows[0].st.streak === rows[1].st.streak && rows[0].st.week > rows[1].st.week)) ? rows[0].id : null;
    const nodes = [];
    if (!rows.length) nodes.push(h("div", { class: "card" }, h("h2", { text: "还没有人上榜" }), h("p", { class: "hint", text: "起好名字、打完第一个卡，就会出现在这里。" })));
    const today = new Date(), dow = (today.getDay() + 6) % 7, start = addDays(today, -dow - 28);
    for (const { id, st } of rows) {
      const cal = h("div", { class: "cal", "aria-label": "最近五周打卡日历" });
      for (const w of ["一", "二", "三", "四", "五", "六", "日"]) cal.append(h("div", { class: "wd", text: w }));
      for (let i = 0; i < 35; i++) {
        const d = addDays(start, i), k = dkey(d);
        const cls = "d" + (st.days.has(k) ? " on" : "") + (k === dkey() ? " today" : "") + (d > today ? " future" : "");
        cal.append(h("div", { class: cls, title: k, text: d.getDate() }));
      }
      nodes.push(h("div", { class: "card" },
        h("div", { class: "board-head" }, avatar(id),
          h("div", { class: "who" }, h("b", { text: nameOf(id) + (id === S.uid ? "（我）" : "") })),
          leader === id ? h("span", { class: "pill lead", text: "领先" }) : null),
        h("div", { class: "big" }, h("span", { class: "n", text: st.streak }), h("span", { class: "u", text: "天连续打卡" })),
        h("div", { class: "stats" },
          h("div", null, h("b", { text: `${st.week}/${st.dow + 1}` }), h("span", { text: "本周天数" })),
          h("div", null, h("b", { text: st.weekGoals }), h("span", { text: "本周完成目标" })),
          h("div", null, h("b", { text: st.best }), h("span", { text: "最长连续" })),
          h("div", null, h("b", { text: st.total }), h("span", { text: "累计天数" }))),
        cal));
    }
    if (rows.length) nodes.push(h("p", { class: "hint", style: "text-align:center", text: "排名先看连续天数，一样的话看本周打卡天数。断一天，连续就从 0 开始。" }));
    box.replaceChildren(...nodes);
  }

  // ---------- actions ----------
  $("#onboard").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nick = $("#nick-input").value.trim();
    if (!nick) return;
    $("#nick-btn").disabled = true;
    if (await run(sb.from("profiles").upsert({ id: S.uid, nick }))) await loadAll();
    $("#nick-btn").disabled = false;
  });

  $("#goal-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = $("#goal-input").value.trim();
    if (!title) return;
    if (myGoals().length >= 12) { toast("目标最多 12 个，先删掉一些吧。"); return; }
    if (await run(sb.from("goals").insert({ user_id: S.uid, title }))) { $("#goal-input").value = ""; await loadAll(); }
  });

  async function removeGoal(g) {
    S.draft.done.delete(g.id);
    if (await run(sb.from("goals").delete().eq("id", g.id))) await loadAll();
  }

  $("#manage-btn").addEventListener("click", () => { S.manage = !S.manage; renderToday(); });
  $("#note").addEventListener("input", (e) => { S.draft.note = e.target.value; S.draft.dirty = true; });

  async function compress(file) {
    try {
      const bmp = await createImageBitmap(file);
      const s = Math.min(1, 1280 / Math.max(bmp.width, bmp.height));
      const c = document.createElement("canvas");
      c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
      c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
      return await new Promise((r) => c.toBlob((b) => r(b || file), "image/jpeg", 0.82));
    } catch (e) { return file; }
  }
  $("#photo-input").addEventListener("change", async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    $("#photo-btn").textContent = "上传中…";
    const blob = await compress(f);
    const path = `${S.uid}/${dkey()}-${Date.now()}.jpg`;
    const { error } = await sb.storage.from("photos").upload(path, blob, { contentType: "image/jpeg" });
    if (error) toast("照片没有上传成功：" + error.message);
    else {
      S.draft.photoUrl = sb.storage.from("photos").getPublicUrl(path).data.publicUrl;
      S.draft.dirty = true;
      toast("照片已添加，记得点打卡保存。");
    }
    renderToday();
  });
  $("#photo-remove").addEventListener("click", () => { S.draft.photoUrl = null; S.draft.dirty = true; renderToday(); });

  $("#checkin-btn").addEventListener("click", async () => {
    const goals = myGoals();
    const note = $("#note").value.trim();
    const doneN = goals.filter((g) => S.draft.done.has(g.id)).length;
    if (!note && !doneN && !S.draft.photoUrl) { toast("勾一个完成的目标，或者写一句今天做了什么。"); return; }
    const existing = myToday();
    const btn = $("#checkin-btn"); btn.disabled = true;
    const ok = await run(sb.from("checkins").upsert({
      user_id: S.uid, date: dkey(),
      goals: goals.map((g) => ({ id: g.id, title: g.title, done: S.draft.done.has(g.id) })),
      note, photo_url: S.draft.photoUrl || null, updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,date" }));
    btn.disabled = false;
    if (ok) {
      S.draft.dirty = false; S.draft.synced = true;
      toast(existing ? "已更新今天的打卡" : "打卡成功！今天也很棒");
      await loadAll();
      const st = $("#today-stamp"); st.hidden = false; st.classList.remove("pop"); void st.offsetWidth; st.classList.add("pop");
    }
  });

  async function toggleCheer(c, on) {
    const q = on
      ? sb.from("cheers").delete().eq("checkin_id", c.id).eq("user_id", S.uid)
      : sb.from("cheers").insert({ checkin_id: c.id, user_id: S.uid });
    if (await run(q)) await loadAll();
  }
  async function addComment(c, inputId) {
    const el = document.getElementById(inputId);
    const text = (el ? el.value : S.cdraft[inputId] || "").trim();
    if (!text) return;
    if (await run(sb.from("comments").insert({ checkin_id: c.id, user_id: S.uid, text }))) {
      S.cdraft[inputId] = ""; if (el) el.value = "";
      await loadAll();
    }
  }
  async function removeComment(m) { if (await run(sb.from("comments").delete().eq("id", m.id))) await loadAll(); }

  // ---------- tabs ----------
  function show(view) {
    S.view = view;
    for (const b of document.querySelectorAll(".tabs button")) b.setAttribute("aria-selected", b.dataset.view === view ? "true" : "false");
    for (const v of ["today", "feed", "board"]) $("#v-" + v).hidden = v !== view;
    if (view === "feed") {
      S.seenFeed = Date.now();
      try { localStorage.setItem("zl-seen", String(S.seenFeed)); } catch (e) {}
    }
    renderTop();
    window.scrollTo(0, 0);
  }
  for (const b of document.querySelectorAll(".tabs button")) b.addEventListener("click", () => show(b.dataset.view));

  // ---------- auth ----------
  let signUpMode = false;
  function setAuthMode(up) {
    signUpMode = up;
    $("#auth-title").textContent = up ? "注册" : "登录";
    $("#auth-sub").textContent = up ? "起个昵称，用邮箱和密码注册。" : "用邮箱和密码登录，你和搭子的打卡都在这里。";
    $("#nick-wrap").hidden = !up;
    $("#auth-btn").textContent = up ? "注册并开始" : "登录";
    $("#auth-switch").textContent = up ? "已经有账号了？去登录" : "还没有账号？注册一个";
    $("#auth-pass").autocomplete = up ? "new-password" : "current-password";
    $("#auth-err").hidden = true;
  }
  $("#auth-switch").addEventListener("click", () => setAuthMode(!signUpMode));
  $("#auth").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#auth-email").value.trim(), password = $("#auth-pass").value, nick = $("#auth-nick").value.trim();
    const errEl = $("#auth-err"); errEl.hidden = true;
    const fail = (m) => { errEl.textContent = m; errEl.hidden = false; };
    if (!email || !password) return fail("请填写邮箱和密码。");
    if (signUpMode && !nick) return fail("请先起个昵称。");
    if (password.length < 6) return fail("密码至少 6 位。");
    const btn = $("#auth-btn"); btn.disabled = true;
    if (signUpMode) {
      const { data, error } = await sb.auth.signUp({ email, password, options: { data: { nick } } });
      btn.disabled = false;
      if (error) return fail(/registered/i.test(error.message) ? "这个邮箱已经注册过了，直接登录吧。" : "注册失败：" + error.message);
      if (!data.session) return fail("注册成功！请去邮箱点确认链接，然后回来登录。");
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      btn.disabled = false;
      if (error) return fail(/Invalid login/i.test(error.message) ? "邮箱或密码不对。" : /confirm/i.test(error.message) ? "邮箱还没确认，请先去邮箱点确认链接。" : "登录失败：" + error.message);
    }
  });
  async function logout() { await sb.auth.signOut(); }

  async function onSession(session) {
    $("#loading").hidden = true;
    if (!session) {
      S.uid = null; S.loaded = false;
      if (S.channel) { sb.removeChannel(S.channel); S.channel = null; }
      $("#main").hidden = true; $("#auth").hidden = false; renderTop();
      return;
    }
    if (S.uid === session.user.id) return;
    S.uid = session.user.id;
    S.draft = { done: new Set(), note: "", photoUrl: null, dirty: false, synced: false };
    $("#note").value = "";
    $("#auth").hidden = true; $("#main").hidden = false;
    await loadAll();
    const pendingNick = session.user.user_metadata && session.user.user_metadata.nick;
    if (!S.profiles[S.uid] && pendingNick) {
      if (await run(sb.from("profiles").upsert({ id: S.uid, nick: pendingNick }))) await loadAll();
    }
    subscribe();
  }
  sb.auth.onAuthStateChange((_event, session) => { setTimeout(() => onSession(session), 0); });
})();
