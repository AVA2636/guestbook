// 这是一个简单的内存存储，重启后会丢失
// 生产环境建议使用数据库
let messages = [
  {
    id: 1,
    name: "系统",
    content: "欢迎来到留言板！",
    time: new Date().toISOString()
  }
];

export default function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET - 获取所有留言
  if (req.method === 'GET') {
    return res.status(200).json(messages);
  }
  
  // POST - 发布新留言
  if (req.method === 'POST') {
    const { name, content } = req.body;
    
    if (!name || !content) {
      return res.status(400).json({ error: '昵称和内容不能为空' });
    }
    
    const newMessage = {
      id: Date.now(),
      name: name.substring(0, 30),
      content: content.substring(0, 500),
      time: new Date().toISOString()
    };
    
    messages.unshift(newMessage);
    // 只保留最近50条留言
    if (messages.length > 50) messages = messages.slice(0, 50);
    
    return res.status(201).json(newMessage);
  }
  
  return res.status(405).json({ error: '方法不允许' });
}
