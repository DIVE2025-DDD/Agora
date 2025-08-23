import React, { createContext, useEffect, useState } from "react";
import { Socket } from "phoenix";

const PhoenixSocketContext = createContext({ socket: null });

const PhoenixSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      const newSocket = new Socket("/socket");
      newSocket.connect();
      setSocket(newSocket);
    }
  }, []);

  if (!socket) return null;

  return (
    <PhoenixSocketContext.Provider value={socket}>
      {children}
    </PhoenixSocketContext.Provider>
  );
};

export { PhoenixSocketContext, PhoenixSocketProvider };
