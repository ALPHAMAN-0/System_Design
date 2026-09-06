---
tags: [component, System_Design]
---
- Path: `Web Socket/Chat Application/app.js`
- Role: Express + Socket.IO server; serves static client, broadcasts `chat-message`/`feedback`, tracks connected clients
- Talks to: (none — leaf node)
- Back: [[ARCHITECTURE]]
