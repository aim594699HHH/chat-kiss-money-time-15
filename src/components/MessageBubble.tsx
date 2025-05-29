
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/pages/Index';
import { formatTime } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName: string;
  senderAvatar: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  senderName,
  senderAvatar,
}) => {
  const renderMessageContent = () => {
    if (message.type === 'gift') {
      return (
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {message.giftType === 'kiss' ? '💋' : '😡'}
          </span>
          <span>{message.text}</span>
        </div>
      );
    }

    if (message.type === 'money') {
      return (
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💰</span>
            <span className="font-semibold">Money Transfer</span>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-3 rounded-lg animate-pulse">
            <div className="text-xl font-bold">${message.amount}</div>
            <div className="text-sm opacity-90">Sent with love 💋</div>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
      );
    }

    return <span>{message.text}</span>;
  };

  return (
    <div className={`flex gap-2 animate-fade-in ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={senderAvatar} />
          <AvatarFallback className="text-xs">{senderName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
        {!isOwn && (
          <div className="text-xs text-gray-500 mb-1 ml-2">{senderName}</div>
        )}
        
        <div
          className={`p-3 rounded-2xl shadow-sm ${
            isOwn
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white ml-auto'
              : 'bg-white border border-gray-200'
          } ${message.type === 'money' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200' : ''}`}
        >
          {renderMessageContent()}
          
          <div
            className={`text-xs mt-1 ${
              isOwn ? 'text-green-100' : 'text-gray-500'
            }`}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>

      {isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={senderAvatar} />
          <AvatarFallback className="text-xs">{senderName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
