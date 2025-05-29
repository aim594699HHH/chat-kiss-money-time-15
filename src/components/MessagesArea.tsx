
import React, { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageBubble } from './MessageBubble';
import { Message, User } from '@/pages/Index';

interface MessagesAreaProps {
  messages: Message[];
  currentUser: User;
  otherUser: User;
  otherUserTyping: boolean;
  readMessages: Set<string>;
  chatBackground: string;
  isUploading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onImageClick: (imageUrl: string) => void;
  messageObserver?: IntersectionObserver | null;
}

export const MessagesArea: React.FC<MessagesAreaProps> = ({
  messages,
  currentUser,
  otherUser,
  otherUserTyping,
  readMessages,
  chatBackground,
  isUploading,
  messagesEndRef,
  onImageClick,
  messageObserver,
}) => {
  // Auto-scroll to bottom when new messages arrive, but maintain smooth scrolling
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end',
          inline: 'nearest'
        });
      }
    };

    // Small delay to ensure DOM has updated
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [messages.length, otherUserTyping, isUploading]);

  // Observe message elements for read status
  useEffect(() => {
    if (!messageObserver) return;

    const messageElements = document.querySelectorAll('[data-message-id]');
    messageElements.forEach(element => {
      messageObserver.observe(element);
    });

    return () => {
      messageElements.forEach(element => {
        messageObserver.unobserve(element);
      });
    };
  }, [messages, messageObserver]);

  return (
    <div className="flex-1 relative overflow-hidden">
      <ScrollArea className="h-full">
        <div 
          className="space-y-1 p-4 rounded-2xl will-change-scroll"
          style={{
            backgroundColor: chatBackground ? 'transparent' : '#E5DDD5',
            backgroundImage: chatBackground 
              ? `linear-gradient(rgba(229, 221, 213, 0.8), rgba(229, 221, 213, 0.8)), url(${chatBackground})`
              : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: chatBackground ? 'cover' : '60px 60px',
            backgroundPosition: 'center',
            backgroundRepeat: chatBackground ? 'no-repeat' : 'repeat',
            backgroundAttachment: 'local',
            minHeight: '100%',
            paddingBottom: '2rem'
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              data-message-id={message.id}
              data-sender-id={message.senderId}
            >
              <MessageBubble
                message={message}
                isOwn={message.senderId === currentUser.id}
                senderName={message.senderId === currentUser.id ? currentUser.name : otherUser.name}
                senderAvatar={message.senderId === currentUser.id ? currentUser.avatar : otherUser.avatar}
                isRead={readMessages.has(message.id)}
                onImageClick={onImageClick}
              />
            </div>
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
          
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </ScrollArea>
    </div>
  );
};
