import '../config/module-alias';

class Server {
  init(): void {
    console.log('Server initialized');
  }
}

const server = new Server();
server.init();
