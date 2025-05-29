import React, { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { ProfileSetup } from '@/components/ProfileSetup';
import { BackgroundSelector } from '@/components/BackgroundSelector';
import { MobileView } from '@/components/MobileView';
import { Button } from '@/components/ui/button';
import { Settings, Smartphone } from 'lucide-react';

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
  type: 'text' | 'gift' | 'money' | 'image';
  giftType?: string;
  amount?: number;
  imageUrl?: string;
  isRead?: boolean;
}

const Index = () => {
  const [user1, setUser1] = useState<User>({ id: '1', name: '', avatar: '' });
  const [user2, setUser2] = useState<User>({ id: '2', name: '', avatar: '' });
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSetup, setShowSetup] = useState(true);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [chatBackground, setChatBackground] = useState('bg-gradient-to-br from-gray-50 to-gray-100');
  const [user1Typing, setUser1Typing] = useState(false);
  const [user2Typing, setUser2Typing] = useState(false);
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());
  const [showMobileView, setShowMobileView] = useState(false);
  const [mobileViewUser, setMobileViewUser] = useState<User | null>(null);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleMessageRead = (messageId: string) => {
    setReadMessages(prev => new Set([...prev, messageId]));
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const handleOpenMobileView = (user: User) => {
    setMobileViewUser(user);
    setShowMobileView(true);
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
      <div className="container mx-auto p-2 md:p-4 max-w-7xl h-screen flex flex-col">
        {/* Header - Hidden on mobile for full screen experience */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">WhatsApp Style Chat</h1>
            <p className="text-gray-600 text-lg">Chat between {user1.name} and {user2.name}</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBackgroundSelector(!showBackgroundSelector)}
              className="border-2 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors px-4 py-2"
            >
              <Settings className="w-4 h-4 mr-2" />
              Background
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSetup(true)}
              className="border-2 hover:bg-[#128C7E] hover:text-white hover:border-[#128C7E] transition-colors px-4 py-2"
            >
              Edit Profiles
            </Button>
          </div>
        </div>

        {/* Mobile Header - Compact */}
        <div className="md:hidden flex justify-between items-center mb-2 px-2">
          <h1 className="text-lg font-bold text-gray-800">{user1.name} & {user2.name}</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBackgroundSelector(!showBackgroundSelector)}
              className="border-2 text-xs px-2 py-1"
            >
              <Settings className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSetup(true)}
              className="border-2 text-xs px-2 py-1"
            >
              Edit
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

        {/* Chat Grid - Full screen on mobile */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-2 md:gap-8 min-h-0">
          <div className="min-h-0 relative">
            {/* Mobile View Button for User 1 */}
            <Button
              onClick={() => handleOpenMobileView(user1)}
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm hover:bg-[#25D366] hover:text-white border-[#25D366] transition-colors"
            >
              <Smartphone className="w-4 h-4 mr-1" />
              Mobile View
            </Button>
            <ChatInterface
              currentUser={user1}
              otherUser={user2}
              messages={messages}
              onSendMessage={addMessage}
              title={`${user1.name}'s Chat`}
              onTyping={setUser1Typing}
              otherUserTyping={user2Typing}
              onMessageRead={handleMessageRead}
            />
          </div>
          <div className="min-h-0 hidden xl:block relative">
            {/* Mobile View Button for User 2 */}
            <Button
              onClick={() => handleOpenMobileView(user2)}
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm hover:bg-[#25D366] hover:text-white border-[#25D366] transition-colors"
            >
              <Smartphone className="w-4 h-4 mr-1" />
              Mobile View
            </Button>
            <ChatInterface
              currentUser={user2}
              otherUser={user1}
              messages={messages}
              onSendMessage={addMessage}
              title={`${user2.name}'s Chat`}
              onTyping={setUser2Typing}
              otherUserTyping={user1Typing}
              onMessageRead={handleMessageRead}
            />
          </div>
        </div>
      </div>

      {/* Mobile View Modal */}
      {showMobileView && mobileViewUser && (
        <MobileView
          currentUser={mobileViewUser}
          otherUser={mobileViewUser.id === user1.id ? user2 : user1}
          messages={messages}
          onSendMessage={addMessage}
          onTyping={mobileViewUser.id === user1.id ? setUser1Typing : setUser2Typing}
          otherUserTyping={mobileViewUser.id === user1.id ? user2Typing : user1Typing}
          onMessageRead={handleMessageRead}
          onClose={() => setShowMobileView(false)}
        />
      )}
    </div>
  );
};

export default Index;
