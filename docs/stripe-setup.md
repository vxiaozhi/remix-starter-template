# Stripe 支付接入配置指南

本文档详细说明如何在 Remix + Cloudflare Workers 项目中集成 Stripe 支付功能，包括按月订阅和年度订阅两种方案。

## 目录

1. [前置准备](#前置准备)
2. [Stripe 账户设置](#stripe-账户设置)
3. [创建产品和价格](#创建产品和价格)
4. [获取 API 密钥](#获取-api-密钥)
5. [配置环境变量](#配置环境变量)
6. [代码说明](#代码说明)
7. [测试流程](#测试流程)
8. [常见问题](#常见问题)

---

## 前置准备

### 1. 注册 Stripe 账户

访问 [Stripe 官网](https://stripe.com) 注册账户：
- 访问 https://stripe.com
- 点击 "Sign up" 注册新账户
- 完成邮箱验证和账户信息填写

### 2. 激活账户

- 登录 Stripe Dashboard
- 完成账户激活流程（包括公司信息、银行账户等）
- **注意**：测试环境无需完成激活，但生产环境必须完成激活

---

## Stripe 账户设置

### 1. 选择测试/生产模式

Stripe 提供两种模式：

- **测试模式（Test Mode）**：用于开发和测试，使用测试卡号，不会产生真实扣款
- **生产模式（Live Mode）**：用于正式环境，会产生真实扣款

**切换方式**：
- 在 Stripe Dashboard 右上角找到模式切换开关
- 开发阶段使用 **Test Mode**
- 上线前切换到 **Live Mode**

### 2. 测试卡号

在测试模式下，可以使用以下测试卡号：

| 卡号 | 说明 |
|------|------|
| `4242 4242 4242 4242` | 成功支付 |
| `4000 0000 0000 0002` | 卡被拒绝 |
| `4000 0000 0000 9995` | 余额不足 |

**其他测试信息**：
- 过期日期：任意未来日期（如 `12/34`）
- CVC：任意 3 位数字（如 `123`）
- ZIP：任意 5 位数字（如 `12345`）

---

## 创建产品和价格

### 1. 创建产品

1. 登录 Stripe Dashboard
2. 进入 **Products** 页面
3. 点击 **"Add product"** 按钮

#### 按月订阅产品设置

填写以下信息：

- **Name（产品名称）**：`Monthly Subscription` 或 `按月订阅`
- **Description（描述）**：`Monthly subscription plan`（可选）
- **Pricing model**：选择 **"Recurring"**（定期付款）
- **Price**：`¥99.00`（或你的月付价格）
- **Billing period**：选择 **"Monthly"**（每月）
- **Currency**：选择货币（如 `CNY` 人民币）

点击 **"Save product"** 保存。

#### 年度订阅产品设置

重复上述步骤，创建年度订阅产品：

- **Name（产品名称）**：`Yearly Subscription` 或 `年度订阅`
- **Description（描述）**：`Annual subscription plan`（可选）
- **Pricing model**：选择 **"Recurring"**（定期付款）
- **Price**：`¥999.00`（或你的年付价格）
- **Billing period**：选择 **"Yearly"**（每年）
- **Currency**：选择货币（如 `CNY` 人民币）

### 2. 获取 Price ID

创建产品后，Stripe 会自动生成一个 **Price ID**，格式类似：`price_xxxxxxxxxxxxx`

**获取方式**：
1. 在 **Products** 页面找到刚创建的产品
2. 点击产品进入详情页
3. 在价格信息中找到 **Price ID**（以 `price_` 开头）
4. 复制该 ID，稍后配置到环境变量中

**示例**：
- 按月订阅 Price ID：`price_xxx`
- 年度订阅 Price ID：`price_yyy`

---

## 获取 API 密钥

### 1. 获取 Secret Key

1. 在 Stripe Dashboard 中，点击左侧菜单的 **"Developers"**
2. 选择 **"API keys"**
3. 找到 **"Secret key"**（以 `sk_test_` 或 `sk_live_` 开头）
4. 点击 **"Reveal test key"** 或 **"Reveal live key"** 显示完整密钥
5. 复制密钥（注意：密钥只显示一次，请妥善保存）

**密钥格式**：
- 测试环境：`sk_test_YOUR_SECRET_KEY_HERE`
- 生产环境：`sk_live_YOUR_SECRET_KEY_HERE`

### 2. 获取 Publishable Key（可选）

如果需要在前端直接调用 Stripe（如使用 Stripe Elements），还需要获取 **Publishable Key**：
- 在同一个页面找到 **"Publishable key"**（以 `pk_test_` 或 `pk_live_` 开头）
- 复制该密钥

**注意**：当前项目使用服务端创建 Checkout Session，不需要 Publishable Key。

---

## 配置环境变量

### 1. 本地开发环境配置

在项目根目录创建 `.dev.vars` 文件（该文件已被 `.gitignore` 忽略，不会提交到 Git）：

```bash
# Stripe API 密钥
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# Stripe 价格 ID
STRIPE_PRICE_ID_MONTHLY=price_xxx
STRIPE_PRICE_ID_YEARLY=price_yyy
```

**替换说明**：
- `STRIPE_SECRET_KEY`：替换为你的 Stripe Secret Key
- `STRIPE_PRICE_ID_MONTHLY`：替换为按月订阅的 Price ID
- `STRIPE_PRICE_ID_YEARLY`：替换为年度订阅的 Price ID

### 2. Cloudflare Workers 生产环境配置

#### 方式一：使用 Wrangler CLI

```bash
# 设置环境变量
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_PRICE_ID_MONTHLY
wrangler secret put STRIPE_PRICE_ID_YEARLY
```

执行命令后，按提示输入对应的值。

#### 方式二：使用 Cloudflare Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages**
3. 选择你的 Worker 项目
4. 进入 **Settings** > **Variables**
5. 在 **Environment Variables** 部分添加：
   - `STRIPE_SECRET_KEY` = `sk_live_YOUR_SECRET_KEY_HERE`
   - `STRIPE_PRICE_ID_MONTHLY` = `price_xxx`
   - `STRIPE_PRICE_ID_YEARLY` = `price_yyy`

**重要提示**：
- 本地开发使用测试密钥（`sk_test_`）
- 生产环境使用生产密钥（`sk_live_`）
- 确保生产环境的 Price ID 也是生产模式下的 ID

---

## 代码说明

### 1. API 路由：`app/routes/api.create-checkout-session.tsx`

该文件处理创建 Stripe Checkout Session 的请求。

**主要功能**：
- 接收前端传来的订阅类型（`monthly` 或 `yearly`）
- 从环境变量读取 Stripe 密钥和价格 ID
- 创建 Stripe Checkout Session
- 返回 Checkout URL 供前端跳转

**关键代码**：

```typescript
// 初始化 Stripe 客户端（使用 Cloudflare Workers 兼容的 Fetch HTTP 客户端）
const stripe = new Stripe(stripeSecretKey, {
  httpClient: Stripe.createFetchHttpClient(),
});

// 创建 Checkout Session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [
    {
      price: priceId,
      quantity: 1,
    },
  ],
  mode: "subscription", // 订阅模式
  success_url: `${origin}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/pricing?canceled=true`,
  metadata: {
    planType,
  },
});
```

### 2. 前端页面：`app/routes/pricing.tsx`

该文件展示订阅选项和处理支付流程。

**主要功能**：
- 显示按月订阅和年度订阅两个选项
- 点击订阅按钮时调用 API 创建 Checkout Session
- 跳转到 Stripe Checkout 页面完成支付
- 处理支付成功/取消后的消息提示

**关键代码**：

```typescript
const handleSubscribe = async (planType: "monthly" | "yearly") => {
  const response = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ planType }),
  });

  const { url } = await response.json();
  if (url) {
    window.location.href = url; // 跳转到 Stripe Checkout
  }
};
```

### 3. 环境变量类型定义：`worker-configuration.d.ts`

定义了环境变量的 TypeScript 类型：

```typescript
interface Env {
  STRIPE_SECRET_KEY?: string;
  STRIPE_PRICE_ID_MONTHLY?: string;
  STRIPE_PRICE_ID_YEARLY?: string;
}
```

---

## 测试流程

### 1. 本地测试

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **访问价格页面**：
   打开浏览器访问 `http://localhost:8787/pricing`

3. **测试订阅流程**：
   - 点击 "立即订阅" 按钮
   - 应该跳转到 Stripe Checkout 页面
   - 使用测试卡号 `4242 4242 4242 4242` 完成支付
   - 支付成功后应跳转回价格页面，并显示成功消息

4. **测试取消流程**：
   - 点击订阅按钮
   - 在 Stripe Checkout 页面点击 "Cancel" 或关闭页面
   - 应跳转回价格页面，并显示取消消息

### 2. 检查日志

在开发服务器控制台查看是否有错误信息：
- 如果看到 "STRIPE_SECRET_KEY is not set"，说明环境变量未配置
- 如果看到 "Price ID not configured"，说明价格 ID 未配置或配置错误

### 3. Stripe Dashboard 验证

1. 登录 Stripe Dashboard
2. 进入 **Payments** 页面
3. 应该能看到测试支付的记录
4. 进入 **Customers** 页面
5. 应该能看到创建的订阅客户

### 4. Webhook 测试（可选）

如果需要处理支付完成后的业务逻辑（如激活用户账户），需要配置 Webhook：

1. 在 Stripe Dashboard 中进入 **Developers** > **Webhooks**
2. 点击 **"Add endpoint"**
3. 输入 Webhook URL（如 `https://your-domain.com/api/webhook/stripe`）
4. 选择要监听的事件（如 `checkout.session.completed`）
5. 复制 Webhook signing secret，添加到环境变量 `STRIPE_WEBHOOK_SECRET`

---

## 常见问题

### 1. 环境变量未生效

**问题**：提示 "STRIPE_SECRET_KEY is not set"

**解决方案**：
- 检查 `.dev.vars` 文件是否存在且格式正确
- 确保文件在项目根目录
- 重启开发服务器

### 2. Price ID 错误

**问题**：提示 "Price ID not configured" 或支付失败

**解决方案**：
- 确认 Price ID 格式正确（以 `price_` 开头）
- 确认测试/生产环境的 Price ID 匹配对应的密钥
- 检查 Stripe Dashboard 中的产品是否已创建

### 3. CORS 错误

**问题**：前端请求 API 时出现 CORS 错误

**解决方案**：
- Remix 的 API 路由默认支持同源请求，不应该出现 CORS 问题
- 如果使用自定义域名，确保域名配置正确

### 4. 支付成功后未跳转

**问题**：支付成功但未跳转回网站

**解决方案**：
- 检查 `success_url` 配置是否正确
- 确认 `{CHECKOUT_SESSION_ID}` 占位符未被替换
- 检查浏览器控制台是否有错误

### 5. 测试卡无法支付

**问题**：使用测试卡号支付失败

**解决方案**：
- 确认 Stripe Dashboard 处于 **Test Mode**
- 确认使用的是测试环境的 Secret Key（`sk_test_`）
- 尝试使用其他测试卡号

### 6. 生产环境配置

**问题**：如何切换到生产环境

**解决方案**：
1. 在 Stripe Dashboard 切换到 **Live Mode**
2. 获取生产环境的 Secret Key（`sk_live_`）
3. 创建生产环境的产品和价格
4. 获取生产环境的 Price ID
5. 在 Cloudflare Dashboard 更新环境变量
6. 重新部署 Worker

---

## 安全注意事项

1. **永远不要**在前端代码中暴露 Secret Key
2. **永远不要**将 `.dev.vars` 文件提交到 Git
3. 使用环境变量管理敏感信息
4. 生产环境使用 HTTPS
5. 定期轮换 API 密钥
6. 监控 Stripe Dashboard 中的异常活动

---

## 相关资源

- [Stripe 官方文档](https://stripe.com/docs)
- [Stripe Checkout 文档](https://stripe.com/docs/payments/checkout)
- [Stripe 订阅文档](https://stripe.com/docs/billing/subscriptions/overview)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Remix 文档](https://remix.run/docs)

---

## 更新日志

- **2025-01-XX**：初始版本，支持按月订阅和年度订阅

---

如有问题，请参考 Stripe 官方文档或联系技术支持。
