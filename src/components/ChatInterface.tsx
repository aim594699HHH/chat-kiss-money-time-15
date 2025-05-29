import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChatHeader } from './ChatHeader';
import { MessagesArea } from './MessagesArea';
import { ChatInput } from './ChatInput';
import { GiftSelector } from './GiftSelector';
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
  const [readMessages, setReadMessages] = useState<Set<string>>(new Set());
  const [chatBackground, setChatBackground] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const messageObserverRef = useRef<IntersectionObserver | null>(null);

  // Enhanced scroll management with better stability
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      });
    }
  };

  // Setup intersection observer to detect when messages come into view
  useEffect(() => {
    if (messageObserverRef.current) {
      messageObserverRef.current.disconnect();
    }

    messageObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-message-id');
            const senderId = entry.target.getAttribute('data-sender-id');
            
            if (messageId && senderId !== currentUser.id) {
              // Mark message as read after a short delay (simulating reading time)
              setTimeout(() => {
                setReadMessages(prev => new Set([...prev, messageId]));
                if (onMessageRead) {
                  onMessageRead(messageId);
                }
              }, 500);
            }
          }
        });
      },
      {
        threshold: 0.8, // Message needs to be 80% visible to be marked as read
        rootMargin: '0px 0px -50px 0px' // Add some margin at the bottom
      }
    );

    return () => {
      if (messageObserverRef.current) {
        messageObserverRef.current.disconnect();
      }
    };
  }, [currentUser.id, onMessageRead]);

  useEffect(() => {
    // Mark messages as read when they appear
    const newReadMessages = new Set(readMessages);
    
    messages.forEach(message => {
      if (message.senderId !== currentUser.id) {
        newReadMessages.add(message.id);
        if (onMessageRead) {
          onMessageRead(message.id);
        }
      }
    });
    
    setReadMessages(newReadMessages);
    
    // Debounced scroll to bottom
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
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

  const handleToggleGifts = () => {
    setShowGifts(!showGifts);
  };

  return (
    <div className="relative h-full">
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
            messageObserver={messageObserverRef.current}
          />

          {/* Gift Selector - Fixed positioning */}
          {showGifts && (
            <div className="absolute bottom-20 left-0 right-0 z-20 mx-4">
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

      {/* Image Viewer - Fixed positioning */}
      {selectedImage && (
        <ImageViewer
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};
