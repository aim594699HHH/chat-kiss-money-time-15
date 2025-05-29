
import React from 'react';
import { X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from './ChatInterface';
import { User, Message } from '@/pages/Index';

interface MobileViewProps {
  currentUser: User;
  otherUser: User;
  messages: Message[];
  onSendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  onTyping?: (isTyping: boolean) => void;
  otherUserTyping?: boolean;
  onMessageRead?: (messageId: string) => void;
  onClose: () => void;
}

export const MobileView: React.FC<MobileViewProps> = ({
  currentUser,
  otherUser,
  messages,
  onSendMessage,
  onTyping,
  otherUserTyping,
  onMessageRead,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Mobile Frame */}
      <div className="relative">
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="outline"
          size="sm"
          className="absolute -top-12 right-0 bg-white hover:bg-gray-100 z-10"
        >
          <X className="w-4 h-4 mr-2" />
          Close Mobile View
        </Button>
        
        {/* Mobile Device Frame */}
        <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
          <div className="bg-white rounded-[2rem] overflow-hidden" style={{ width: '375px', height: '812px' }}>
            {/* Mobile Status Bar */}
            <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 border border-white rounded-sm">
                  <div className="w-3 h-1 bg-white rounded-sm m-0.5"></div>
                </div>
              </div>
            </div>
            
            {/* Chat Interface - Full Mobile Screen */}
            <div className="h-full">
              <ChatInterface
                currentUser={currentUser}
                otherUser={otherUser}
                messages={messages}
                onSendMessage={onSendMessage}
                title={`${currentUser.name}'s Chat`}
                onTyping={onTyping}
                otherUserTyping={otherUserTyping}
                onMessageRead={onMessageRead}
              />
            </div>
          </div>
        </div>
        
        {/* Mobile Device Label */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          Perfect for Video Recording
        </div>
      </div>
    </div>
  );
};
