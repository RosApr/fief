import { createServerSideRendering } from "./engine.js";
import http from 'node:http';

const { render } = await createServerSideRendering({
  rootDir: `${process.cwd()}/app`,
});


function serve(handler) {
  http.createServer(async (req, res) => {
    try {
      const response = await handler(req);
            const status = response.status || 200;
            const headers = {};
      if (response.headers) {
        if (response.headers.entries) {
          for (const [key, value] of response.headers.entries()) {
            headers[key] = value;
          }
        } 
        else {
          Object.assign(headers, response.headers);
        }
      }
      
      res.writeHead(status, headers);
      
      if (response.body) {
        if (response.body.getReader) {
          const reader = response.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        } 
        else {
          res.end(response.body);
        }
      } else {
        res.end();
      }
    } catch (error) {
      console.error('请求处理出错:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('服务器内部错误');
    }
  }).listen(3000, () => {
    console.log('服务器运行在 http://localhost:3000');
  });
}

serve(render);
    
