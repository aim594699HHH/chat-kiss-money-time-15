
import React, { useState, useEffect, useRef } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { ProfileSetup } from '@/components/ProfileSetup';
import { BackgroundSelector } from '@/components/BackgroundSelector';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'gift' | 'money';
  giftType?: 'kiss' | 'angry';
  amount?: number;
}

const Index = () => {
  const [user1, setUser1] = useState<User>({ id: '1', name: '', avatar: '' });
  const [user2, setUser2] = useState<User>({ id: '2', name: '', avatar: '' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSetup, setShowSetup] = useState(true);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [chatBackground, setChatBackground] = useState('bg-gradient-to-br from-green-50 to-green-100');

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const isSetupComplete = user1.name && user2.name;

  if (!isSetupComplete && showSetup) {
    return (
      <ProfileSetup
        user1={user1}
        user2={user2}
        setUser1={setUser1}
        setUser2={setUser2}
        onComplete={() => setShowSetup(false)}
      />
    );
  }

  return (
    <div className={`min-h-screen ${chatBackground} transition-all duration-500`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Dual Chat Room</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBackgroundSelector(!showBackgroundSelector)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Background
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSetup(true)}
            >
              Edit Profiles
            </Button>
          </div>
        </div>

        {showBackgroundSelector && (
          <BackgroundSelector
            currentBackground={chatBackground}
            onBackgroundChange={setChatBackground}
            onClose={() => setShowBackgroundSelector(false)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChatInterface
            currentUser={user1}
            otherUser={user2}
            messages={messages}
            onSendMessage={addMessage}
            title={`${user1.name}'s Chat`}
          />
          <ChatInterface
            currentUser={user2}
            otherUser={user1}
            messages={messages}
            onSendMessage={addMessage}
            title={`${user2.name}'s Chat`}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
