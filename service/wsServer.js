import { WebSocketServer } from 'ws';

class BountyHunterWS {
  constructor(httpServer) {
    this.wss = new WebSocketServer({ server: httpServer, path: '/ws' });
    this.clients = new Map(); // Map of connected users
    
    this.wss.on('connection', (ws) => this.handleConnection(ws));
  }
}