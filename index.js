/**
 * 飞书机器人主程序
 * 支持 Vercel Serverless 部署
 */

const axios = require('axios');
const crypto = require('crypto');

// 引入模块
const feishu = require('./feishu');
const minimax = require('./minimax');

// 加载配置
const config = require('./config');

// 初始化配置
feishu.initConfig(config);
minimax.initConfig(config);

// 命令前缀
const COMMAND_PREFIX = '/';

/**
 * Vercel Serverless 函数处理
 */
module.exports = async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    // 验证请求类型
    if (body.type === 'url_verification') {
      // URL 验证
      return handleUrlVerification(body, res);
    } else if (body.type === 'event_callback') {
      // 事件回调
      return handleEventCallback(body, res);
    } else {
      return res.status(200).json({ error: 'Unknown type' });
    }
  } catch (error) {
    console.error('处理请求错误:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * 处理 URL 验证
 */
function handleUrlVerification(body, res) {
  return res.status(200).json({
    challenge: body.challenge
  });
}

/**
 * 处理事件回调
 */
async function handleEventCallback(body, res) {
  const event = body.event;

  // 验证事件类型
  if (!event || !event.message) {
    return res.status(200).json({ error: 'No message event' });
  }

  const message = event.message;
  const messageType = message.message_type;

  // 只处理文本消息
  if (messageType !== 'text') {
    return res.status(200).json({ error: 'Not a text message' });
  }

  const content = JSON.parse(message.content || '{}');
  const text = content.text || '';
  const messageId = message.message_id;
  const userId = message.sender_id?.user_id || message.sender_id?.open_id || 'unknown';

  // 获取接收者 ID（群聊或私聊）
  const receiveId = message.chat_id || userId;
  const receiveIdType = message.chat_id ? 'chat_id' : 'user_id';

  // 检查是否是命令
  if (text.startsWith(COMMAND_PREFIX)) {
    return await handleCommand(messageId, receiveIdType, receiveId, text, userId, res);
  }

  // 智能对话
  return await handleChat(messageId, receiveIdType, receiveId, text, userId, res);
}

/**
 * 处理命令
 */
async function handleCommand(messageId, receiveIdType, receiveId, text, userId, res) {
  const parts = text.split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');

  let responseText = '';

  switch (command) {
    case '/help':
    case '/帮助':
      responseText = getHelpText();
      break;

    case '/clear':
    case '/清除':
      const cleared = minimax.clearHistory(userId);
      responseText = cleared ? '对话历史已清除。' : '没有对话历史需要清除。';
      break;

    case '/文档':
    case '/doc':
      if (!args) {
        responseText = '请提供文档要求，例如：/文档 生成一份项目计划书';
      } else {
        responseText = '正在生成文档，请稍候...\n\n';
        const docContent = await minimax.generateDocument(userId, args);
        responseText += docContent;
      }
      break;

    case '/分析':
    case '/analyze':
      if (!args) {
        responseText = '请提供要分析的数据或问题，例如：/分析 分析上季度的销售数据';
      } else {
        responseText = '正在分析，请稍候...\n\n';
        const analysisResult = await minimax.analyzeData(userId, args);
        responseText += analysisResult;
      }
      break;

    default:
      responseText = `未知命令：${command}\n\n${getHelpText()}`;
  }

  // 发送响应
  await feishu.replyMessage(messageId, 'text', { text: responseText });

  return res.status(200).json({ success: true });
}

/**
 * 处理智能对话
 */
async function handleChat(messageId, receiveIdType, receiveId, text, userId, res) {
  // 简单响应，表示正在处理
  res.status(200).json({ success: true });

  try {
    // 调用 MiniMax Agent
    const response = await minimax.chat(userId, text);

    // 发送回复
    await feishu.replyMessage(messageId, 'text', { text: response });
  } catch (error) {
    console.error('处理对话错误:', error);
    await feishu.replyMessage(messageId, 'text', { text: '抱歉，处理您的消息时出现错误。请稍后再试。' });
  }
}

/**
 * 获取帮助文本
 */
function getHelpText() {
  return `🤖 **MiniMax 飞书机器人**

我是一个智能助手，可以帮助您完成以下任务：

**基本功能：**
• 智能问答 - 直接发送消息即可对话
• 文档生成 - 输入需求，我帮您生成文档
• 数据分析 - 分析数据，提供建议

**命令列表：**
• /help - 显示帮助信息
• /清除 - 清除对话历史
• /文档 [需求] - 生成文档
• /分析 [问题] - 数据分析

**使用示例：**
• /文档 生成一份产品需求文档
• /分析 分析用户增长趋势

有问题随时问我！`;
}
