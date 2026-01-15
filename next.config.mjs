/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"]
  },
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"]
  },
  webpack(config) {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true
    }
    return config
  },
  async server({ httpserver }) {
    const { WebSocketServer } = require('ws')
    const wss = new WebSocketServer({ server: httpserver })
    wss.on('connection', (ws) => {
      console.log("New websocket connection established...")
      ws.on("message", (message) => {
        console.log("Message recieved...")
        ws.send(`Server echo: ${message}`)
      })
      ws.on("close", () => {
        console.log("Connection closed...")
      })
    })
    console.log("WebSocket server started...")
  }
}

export default nextConfig
