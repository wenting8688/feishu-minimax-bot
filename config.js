/**
 * 飞书机器人配置
 * 支持环境变量配置（推荐用于 Vercel）
 */

const config = {
  // 飞书应用凭证
  // 方式1: 环境变量（推荐，用于 Vercel）
  // 方式2: 直接填写（用于本地开发）
  feishu: {
    appId: process.env.FEISHU_APP_ID || 'YOUR_FEISHU_APP_ID',
    appSecret: process.env.FEISHU_APP_SECRET || 'YOUR_FEISHU_APP_SECRET',
    verificationToken: process.env.FEISHU_VERIFICATION_TOKEN || 'YOUR_VERIFICATION_TOKEN'
  },

  // MiniMax Agent 配置
  minimax: {
    apiKey: process.env.MINIMAX_API_KEY || 'YOUR_MINIMAX_API_KEY',
    baseUrl: process.env.MINIMAX_BASE_URL || 'https://api.minimax.chat/v1',
    model: process.env.MINIMAX_MODEL || 'abab6.5s-chat'
  },

  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  }
};

module.exports = config;
