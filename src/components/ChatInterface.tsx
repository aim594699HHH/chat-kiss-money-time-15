
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageBubble } from './MessageBubble';
import { GiftSelector } from './GiftSelector';
import { User, Message } from '@/pages/Index';
import { Send, Gift, Smile } from 'lucide-react';

interface ChatInterfaceProps {
  currentUser: User;
  otherUser: User;
  messages: Message[];
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  title: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentUser,
  otherUser,
  messages,
  onSendMessage,
  title,
}) => {
  const [inputText, setInputText] = useState('');
  const [showGifts, setShowGifts] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      onSendMessage({
        senderId: currentUser.id,
        text: inputText,
        type: 'text',
      });
      setInputText('');
      
      // Show typing indicator briefly
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const handleSendGift = (giftType: 'kiss' | 'angry', amount?: number) => {
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
    <Card className="h-[600px] flex flex-col shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-white">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{title}</div>
            <div className="text-sm opacity-90">Online</div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUser.id}
              senderName={message.senderId === currentUser.id ? currentUser.name : otherUser.name}
              senderAvatar={message.senderId === currentUser.id ? currentUser.avatar : otherUser.avatar}
            />
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500 animate-pulse">
              <Avatar className="w-6 h-6">
                <AvatarImage src={otherUser.avatar} />
                <AvatarFallback className="text-xs">{otherUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="bg-gray-200 rounded-full px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Gift Selector */}
        {showGifts && (
          <GiftSelector
            onSendGift={handleSendGift}
            onClose={() => setShowGifts(false)}
          />
        )}

        {/* Input Area */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGifts(!showGifts)}
              className="hover-scale"
            >
              <Gift className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="pr-12 rounded-full border-2 focus:border-green-400"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                size="sm"
                className="absolute right-1 top-1 rounded-full w-8 h-8 p-0 bg-green-500 hover:bg-green-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
