const express = require('express');
const app = express();
const port = 3000;


app.use(express.json());

app.listen(port, () => {
  console.log('服务已启动！');
});

const data = [
  {
    id: 1,
    title: '静夜思',
    content: '床前明月光，举头望明月'
  },
  {
    id: 2,
    title: '春晓',
    content: '春眠不觉晓，处处闻啼鸟'
  },
  {
    id: 3,
    title: '乐游原',
    content: '向晚意不适，驱车登古原'
  }
];
app.get('/posts', (request, response) => {
  response.send(data);
  // console.log(typeof data);
});

app.get('/posts/:postId', (request, response) => {
  const { postId } = request.params;
  const posts = data.filter(item => item.id == postId);

  response.send(posts[0]);
  
  // console.log(request.params);
  // console.log(request.params.postId);
  // console.log(typeof request.params);
});

app.post('/posts', (request, response) => {
  const { content } = request.body;

  response.status(201);

  response.send({
    message: `成功建立了内容： ${content}`
  });
});

