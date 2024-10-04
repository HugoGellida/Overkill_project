import { io } from "socket.io-client";

// Create the socket connection
const socket = io("http://localhost:3001");

// Export the socket instance
export default socket;
