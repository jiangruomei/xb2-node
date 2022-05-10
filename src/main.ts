import app from './app/index';
import { APP_PORT } from './app/app.config';
import { connection } from './app/database/mysql';

app.listen(APP_PORT, () => {
  console.log('服务已经启动！');
});

connection.connect(error => {
  if (error) {
    console.log('连接数据服务失败：', error.message);
    return;
  }

  console.log('成功连接数据服务 ~~');
});
