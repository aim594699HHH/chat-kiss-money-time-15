
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { GiftSelector } from './GiftSelector';
import { GiftAnimation } from './GiftAnimation';
import { User, Message } from '@/pages/Index';
import { Send, Gift, Image, X } from 'lucide-react';

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
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());
  const [chatBackground, setChatBackground] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Mark messages as read when they appear
    const newReadMessages = new Set(readMessages);
    messages.forEach(message => {
      if (message.senderId !== currentUser.id) {
        newReadMessages.add(message.id);
      }
    });
    setReadMessages(newReadMessages);
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    // Trigger typing indicator immediately when user starts typing
    if (onTyping && e.target.value.length > 0) {
      onTyping(true);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    } else if (onTyping && e.target.value.length === 0) {
      onTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
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

  const handleSendGift = (giftType: string, amount?: number) => {
    // Show animation for emotional stickers
    if (['kiss', 'angry', 'laugh', 'heart'].includes(giftType)) {
      setGiftAnimation({ type: giftType as 'kiss' | 'angry', show: true });
      setTimeout(() => {
        setGiftAnimation(null);
      }, 2000);
    }

    const giftMessages = {
      kiss: '💋 Sent a kiss!',
      angry: '😡 Is angry!',
      laugh: '😂 Is laughing!',
      heart: '❤️ Sent love!',
      thumbsUp: '👍 Liked!',
      fire: '🔥 That\'s hot!',
      clap: '👏 Applauding!',
      surprise: '😮 Surprised!'
    };

    onSendMessage({
      senderId: currentUser.id,
      text: giftMessages[giftType as keyof typeof giftMessages] || '💋 Sent a gift!',
      type: amount ? 'money' : 'gift',
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

  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setChatBackground(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeChatBackground = () => {
    setChatBackground('');
  };

  return (
    <div className="relative">
      <Card className="h-[700px] flex flex-col shadow-xl bg-white border-0 rounded-3xl overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-[#075E54] text-white p-4 rounded-t-3xl">
          <CardTitle className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-white">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-gray-300 text-gray-700 font-semibold">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-lg">{title}</div>
                <div className="text-sm opacity-90">
                  {otherUserTyping ? (
                    <span className="flex items-center gap-1">
                      typing
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </span>
                  ) : 'online'}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <label className="cursor-pointer p-2 hover:bg-white/10 rounded-full transition-colors">
                <Image className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundUpload}
                  className="hidden"
                />
              </label>
              {chatBackground && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeChatBackground}
                  className="p-2 hover:bg-white/10 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 relative">
          {/* Messages Area with proper ScrollArea */}
          <div className="flex-1 relative">
            <ScrollArea className="h-full px-4 py-2">
              <div 
                className="space-y-1 min-h-full p-4 rounded-2xl"
                style={{
                  backgroundColor: chatBackground ? 'transparent' : '#E5DDD5',
                  backgroundImage: chatBackground 
                    ? `linear-gradient(rgba(229, 221, 213, 0.8), rgba(229, 221, 213, 0.8)), url(${chatBackground})`
                    : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: chatBackground ? 'cover' : '60px 60px',
                  backgroundPosition: 'center',
                  backgroundRepeat: chatBackground ? 'no-repeat' : 'repeat'
                }}
              >
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === currentUser.id}
                    senderName={message.senderId === currentUser.id ? currentUser.name : otherUser.name}
                    senderAvatar={message.senderId === currentUser.id ? currentUser.avatar : otherUser.avatar}
                    isRead={readMessages.has(message.id)}
                  />
                ))}
                
                {otherUserTyping && (
                  <div className="flex items-center gap-2 animate-fade-in mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                      <AvatarFallback className="text-xs bg-gray-300">{otherUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
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
            </ScrollArea>
          </div>

          {/* Gift Selector */}
          {showGifts && (
            <div className="absolute bottom-20 left-0 right-0 z-10">
              <GiftSelector
                onSendGift={handleSendGift}
                onClose={() => setShowGifts(false)}
              />
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-[#F0F0F0] border-t border-gray-200 rounded-b-3xl">
            <div className="flex gap-3 items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGifts(!showGifts)}
                className="rounded-full w-12 h-12 p-0 text-gray-600 hover:bg-gray-200 flex-shrink-0"
              >
                <Gift className="w-6 h-6" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message"
                  className="rounded-full border-0 bg-white shadow-sm pr-14 py-3 px-4 focus:ring-2 focus:ring-[#25D366] text-base"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  size="sm"
                  className="absolute right-2 top-2 rounded-full w-10 h-10 p-0 bg-[#25D366] hover:bg-[#128C7E] disabled:bg-gray-300 transition-colors"
                >
                  <Send className="w-5 h-5" />
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
