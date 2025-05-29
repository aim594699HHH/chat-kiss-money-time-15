
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChatHeader } from './ChatHeader';
import { MessagesArea } from './MessagesArea';
import { ChatInput } from './ChatInput';
import { GiftSelector } from './GiftSelector';
import { GiftAnimation } from './GiftAnimation';
import { ImageViewer } from './ImageViewer';
import { User, Message } from '@/pages/Index';

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Mark messages as read when they appear
    const newReadMessages = new Set(readMessages);
    let hasNewGift = false;
    let latestGiftMessage: Message | null = null;
    
    messages.forEach(message => {
      if (message.senderId !== currentUser.id) {
        newReadMessages.add(message.id);
        if (onMessageRead) {
          onMessageRead(message.id);
        }
        
        // Check for new gift messages - only process the latest one
        if (message.type === 'gift' && 
            ['kiss', 'angry', 'laugh', 'heart'].includes(message.giftType || '') &&
            !processedGiftMessages.has(message.id)) {
          
          hasNewGift = true;
          latestGiftMessage = message;
        }
      }
    });

    // Only show animation for the latest gift message if there's a new one
    if (hasNewGift && latestGiftMessage) {
      // Add ALL new gift messages to processed set to prevent duplicates
      const newProcessedGifts = new Set(processedGiftMessages);
      messages.forEach(message => {
        if (message.type === 'gift' && 
            message.senderId !== currentUser.id &&
            ['kiss', 'angry', 'laugh', 'heart'].includes(message.giftType || '')) {
          newProcessedGifts.add(message.id);
        }
      });
      setProcessedGiftMessages(newProcessedGifts);
      
      // Reset any existing animation first
      setGiftAnimation(null);
      
      // Show animation for the latest gift only
      setTimeout(() => {
        setGiftAnimation({ 
          type: latestGiftMessage!.giftType as 'kiss' | 'angry', 
          show: true, 
          fromOther: true 
        });
      }, 100);
    }
    
    setReadMessages(newReadMessages);
  }, [messages, currentUser.id, onMessageRead, processedGiftMessages]);

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

  const handleToggleGifts = () => {
    setShowGifts(!showGifts);
  };

  return (
    <div className="relative">
      <Card className="h-[700px] flex flex-col shadow-xl bg-white border-0 rounded-3xl overflow-hidden">
        <ChatHeader
          otherUser={otherUser}
          otherUserTyping={otherUserTyping}
          onVideoCall={handleVideoCall}
          onVoiceCall={handleVoiceCall}
          onBackgroundUpload={handleBackgroundUpload}
          onRemoveBackground={removeChatBackground}
          chatBackground={chatBackground}
        />

        <CardContent className="flex-1 flex flex-col p-0 relative overflow-hidden">
          <MessagesArea
            messages={messages}
            currentUser={currentUser}
            otherUser={otherUser}
            otherUserTyping={otherUserTyping}
            readMessages={readMessages}
            chatBackground={chatBackground}
            isUploading={isUploading}
            messagesEndRef={messagesEndRef}
            onImageClick={setSelectedImage}
          />

          {/* Gift Selector */}
          {showGifts && (
            <div className="absolute bottom-20 left-0 right-0 z-10">
              <GiftSelector
                onSendGift={handleSendGift}
                onClose={() => setShowGifts(false)}
              />
            </div>
          )}

          <ChatInput
            inputText={inputText}
            onInputChange={handleInputChange}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            onToggleGifts={handleToggleGifts}
            onImageUpload={handleImageUpload}
            inputRef={inputRef}
          />
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
