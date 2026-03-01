/**
 * 飞书 API 接口封装
 */

const axios = require('axios');
const crypto = require('crypto');

// 应用配置
let appId = '';
let appSecret = '';
let verificationToken = '';

// 初始化配置
function initConfig(config) {
  appId = config.feishu.appId;
  appSecret = config.feishu.appSecret;
  verificationToken = config.feishu.verificationToken;
}

// 获取 tenant_access_token
async function getTenantAccessToken() {
  try {
    const response = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: appId,
      app_secret: appSecret
    });

    if (response.data.code === 0) {
      return response.data.tenant_access_token;
    } else {
      console.error('获取 tenant_access_token 失败:', response.data.msg);
      return null;
    }
  } catch (error) {
    console.error('请求 tenant_access_token 出错:', error.message);
    return null;
  }
}

// 验证签名
function verifySignature(signature, timestamp, nonce, encrypt) {
  const sortedParams = [encrypt, timestamp, nonce].sort();
  const str = sortedParams.join('');
  const hmac = crypto.createHmac('sha256', appSecret);
  hmac.update(str);
  const calculatedSignature = hmac.digest('base64');
  return calculatedSignature === signature;
}

// 验证 URL 请求（可选）
function verifyUrlSignature(signature, timestamp, nonce) {
  const str = [appSecret, timestamp, nonce].sort().join('');
  const hmac = crypto.createHmac('sha256', appSecret);
  hmac.update(str);
  return hmac.digest('base64') === signature;
}

// 发送消息
async function sendMessage(receiveIdType, receiveId, msgType, content) {
  const token = await getTenantAccessToken();
  if (!token) return null;

  try {
    const response = await axios.post('https://open.feishu.cn/open-apis/im/v1/messages', {
      receive_id_type: receiveIdType,
      receive_id: receiveId,
      msg_type: msgType,
      content: JSON.stringify(content)
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('发送消息失败:', error.message);
    return null;
  }
}

// 发送文本消息
async function sendTextMessage(receiveIdType, receiveId, text) {
  return sendMessage(receiveIdType, receiveId, 'text', { text });
}

// 发送富文本消息
async function sendRichTextMessage(receiveIdType, receiveId, title, content) {
  const richText = {
    tag: 'text',
    text: `**${title}**\n\n${content}`
  };
  return sendMessage(receiveIdType, receiveId, 'post', {
    zh_cn: {
      title: title,
      content: [[richText]]
    }
  });
}

// 回复消息（带 id）
async function replyMessage(messageId, msgType, content) {
  const token = await getTenantAccessToken();
  if (!token) return null;

  try {
    const response = await axios.post(`https://open.feishu.cn/open-apis/im/v1/messages/${messageId}/reply`, {
      msg_type: msgType,
      content: JSON.stringify(content)
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('回复消息失败:', error.message);
    return null;
  }
}

// 上传文件
async function uploadFile(fileName, fileBuffer, fileType = 'stream') {
  const token = await getTenantAccessToken();
  if (!token) return null;

  try {
    const formData = new (require('form-data'))();
    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: 'application/octet-stream'
    });
    formData.append('file_type', fileType);

    const response = await axios.post('https://open.feishu.cn/open-apis/im/v1/files', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });

    return response.data;
  } catch (error) {
    console.error('上传文件失败:', error.message);
    return null;
  }
}

// 获取用户信息
async function getUserInfo(userId) {
  const token = await getTenantAccessToken();
  if (!token) return null;

  try {
    const response = await axios.get(`https://open.feishu.cn/open-apis/contact/v3/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error.message);
    return null;
  }
}

module.exports = {
  initConfig,
  getTenantAccessToken,
  verifySignature,
  verifyUrlSignature,
  sendMessage,
  sendTextMessage,
  sendRichTextMessage,
  replyMessage,
  uploadFile,
  getUserInfo,
  getVerificationToken: () => verificationToken
};
