import { io } from 'socket.io-client'
import api, { API_BASE_URL } from '../config/api'

// Reuse API base URL for websocket connection
const SOCKET_URL = API_BASE_URL || api.defaults.baseURL

let socket

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true,
    })
  }
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

