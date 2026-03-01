/**
 * 飞书机器人配置
 * 使用环境变量（更安全）
 */

const config = {
  // 飞书应用凭证 - 使用环境变量
  feishu: {
    appId: process.env.FEISHU_APP_ID || 'cli_a9142e4e2778dbcc',
    appSecret: process.env.FEISHU_APP_SECRET || 'uTWvDkFI8Fhvuml3HzVwQdtgC2w3brik',
    verificationToken: process.env.FEISHU_VERIFICATION_TOKEN || 'Lv6yuAEFqwycKbLKru3XbftsrnmJ2MmX'
  },

  // MiniMax Agent 配置 - 使用环境变量
  minimax: {
    apiKey: process.env.MINIMAX_API_KEY || 'sk-api-qTv0JmHHJrXdyWkmvL--43gbYIY_05LIS-GF2zPJajPw63QrMJTMRz9-wzFcNg0K5M75_ngPEgupyRmNbT0HhnxUoxeu3w3RY0ECE-_GRuMq0g7K_yqomBU',
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
