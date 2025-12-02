import { WebSocketServer } from 'ws';

class BountyHunterWS {
  constructor(httpServer) {
    this.wss = new WebSocketServer({ server: httpServer, path: '/ws' });
    this.clients = new Map(); // Map of connected users
    
    this.wss.on('connection', (ws) => this.handleConnection(ws));
  }

  handleConnection(ws) {
    console.log('New WebSocket connection');

    ws.on('message', (data) => this.handleMessage(ws, data));
    ws.on('close', () => this.handleClose(ws));
    ws.on('error', (error) => console.error('WS Error:', error.message));

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'status',
      message: 'Connected to Bounty Hunter server',
      timestamp: new Date().toISOString()
    }));
  }


  handleMessage(ws, data) {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'user_join':
          this.handleUserJoin(ws, message);
          break;
        
        case 'bounty_posted':
          this.broadcastBounty(message);
          break;
        
        case 'submission_created':
          this.broadcastSubmission(message);
          break;
        
        case 'chat_message':
          this.broadcastChat(message);
          break;
        
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Message parse error:', error);
    }
  }

  handleUserJoin(ws, message) {
    const userId = message.userId || 'anonymous';
    ws.userId = userId;
    this.clients.set(ws, userId);

    const userCount = this.clients.size;
    
    // Notify all users that someone joined
    this.broadcast({
      type: 'user_joined',
      userId: userId,
      activeUsers: userCount,
      timestamp: new Date().toISOString()
    });
    
    console.log(`${userId} joined. Active users: ${userCount}`);
  }

  broadcastBounty(message) {
    this.broadcast({
      type: 'bounty_posted',
      bounty: message.bounty,
      postedBy: message.postedBy,
      timestamp: new Date().toISOString()
    });
    console.log(`New bounty posted: ${message.bounty.title}`);
  }

  broadcastSubmission(message) {
    this.broadcast({
      type: 'submission_created',
      submission: message.submission,
      submittedBy: message.submittedBy,
      timestamp: new Date().toISOString()
    });
    console.log(`New submission: ${message.submission.songTitle}`);
  }

  broadcastChat(message) {
    this.broadcast({
      type: 'chat_message',
      message: message.message,
      user: message.user,
      timestamp: new Date().toISOString()
    });
  }

  broadcast(data) {
    const json = JSON.stringify(data);
    this.wss.clients.forEach((client) => {
      if (client.readyState === 1) { // 1 = OPEN
        client.send(json);
      }
    });
  }

  handleClose(ws) {
    const userId = ws.userId || 'unknown';
    this.clients.delete(ws);
    
    const userCount = this.clients.size;
    this.broadcast({
      type: 'user_left',
      userId: userId,
      activeUsers: userCount,
      timestamp: new Date().toISOString()
    });
    
    console.log(`${userId} left. Active users: ${userCount}`);
  }

  getActiveUsers() {
    return this.clients.size;
  }
}

export function createWebSocketServer(httpServer) {
  return new BountyHunterWS(httpServer);
}