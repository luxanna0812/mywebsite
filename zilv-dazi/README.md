# 自律搭子

和朋友一起每日打卡：勾目标、写今天做了什么、加照片、互相评论加油、比连续打卡天数。

纯静态网站（HTML + CSS + JS），数据存在 Supabase，用 Netlify 发布。

## 文件

- `index.html` / `style.css` / `app.js`：网站本体
- `config.js`：填 Supabase 的 Project URL 和 anon key
- `supabase/schema.sql`：建表和权限脚本，在 Supabase 的 SQL Editor 里运行一次

## 上线步骤

1. Supabase 新建项目 → SQL Editor 运行 `supabase/schema.sql`
2. Supabase → Authentication → Sign In / Providers → Email：关掉 “Confirm email”（两个人用，省掉邮件确认）
3. 把 Project URL 和 anon public key 填进 `config.js`
4. 推到 GitHub
5. Netlify → Add new site → Import from GitHub → 选这个仓库，Build command 留空，Publish directory 填 `.` → Deploy
6. 两个人都注册好以后，可以在 Supabase → Authentication 里关掉新用户注册，防止陌生人进来

## 更新

改完代码 → 推到 GitHub → Netlify 自动重新发布，网址不变。
