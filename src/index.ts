import net from "node:net";

const server = net.createServer((socket) => {
  socket.on('data', (buffer) => {
    const data = handleBuffer(buffer);
    const req = handleHttpRequest(data);
    console.log(`Request received ${req.path}`);
    socket.write(handleResponse(200, `Received ${req.method} on ${req.headers['Host']}${req.path} with ${req.version}`));
    socket.end();
  });

  socket.on('end', (_) => {
    console.log('Request ended');
  })
});

server.listen(3000, () => console.log("Server started 🚀"));

function handleBuffer(buffer: Buffer): string {
  return buffer.toString();
}

function handleHttpRequest(data: string): Request | null {
  const [req, ...headers] = data.split("\r\n");
  const [method, path, version] = req.split(' ');
  const header = {};
  for(const line of headers){
    const [key, value] = line.split(":")
    header[key] = value?.trim();
  }
  return {
    method,
    path,
    version,
    headers: header,
  };
}

function handleResponse(
  status: number,
  text: string,
): string {
  return `HTTP/1.1 ${status}\r\nContent-Type: text/plain\r\n\r\n${text}`;
}

interface Request {
  method: string;
  path: string;
  version: string;
  headers: {};
  body?: string;
}