
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageBubble } from './MessageBubble';
import { GiftSelector } from './GiftSelector';
import { GiftAnimation } from './GiftAnimation';
import { User, Message } from '@/pages/Index';
import { Send, Gift, Plus } from 'lucide-react';

interface ChatInterfaceProps {
  currentUser: User;
  otherUser: User;
  messages: Message[];
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  title: string;
  onTyping?: (isTyping: boolean) => void;
  otherUserTyping?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentUser,
  otherUser,
  messages,
  onSendMessage,
  title,
  onTyping,
  otherUserTyping = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [showGifts, setShowGifts] = useState(false);
  const [giftAnimation, setGiftAnimation] = useState<{ type: 'kiss' | 'angry', show: boolean } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    // Trigger typing indicator
    if (onTyping) {
      onTyping(true);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      onSendMessage({
        senderId: currentUser.id,
        text: inputText,
        type: 'text',
      });
      setInputText('');
      
      // Stop typing indicator
      if (onTyping) {
        onTyping(false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleSendGift = (giftType: 'kiss' | 'angry', amount?: number) => {
    // Show animation
    setGiftAnimation({ type: giftType, show: true });
    
    // Hide animation after 2 seconds
    setTimeout(() => {
      setGiftAnimation(null);
    }, 2000);

    onSendMessage({
      senderId: currentUser.id,
      text: giftType === 'kiss' ? '💋 Sent a kiss!' : '😡 Is angry!',
      type: giftType === 'kiss' && amount ? 'money' : 'gift',
      giftType,
      amount,
    });
    setShowGifts(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="relative">
      <Card className="h-[600px] flex flex-col shadow-lg bg-white border-0">
        {/* Header */}
        <CardHeader className="bg-[#075E54] text-white p-3 rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-white">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="bg-gray-300">{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold text-base">{title}</div>
              <div className="text-sm opacity-90">
                {otherUserTyping ? 'typing...' : 'online'}
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 relative">
          {/* Messages Area */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-1 bg-[#E5DDD5] bg-opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          >
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUser.id}
                senderName={message.senderId === currentUser.id ? currentUser.name : otherUser.name}
                senderAvatar={message.senderId === currentUser.id ? currentUser.avatar : otherUser.avatar}
              />
            ))}
            
            {otherUserTyping && (
              <div className="flex items-center gap-2 animate-fade-in">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                  <AvatarFallback className="text-xs bg-gray-300">{otherUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Gift Selector */}
          {showGifts && (
            <div className="absolute bottom-16 left-0 right-0 z-10">
              <GiftSelector
                onSendGift={handleSendGift}
                onClose={() => setShowGifts(false)}
              />
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-[#F0F0F0] border-t">
            <div className="flex gap-2 items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGifts(!showGifts)}
                className="rounded-full w-10 h-10 p-0 text-gray-600 hover:bg-gray-200"
              >
                <Gift className="w-5 h-5" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message"
                  className="rounded-full border-0 bg-white shadow-sm pr-12 py-2 px-4 focus:ring-1 focus:ring-[#25D366]"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  size="sm"
                  className="absolute right-1 top-1 rounded-full w-8 h-8 p-0 bg-[#25D366] hover:bg-[#128C7E] disabled:bg-gray-300"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gift Animation Overlay */}
      {giftAnimation && giftAnimation.show && (
        <GiftAnimation type={giftAnimation.type} />
      )}
    </div>
  );
};
