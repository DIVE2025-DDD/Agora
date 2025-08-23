import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { useChannel } from "../lib/useChannel";

const HomePage = () => {
  const [text, setText] = useState("");

  const [incomingMessage, send] = useChannel(
    "room:lobby",
    (lastMessage, channelMessage) => {
      switch (channelMessage.event) {
        case "shout":
          return channelMessage.payload.messageText;

        default:
          return lastMessage;
      }
    },
    ""
  );

  const test = () => {
    send("shout", { messageText: text });
    setText("");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-blue-50 mb-6 text-center">
            Welcome to the Home Page!
          </h1>
          <p className="text-xl text-white/90 mb-8 text-center leading-relaxed">
            This is the home page of our application.
          </p>
          
          {/* 소켓 테스트 섹션 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Socket Test</h2>
            
            <div className="mb-4">
              <label className="block text-white mb-2">Enter message:</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 rounded border bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && test()}
              />
            </div>
            
            <button
              onClick={test}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold transition-colors duration-200 mb-4"
            >
              Send Message
            </button>
            
            <div className="bg-black/30 rounded p-4 min-h-[100px]">
              <p className="text-white/90 font-semibold mb-2">Last received message:</p>
              <p className="text-green-300 font-mono">
                {incomingMessage || "No messages yet..."}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/about"
              className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
