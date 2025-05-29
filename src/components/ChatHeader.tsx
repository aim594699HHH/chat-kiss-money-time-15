
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/pages/Index';
import { Phone, Video, Image, X } from 'lucide-react';

interface ChatHeaderProps {
  otherUser: User;
  otherUserTyping: boolean;
  onVideoCall: () => void;
  onVoiceCall: () => void;
  onBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveBackground: () => void;
  chatBackground: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  otherUser,
  otherUserTyping,
  onVideoCall,
  onVoiceCall,
  onBackgroundUpload,
  onRemoveBackground,
  chatBackground,
}) => {
  return (
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
            onClick={onVoiceCall}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onVideoCall}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Video className="w-5 h-5" />
          </Button>
          <label className="cursor-pointer p-2 hover:bg-white/10 rounded-full transition-colors">
            <Image className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={onBackgroundUpload}
              className="hidden"
            />
          </label>
          {chatBackground && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveBackground}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </CardTitle>
    </CardHeader>
  );
};
