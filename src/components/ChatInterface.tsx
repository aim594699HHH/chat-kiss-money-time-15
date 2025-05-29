import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { GiftSelector } from './GiftSelector';
import { GiftAnimation } from './GiftAnimation';
import { ImageViewer } from './ImageViewer';
import { User, Message } from '@/pages/Index';
import { Send, Gift, Image, X, Video, Phone } from 'lucide-react';

interface ChatInterfaceProps {
  currentUser: User;
  otherUser: User;
  messages: Message[];
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  title: string;
  onTyping?: (isTyping: boolean) => void;
  otherUserTyping?: boolean;
  onMessageRead?: (messageId: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  currentUser,
  otherUser,
  messages,
  onSendMessage,
  title,
  onTyping,
  otherUserTyping = false,
  onMessageRead,
}) => {
  const [inputText, setInputText] = useState('');
  const [showGifts, setShowGifts] = useState(false);
  const [giftAnimation, setGiftAnimation] = useState<{ type: 'kiss' | 'angry', show: boolean, fromOther: boolean } | null>(null);
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());
  const [chatBackground, setChatBackground] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processedGiftMessages, setProcessedGiftMessages] = useState<Set<string>>(new Set());
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
        if (onMessageRead) {
          onMessageRead(message.id);
        }
        
        // Show animation for gifts received from other user - only once per message
        if (message.type === 'gift' && 
            ['kiss', 'angry', 'laugh', 'heart'].includes(message.giftType || '') &&
            !processedGiftMessages.has(message.id)) {
          
          // Add message ID to processed gifts to prevent showing again
          setProcessedGiftMessages(prev => new Set([...prev, message.id]));
          
          // Reset animation and show new one
          setGiftAnimation(null);
          setTimeout(() => {
            setGiftAnimation({ 
              type: message.giftType as 'kiss' | 'angry', 
              show: true, 
              fromOther: true 
            });
          }, 100);
        }
      }
    });
    setReadMessages(newReadMessages);
  }, [messages, currentUser.id, onMessageRead]);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onSendMessage({
          senderId: currentUser.id,
          text: 'Image',
          type: 'image',
          imageUrl: result,
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
      // Reset the input value to prevent flickering
      event.target.value = '';
    }
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

  const handleVideoCall = () => {
    console.log(`Starting video call with ${otherUser.name}`);
    // Add video call logic here
  };

  const handleVoiceCall = () => {
    console.log(`Starting voice call with ${otherUser.name}`);
    // Add voice call logic here
  };

  const handleGiftAnimationComplete = () => {
    console.log('Gift animation completed, hiding...');
    setGiftAnimation(null);
  };

  return (
    <div className="relative">
      <Card className="h-[700px] flex flex-col shadow-xl bg-white border-0 rounded-3xl overflow-hidden">
        {/* Header - Fixed at top */}
        <CardHeader className="bg-[#075E54] text-white p-4 rounded-t-3xl flex-shrink-0 sticky top-0 z-10">
          <CardTitle className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-white">
                <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                <AvatarFallback className="bg-gray-300 text-gray-700 font-semibold">
                  {otherUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold text-lg">{otherUser.name}</div>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceCall}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Phone className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVideoCall}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <Video className="w-5 h-5" />
              </Button>
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

        <CardContent className="flex-1 flex flex-col p-0 relative overflow-hidden">
          {/* Messages Area with proper ScrollArea */}
          <div className="flex-1 relative">
            <ScrollArea className="h-full">
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
                    onImageClick={setSelectedImage}
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
                
                {isUploading && (
                  <div className="flex justify-end mb-4">
                    <div className="bg-[#DCF8C6] rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-600">Uploading image...</span>
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

          {/* Input Area - Fixed at bottom */}
          <div className="p-4 bg-[#F0F0F0] border-t border-gray-200 rounded-b-3xl flex-shrink-0">
            <div className="flex gap-3 items-end relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGifts(!showGifts)}
                className="rounded-full w-12 h-12 p-0 text-gray-600 hover:bg-gray-200 flex-shrink-0"
              >
                <Gift className="w-6 h-6" />
              </Button>
              
              <label className="cursor-pointer rounded-full w-12 h-12 p-0 text-gray-600 hover:bg-gray-200 flex-shrink-0 flex items-center justify-center">
                <Image className="w-6 h-6" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message"
                  className="rounded-full border-0 bg-white shadow-sm pr-16 py-3 px-4 focus:ring-2 focus:ring-[#25D366] text-base"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-[#25D366] hover:bg-[#128C7E] disabled:bg-gray-300 transition-colors z-10"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gift Animation Overlay - Only show for received gifts */}
      {giftAnimation && giftAnimation.show && giftAnimation.fromOther && (
        <GiftAnimation 
          type={giftAnimation.type} 
          onComplete={handleGiftAnimationComplete}
        />
      )}

      {/* Image Viewer */}
      {selectedImage && (
        <ImageViewer
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};
