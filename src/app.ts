import * as express from 'express';
import * as http from "http";
import * as http2 from "http2";
import * as proxy from 'http2-proxy';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';

const http1Port = 3009;
const http2WorkingPort = 3002;
const http2BrokenPort = 3003;

const app = express();

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('hello world GET')
});

app.post('/', function (req, res) {
  console.log('post body', req.body);
  res.send('hello world POST')
});

app.listen(http1Port);


const defaultWebHandler = (err, req, res) => {
  if (err) {
    console.error('proxy error', err);
  }
};

function startHttp2(includeOnReq: boolean, port: number) {
  const h2server = http2.createSecureServer({
    allowHTTP1: true,
    key: fs.readFileSync('localhost-privkey.pem'),
    cert: fs.readFileSync('localhost-cert.pem')
  });
  h2server.listen(port, () => console.log(`HTTP2 server running on port: ${port}`));
  h2server.on('request', (h2serverReq, h2serverRes) => {
    proxy.web(h2serverReq, h2serverRes, {
      hostname: '127.0.0.1',
      port: http1Port,
      protocol: 'http',
      onReq: includeOnReq ? (req, options) => http.request(options).end() : undefined
    }, defaultWebHandler)
  });
}


startHttp2(true, http2WorkingPort);
startHttp2(false, http2BrokenPort);