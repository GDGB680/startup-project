class WebSocketService {

  constructor() {
    this.ws = null;
    this.url = this.getWebSocketUrl();
  }

  getWebSocketUrl() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  }

    connect(userId) {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;

          // Send user join message
          this.send({
            type: 'user_join',
            userId: userId,
            timestamp: new Date().toISOString()
          });

          resolve();
        };

        this.ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.attemptReconnect(userId);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected');
    }
  }

    handleMessage(message) {
    console.log('Received:', message.type);

    // Call all listeners for this message type
    if (this.listeners.has(message.type)) {
      this.listeners.get(message.type).forEach(callback => {
        callback(message);
      });
    }
  }

  on(messageType, callback) {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, []);
    }
    this.listeners.get(messageType).push(callback);
  }

  off(messageType, callback) {
    if (this.listeners.has(messageType)) {
      const callbacks = this.listeners.get(messageType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }



  attemptReconnect(userId) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Reconnecting in ${this.reconnectDelay}ms... (Attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(userId).catch(err => {
          console.error('Reconnection failed:', err);
        });
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }


  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

    isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();