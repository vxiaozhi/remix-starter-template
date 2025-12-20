# Google / GitHub OAuth 登录接入配置指南

本文档详细说明如何在 Remix + Cloudflare Workers 项目中集成 Google 和 GitHub OAuth 登录功能。

## 目录

1. [功能说明](#功能说明)
2. [前置准备](#前置准备)
3. [Google OAuth 配置](#google-oauth-配置)
4. [GitHub OAuth 配置](#github-oauth-配置)
5. [环境变量配置](#环境变量配置)
6. [代码说明](#代码说明)
7. [测试流程](#测试流程)
8. [按环境配置](#按环境配置)
9. [常见问题](#常见问题)

---

## 功能说明

### 支持的功能

- ✅ Google OAuth 登录（开发和生产环境）
- ✅ GitHub OAuth 登录（仅开发环境）
- ✅ 用户会话管理（30 天有效期）
- ✅ 用户信息显示（头像、姓名）
- ✅ 多语言支持（中文/英文）
- ✅ 按环境自动显示/隐藏登录选项

### 环境配置规则

- **开发环境（dev）**：支持 Google 和 GitHub 两种登录方式
- **生产环境（production）**：仅支持 Google 登录

---

## 前置准备

### 1. 注册 Google 账户

- 访问 [Google Cloud Console](https://console.cloud.google.com)
- 使用 Google 账户登录

### 2. 注册 GitHub 账户（仅开发环境需要）

- 访问 [GitHub](https://github.com)
- 注册或登录 GitHub 账户

---

## Google OAuth 配置

### 1. 创建 Google Cloud 项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 点击项目选择器，选择 **"新建项目"**
3. 填写项目信息：
   - **项目名称**：`Remix OAuth App`（或自定义）
   - **组织**：选择你的组织（可选）
4. 点击 **"创建"**

### 2. 启用 Google+ API

1. 在项目仪表板中，点击左侧菜单的 **"API 和服务"** > **"库"**
2. 搜索 **"Google+ API"** 或 **"People API"**
3. 点击进入，然后点击 **"启用"**

**注意**：Google+ API 已弃用，现在使用 **Google Identity Services**。但为了兼容性，我们仍然需要启用相关 API。

### 3. 配置 OAuth 同意屏幕

1. 在左侧菜单选择 **"API 和服务"** > **"OAuth 同意屏幕"**
2. 选择用户类型：
   - **外部**：适用于所有 Google 账户（推荐用于开发）
   - **内部**：仅适用于你的组织（需要 Google Workspace）
3. 点击 **"创建"**
4. 填写应用信息：
   - **应用名称**：`Remix App`（或自定义）
   - **用户支持电子邮件**：选择你的邮箱
   - **开发者联系信息**：填写你的邮箱
5. 点击 **"保存并继续"**
6. 在 **"作用域"** 页面，点击 **"保存并继续"**（默认作用域已足够）
7. 在 **"测试用户"** 页面（如果选择外部用户类型），可以添加测试用户，然后点击 **"保存并继续"**
8. 在 **"摘要"** 页面，点击 **"返回仪表板"**

### 4. 创建 OAuth 2.0 客户端 ID

1. 在左侧菜单选择 **"API 和服务"** > **"凭据"**
2. 点击 **"+ 创建凭据"** > **"OAuth 客户端 ID"**
3. 如果提示配置同意屏幕，按照上述步骤完成配置
4. 选择应用类型：**"Web 应用"**
5. 填写应用信息：
   - **名称**：`Remix Web Client`（或自定义）
   - **已授权的 JavaScript 来源**：
     - 开发环境：`http://localhost:8787`
     - 生产环境：`https://your-domain.com`
   - **已授权的重定向 URI**：
     - 开发环境：`http://localhost:8787/auth/google/callback`
     - 生产环境：`https://your-domain.com/auth/google/callback`
6. 点击 **"创建"**
7. **重要**：复制 **"客户端 ID"** 和 **"客户端密钥"**，稍后配置到环境变量

**示例**：
- 客户端 ID：`123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`
- 客户端密钥：`GOCSPX-abcdefghijklmnopqrstuvwxyz`

### 5. 获取 Google OAuth 凭据

在 **"凭据"** 页面，找到刚创建的 OAuth 客户端，点击编辑图标可以查看和复制：
- **客户端 ID**（Client ID）
- **客户端密钥**（Client Secret）

---

## GitHub OAuth 配置

### 1. 创建 GitHub OAuth App

1. 登录 [GitHub](https://github.com)
2. 点击右上角头像，选择 **"Settings"**
3. 在左侧菜单选择 **"Developer settings"**
4. 选择 **"OAuth Apps"**
5. 点击 **"New OAuth App"** 或 **"Register a new application"**

### 2. 填写应用信息

填写以下信息：

- **Application name**：`Remix Dev App`（或自定义）
- **Homepage URL**：
  - 开发环境：`http://localhost:8787`
  - 生产环境：`https://your-domain.com`
- **Authorization callback URL**：
  - 开发环境：`http://localhost:8787/auth/github/callback`
  - 生产环境：`https://your-domain.com/auth/github/callback`
- **Application description**：`Remix OAuth Application`（可选）

### 3. 获取 GitHub OAuth 凭据

1. 点击 **"Register application"** 创建应用
2. 在应用详情页面，找到：
   - **Client ID**：复制此值
   - **Client secrets**：点击 **"Generate a new client secret"** 生成并复制

**重要提示**：
- Client Secret 只显示一次，请妥善保存
- 如果丢失，需要重新生成

**示例**：
- Client ID：`Iv1.1234567890abcdef`
- Client Secret：`abcdef1234567890abcdef1234567890abcdef12`

---

## 环境变量配置

### 1. 本地开发环境配置

在项目根目录创建或编辑 `.dev.vars` 文件：

```bash
# Session 密钥（用于加密 session cookie）
SESSION_SECRET=your-super-secret-key-change-in-production-min-32-chars

# Google OAuth 配置
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz

# GitHub OAuth 配置（仅开发环境）
GITHUB_CLIENT_ID=Iv1.1234567890abcdef
GITHUB_CLIENT_SECRET=abcdef1234567890abcdef1234567890abcdef12

# 环境标识
NODE_ENV=development
```

**替换说明**：
- `SESSION_SECRET`：生成一个至少 32 字符的随机字符串（可以使用 `openssl rand -base64 32` 生成）
- `GOOGLE_CLIENT_ID`：替换为你的 Google OAuth 客户端 ID
- `GOOGLE_CLIENT_SECRET`：替换为你的 Google OAuth 客户端密钥
- `GITHUB_CLIENT_ID`：替换为你的 GitHub OAuth 客户端 ID
- `GITHUB_CLIENT_SECRET`：替换为你的 GitHub OAuth 客户端密钥

### 2. Cloudflare Workers 生产环境配置

#### 方式一：使用 Wrangler CLI

```bash
# 设置环境变量
wrangler secret put SESSION_SECRET
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put NODE_ENV
```

执行命令后，按提示输入对应的值。

**注意**：生产环境不需要设置 `GITHUB_CLIENT_ID` 和 `GITHUB_CLIENT_SECRET`，因为生产环境只支持 Google 登录。

#### 方式二：使用 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages**
3. 选择你的 Worker 项目
4. 进入 **Settings** > **Variables**
5. 在 **Environment Variables** 部分添加：
   - `SESSION_SECRET` = `your-production-secret-key`
   - `GOOGLE_CLIENT_ID` = `your-google-client-id`
   - `GOOGLE_CLIENT_SECRET` = `your-google-client-secret`
   - `NODE_ENV` = `production`

**重要提示**：
- 生产环境使用生产环境的 Google OAuth 凭据
- 确保生产环境的回调 URL 已添加到 Google Cloud Console
- `SESSION_SECRET` 应该与开发环境不同，且足够复杂

### 3. 生成安全的 SESSION_SECRET

使用以下命令生成安全的密钥：

```bash
# 使用 OpenSSL
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 代码说明

### 1. Session 管理：`app/utils/session.server.ts`

该文件定义了 session 存储和用户类型。

**关键代码**：

```typescript
export function createSessionStorage(cookieSecret: string, isProduction = false) {
  return createCookieSessionStorage({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 天
      path: "/",
      sameSite: "lax",
      secrets: [cookieSecret],
      secure: isProduction, // 生产环境使用 HTTPS
    },
  });
}
```

### 2. 认证工具：`app/utils/auth.server.ts`

该文件实现了 OAuth 认证逻辑。

**主要功能**：
- 创建 Authenticator 实例
- 配置 Google OAuth 策略
- 配置 GitHub OAuth 策略（仅非生产环境）
- 获取用户信息

**关键代码**：

```typescript
// Google OAuth 策略
authenticator.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenURL: "https://oauth2.googleapis.com/token",
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: new URL("/auth/google/callback", requestOrigin).toString(),
      scope: "openid email profile",
    },
    async ({ accessToken }) => {
      // 获取用户信息
      const userInfo = await fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
      );
      // ...
    }
  ),
  "google"
);
```

**环境判断**：

```typescript
// GitHub OAuth 策略（仅在非生产环境启用）
if (!isProduction(context) && env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  // 配置 GitHub OAuth
}
```

### 3. OAuth 路由

#### Google 登录：`app/routes/auth.google.tsx`

处理 Google OAuth 登录请求，重定向到 Google 授权页面。

#### Google 回调：`app/routes/auth.google.callback.tsx`

处理 Google OAuth 回调，创建用户会话。

#### GitHub 登录：`app/routes/auth.github.tsx`

处理 GitHub OAuth 登录请求（仅开发环境可用）。

#### GitHub 回调：`app/routes/auth.github.callback.tsx`

处理 GitHub OAuth 回调，创建用户会话。

#### 退出登录：`app/routes/auth.logout.tsx`

销毁用户会话，退出登录。

### 4. 登录页面：`app/routes/login.tsx`

显示登录选项，根据环境自动显示/隐藏 GitHub 登录按钮。

**关键代码**：

```typescript
export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const user = await getCurrentUser(request, context);
  if (user) {
    return redirect("/"); // 已登录则重定向
  }
  return {
    error: searchParams.get("error"),
    isProduction: isProduction(context), // 传递环境信息
  };
};

// 在组件中
{!isProduction && (
  <Form action="/auth/github" method="post">
    <button type="submit">{t.auth.loginWithGithub}</button>
  </Form>
)}
```

### 5. Navigation 组件：`app/components/Navigation.tsx`

显示用户登录状态和用户信息。

**功能**：
- 显示用户头像和姓名（如果已登录）
- 显示登录按钮（如果未登录）
- 显示退出登录按钮（如果已登录）

### 6. Root 布局：`app/root.tsx`

在根布局中加载用户信息，通过 context 传递给所有子组件。

---

## 测试流程

### 1. 本地开发环境测试

#### 启动开发服务器

```bash
npm run dev
```

#### 测试 Google 登录

1. 访问 `http://localhost:8787/login`
2. 应该看到 **"使用 Google 登录"** 和 **"使用 GitHub 登录"** 两个按钮
3. 点击 **"使用 Google 登录"**
4. 应该跳转到 Google 授权页面
5. 选择 Google 账户并授权
6. 应该跳转回首页，导航栏显示用户信息

#### 测试 GitHub 登录

1. 访问 `http://localhost:8787/login`
2. 点击 **"使用 GitHub 登录"**
3. 应该跳转到 GitHub 授权页面
4. 授权后应该跳转回首页

#### 测试退出登录

1. 点击导航栏的 **"退出"** 按钮
2. 应该退出登录并清除会话
3. 导航栏应该显示 **"登录"** 按钮

### 2. 检查日志

在开发服务器控制台查看是否有错误信息：
- 如果看到 "GOOGLE_CLIENT_ID is not set"，说明环境变量未配置
- 如果看到 OAuth 相关错误，检查回调 URL 是否正确

### 3. 验证用户信息

登录成功后，检查：
- 导航栏是否显示用户头像和姓名
- 用户信息是否正确（来自 Google/GitHub）

### 4. 生产环境测试

1. 部署到 Cloudflare Workers
2. 访问生产环境的登录页面
3. **应该只看到 Google 登录按钮**（GitHub 按钮不应显示）
4. 测试 Google 登录流程
5. 验证会话是否正常工作

---

## 按环境配置

### 开发环境（dev）

**配置要求**：
- ✅ 设置 `NODE_ENV=development`
- ✅ 配置 Google OAuth 凭据
- ✅ 配置 GitHub OAuth 凭据
- ✅ 登录页面显示 Google 和 GitHub 两个选项

**环境变量示例**：

```bash
NODE_ENV=development
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
SESSION_SECRET=xxx
```

### 生产环境（production）

**配置要求**：
- ✅ 设置 `NODE_ENV=production`
- ✅ 配置 Google OAuth 凭据（生产环境）
- ❌ **不配置** GitHub OAuth 凭据
- ✅ 登录页面只显示 Google 选项

**环境变量示例**：

```bash
NODE_ENV=production
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
SESSION_SECRET=xxx
# 不设置 GITHUB_CLIENT_ID 和 GITHUB_CLIENT_SECRET
```

### 代码中的环境判断

在 `app/utils/auth.server.ts` 中：

```typescript
// 判断是否为生产环境
export function isProduction(context: AppLoadContext): boolean {
  const env = getEnv(context);
  return env.NODE_ENV === "production";
}

// GitHub OAuth 策略（仅在非生产环境启用）
if (!isProduction(context) && env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  // 配置 GitHub OAuth
}
```

在 `app/routes/login.tsx` 中：

```typescript
export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  return {
    isProduction: isProduction(context),
  };
};

// 在组件中
{!isProduction && (
  <Form action="/auth/github" method="post">
    {/* GitHub 登录按钮 */}
  </Form>
)}
```

---

## 常见问题

### 1. 环境变量未生效

**问题**：提示 "GOOGLE_CLIENT_ID is not set" 或登录失败

**解决方案**：
- 检查 `.dev.vars` 文件是否存在且格式正确
- 确保文件在项目根目录
- 重启开发服务器
- 检查环境变量名称是否正确（区分大小写）

### 2. 回调 URL 不匹配

**问题**：OAuth 授权后提示 "redirect_uri_mismatch"

**解决方案**：
- 检查 Google Cloud Console 中配置的授权重定向 URI
- 确保与代码中的回调 URL 完全一致（包括协议、域名、端口、路径）
- 开发环境：`http://localhost:8787/auth/google/callback`
- 生产环境：`https://your-domain.com/auth/google/callback`

### 3. GitHub 登录在生产环境显示

**问题**：生产环境仍然显示 GitHub 登录按钮

**解决方案**：
- 检查 `NODE_ENV` 环境变量是否设置为 `production`
- 确认 `isProduction()` 函数正确判断环境
- 检查登录页面的条件渲染逻辑

### 4. Session 不持久

**问题**：刷新页面后用户退出登录

**解决方案**：
- 检查 `SESSION_SECRET` 是否配置
- 确认 cookie 设置正确（`httpOnly`、`secure`、`sameSite`）
- 检查浏览器是否允许 cookie
- 确认生产环境使用 HTTPS（`secure: true`）

### 5. 用户信息获取失败

**问题**：登录成功但无法获取用户信息

**解决方案**：
- 检查 OAuth scope 是否正确配置
- Google：需要 `openid email profile`
- GitHub：需要 `user:email`
- 检查 API 调用是否成功
- 查看浏览器控制台和服务器日志

### 6. CORS 错误

**问题**：前端请求 API 时出现 CORS 错误

**解决方案**：
- Remix 的 API 路由默认支持同源请求，不应该出现 CORS 问题
- 如果使用自定义域名，确保域名配置正确
- 检查 Cloudflare Workers 的 CORS 设置

### 7. 生产环境配置

**问题**：如何切换到生产环境

**解决方案**：
1. 在 Google Cloud Console 创建生产环境的 OAuth 客户端
2. 配置生产环境的回调 URL
3. 在 Cloudflare Dashboard 设置环境变量：
   - `NODE_ENV=production`
   - `GOOGLE_CLIENT_ID`（生产环境）
   - `GOOGLE_CLIENT_SECRET`（生产环境）
   - `SESSION_SECRET`（生产环境密钥）
4. 重新部署 Worker

### 8. 测试用户限制（Google）

**问题**：Google OAuth 提示 "此应用未通过 Google 验证"

**解决方案**：
- 在开发阶段，OAuth 同意屏幕选择 **"测试"** 模式
- 在 **"测试用户"** 中添加要测试的 Google 账户
- 只有添加的测试用户才能登录
- 生产环境需要提交应用审核

---

## 安全注意事项

1. **永远不要**在前端代码中暴露 Client Secret
2. **永远不要**将 `.dev.vars` 文件提交到 Git
3. 使用环境变量管理敏感信息
4. 生产环境使用 HTTPS
5. 定期轮换 OAuth 凭据
6. 使用强密码作为 `SESSION_SECRET`（至少 32 字符）
7. 生产环境和开发环境使用不同的 OAuth 凭据
8. 监控 OAuth 使用情况，发现异常及时处理

---

## 相关资源

- [Google OAuth 2.0 文档](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth 文档](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [remix-auth 文档](https://github.com/sergiodxa/remix-auth)
- [remix-auth-oauth2 文档](https://github.com/sergiodxa/remix-auth-oauth2)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Remix 文档](https://remix.run/docs)

---

## 更新日志

- **2025-01-XX**：初始版本，支持 Google 和 GitHub OAuth 登录，按环境自动配置

---

如有问题，请参考相关文档或联系技术支持。
