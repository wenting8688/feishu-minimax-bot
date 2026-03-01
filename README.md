# 飞书机器人 - MiniMax Agent 智能助手

一个集成在飞书中的智能机器人，基于 MiniMax Agent 提供智能对话、文档生成、数据分析等功能。

## 功能特性

- **智能对话**：自然语言交互，解答各类问题
- **文档生成**：根据需求自动生成各类文档
- **数据分析**：提供专业的数据分析和建议
- **任务自动化**：支持多种命令操作

## 快速开始

### 准备工作

1. **飞书开放平台**
   - 注册飞书开发者账号
   - 创建企业/组织
   - 创建应用并获取 `App ID` 和 `App Secret`
   - 开启 `im:message` 权限
   - 获取 `Verification Token`

2. **MiniMax API**
   - 注册 MiniMax 账号
   - 获取 API Key

### 部署步骤

#### 方式一：Vercel 部署（推荐）

1. **fork 项目**
   - 将此项目 fork 到您的 GitHub 仓库

2. **Vercel 部署**
   - 访问 [Vercel](https://vercel.com)
   - 使用 GitHub 登录
   - 点击 "New Project"
   - 导入您 fork 的仓库

3. **配置环境变量**
   - 在 Vercel 项目设置中添加以下环境变量：
     ```
     FEISHU_APP_ID=您的飞书App ID
     FEISHU_APP_SECRET=您的飞书App Secret
     FEISHU_VERIFICATION_TOKEN=您的Verification Token
     MINIMAX_API_KEY=您的MiniMax API Key
     ```

4. **部署**
   - 点击 "Deploy" 完成部署
   - 复制部署后的 URL（例如：`https://your-project.vercel.app`）

#### 方式二：本地运行

1. **安装依赖**
   ```bash
   cd feishu-minimax-bot
   npm install
   ```

2. **配置环境变量**
   ```bash
   export FEISHU_APP_ID=您的飞书App ID
   export FEISHU_APP_SECRET=您的飞书App Secret
   export FEISHU_VERIFICATION_TOKEN=您的Verification Token
   export MINIMAX_API_KEY=您的MiniMax API Key
   ```

3. **启动服务**
   ```bash
   npm start
   ```

### 飞书配置

1. **进入飞书开发者后台**
   - 打开您的应用设置

2. **配置回调地址**
   - 进入 "事件与回调" 配置
   - 添加请求 URL：`https://your-vercel-url/api`
   - 开启以下事件：
     - `im.message.message_created`（消息接收）

3. **发布版本**
   - 提交版本发布申请
   - 等待管理员审批

4. **添加机器人到群聊**
   - 在飞书中创建群聊
   - 搜索并添加您的机器人

## 使用指南

### 基本对话

直接发送消息即可与我对话，我会尽力为您提供帮助。

### 命令列表

| 命令 | 说明 | 示例 |
|------|------|------|
| `/help` | 显示帮助信息 | `/help` |
| `/清除` | 清除对话历史 | `/清除` |
| `/文档` | 生成文档 | `/文档 生成一份项目计划书` |
| `/分析` | 数据分析 | `/分析 分析用户增长趋势` |

### 使用示例

**智能问答**
```
用户：什么是人工智能？
机器人：人工智能（Artificial Intelligence，简称AI）是指...
```

**文档生成**
```
用户：/文档 生成一份产品需求文档
机器人：[生成的产品需求文档内容]
```

**数据分析**
```
用户：/分析 分析上季度的销售数据
机器人：[销售数据分析报告]
```

## 常见问题

### 1. 部署后机器人没有响应

- 检查 Vercel 日志，确认函数是否正常执行
- 确认飞书回调地址配置正确
- 确认环境变量已正确设置

### 2. 消息发送失败

- 检查 App Secret 是否正确
- 确认应用已发布版本
- 检查应用权限是否足够

### 3. API 调用失败

- 确认 MiniMax API Key 正确
- 检查 API 配额是否用完
- 确认网络连接正常

## 技术栈

- **后端**：Node.js + Express
- **部署**：Vercel Serverless
- **AI**：MiniMax Agent API
- **消息**：飞书开放平台 API

## 目录结构

```
feishu-minimax-bot/
├── index.js          # 主程序入口
├── config.js         # 配置文件
├── feishu.js         # 飞书 API 封装
├── minimax.js        # MiniMax 对接
├── vercel.json       # Vercel 配置
├── package.json      # 项目依赖
└── README.md        # 说明文档
```

## 许可证

MIT License

## 联系支持

如有问题，请提交 Issue 或联系技术支持。
