/**
 * MiniMax Agent 智能对话集成
 */

const axios = require('axios');

// MiniMax 配置
let apiKey = '';
let baseUrl = '';
let model = '';

// 消息历史（简单内存存储，生产环境建议使用数据库）
const conversationHistory = new Map();

// 初始化配置
function initConfig(config) {
  apiKey = config.minimax.apiKey;
  baseUrl = config.minimax.baseUrl;
  model = config.minimax.model;
}

/**
 * 发送对话请求
 * @param {string} userId - 用户ID
 * @param {string} message - 用户消息
 * @returns {Promise<string>} - AI 回复
 */
async function chat(userId, message) {
  try {
    // 获取或初始化对话历史
    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, [
        {
          role: 'system',
          content: '你是一个智能助手，擅长回答问题、生成文档、数据分析等任务。请用中文回复，保持友好和专业。'
        }
      ]);
    }

    const history = conversationHistory.get(userId);

    // 添加用户消息
    history.push({
      role: 'user',
      content: message
    });

    // 调用 MiniMax API
    const response = await axios.post(`${baseUrl}/text/chatcompletion_v2`, {
      model: model,
      messages: history
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const aiMessage = response.data.choices[0].message;
      // 保存 AI 回复到历史
      history.push(aiMessage);

      // 限制历史长度，避免超出上下文限制
      if (history.length > 20) {
        conversationHistory.set(userId, [
          { role: 'system', content: '你是一个智能助手，擅长回答问题、生成文档、数据分析等任务。请用中文回复，保持友好和专业。' },
          ...history.slice(-18)
        ]);
      }

      return aiMessage.content;
    } else {
      return '抱歉，我暂时无法回答您的问题。请稍后再试。';
    }
  } catch (error) {
    console.error('MiniMax API 错误:', error.message);
    if (error.response && error.response.data) {
      console.error('错误详情:', JSON.stringify(error.response.data));
    }
    return '抱歉，服务暂时不可用。请稍后再试。';
  }
}

/**
 * 清除对话历史
 * @param {string} userId - 用户ID
 */
function clearHistory(userId) {
  if (conversationHistory.has(userId)) {
    conversationHistory.delete(userId);
    return true;
  }
  return false;
}

/**
 * 生成文档
 * @param {string} userId - 用户ID
 * @param {string} prompt - 文档要求
 * @returns {Promise<string>} - 生成的文档内容
 */
async function generateDocument(userId, prompt) {
  const systemPrompt = `你是一个专业的文档生成助手。根据用户的需求，生成规范、专业的文档内容。
请根据以下要求生成文档：

1. 文档格式：Markdown 格式
2. 语言：中文
3. 内容要求：结构清晰、逻辑严密、表达准确

请直接输出文档内容，不要添加额外解释。`;

  try {
    const response = await axios.post(`${baseUrl}/text/chatcompletion_v2`, {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    } else {
      return '抱歉，无法生成文档。请稍后再试。';
    }
  } catch (error) {
    console.error('生成文档错误:', error.message);
    return '抱歉，文档生成服务暂时不可用。请稍后再试。';
  }
}

/**
 * 数据分析
 * @param {string} userId - 用户ID
 * @param {string} dataDescription - 数据描述
 * @returns {Promise<string>} - 分析结果
 */
async function analyzeData(userId, dataDescription) {
  const systemPrompt = `你是一个专业的数据分析助手。擅长分析数据、生成报告、提出建议。
请根据用户描述的数据或分析需求，提供专业的分析和建议。

请用中文回复，结构清晰，逻辑严密。`;

  try {
    const response = await axios.post(`${baseUrl}/text/chatcompletion_v2`, {
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: dataDescription }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    } else {
      return '抱歉，无法完成数据分析。请稍后再试。';
    }
  } catch (error) {
    console.error('数据分析错误:', error.message);
    return '抱歉，数据分析服务暂时不可用。请稍后再试。';
  }
}

module.exports = {
  initConfig,
  chat,
  clearHistory,
  generateDocument,
  analyzeData
};
