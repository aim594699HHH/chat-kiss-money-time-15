
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/pages/Index';
import { formatTime } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName: string;
  senderAvatar: string;
  isRead?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  senderName,
  senderAvatar,
  isRead = false,
}) => {
  const renderMessageContent = () => {
    if (message.type === 'gift') {
      const emojiMap = {
        kiss: '💋',
        angry: '😡',
        laugh: '😂',
        heart: '❤️',
        thumbsUp: '👍',
        fire: '🔥',
        clap: '👏',
        surprise: '😮'
      };
      
      return (
        <div className="flex items-center gap-2">
          <span className="text-3xl animate-bounce">
            {emojiMap[message.giftType as keyof typeof emojiMap] || '💋'}
          </span>
          <span className="font-medium">{message.text}</span>
        </div>
      );
    }

    if (message.type === 'money') {
      return (
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-3xl p-3 max-w-full">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">$</span>
            </div>
            <span className="font-semibold text-yellow-800">Money Transfer</span>
          </div>
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-3xl shadow-lg">
            <div className="text-3xl font-bold text-center">${message.amount}</div>
            <div className="text-sm opacity-90 text-center mt-1">
              Sent with love 💝
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="text-xs text-gray-500">Transfer completed</div>
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        </div>
      );
    }

    return <span className="break-words">{message.text}</span>;
  };

  return (
    <div className={`flex gap-2 mb-4 animate-fade-in ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="text-xs bg-gray-300">{senderName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] ${isOwn ? 'order-1' : 'order-2'}`}>
        {!isOwn && (
          <div className="text-xs text-gray-500 mb-1 ml-3 font-medium">{senderName}</div>
        )}
        
        <div className="relative">
          <div
            className={`px-4 py-2 rounded-3xl shadow-sm relative ${
              isOwn
                ? 'bg-[#DCF8C6] text-gray-800 rounded-br-lg'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-lg'
            } ${message.type === 'money' ? 'p-2' : ''}`}
          >
            {renderMessageContent()}
            
            <div className="flex justify-end items-center gap-1 mt-1">
              <span className={`text-xs ${isOwn ? 'text-gray-600' : 'text-gray-500'}`}>
                {formatTime(message.timestamp)}
              </span>
              {isOwn && (
                <div className={`${isRead ? 'text-blue-500' : 'text-gray-400'} transition-colors`}>
                  {isRead ? (
                    // Double check marks (read)
                    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
                      <path d="M17.394 3.716l-.478-.372a.365.365 0 0 0-.51.063L10.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L6.566 9.879a.32.32 0 0 1-.484.033L3.891 7.769a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l3.61 3.465c.143.14.361.125.484-.033L12.91 3.379a.366.366 0 0 0-.063-.51z"/>
                    </svg>
                  ) : (
                    // Single check mark (delivered but not read)
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                      <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51z"/>
                    </svg>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="text-xs bg-green-200">{senderName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
