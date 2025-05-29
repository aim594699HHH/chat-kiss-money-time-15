
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Gift, Image } from 'lucide-react';

interface ChatInputProps {
  inputText: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onToggleGifts: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  onInputChange,
  onSendMessage,
  onKeyPress,
  onToggleGifts,
  onImageUpload,
  inputRef,
}) => {
  return (
    <div className="p-4 bg-[#F0F0F0] border-t border-gray-200 rounded-b-3xl flex-shrink-0">
      <div className="flex gap-3 items-end relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleGifts}
          className="rounded-full w-12 h-12 p-0 text-gray-600 hover:bg-gray-200 flex-shrink-0"
        >
          <Gift className="w-6 h-6" />
        </Button>
        
        <label className="cursor-pointer rounded-full w-12 h-12 p-0 text-gray-600 hover:bg-gray-200 flex-shrink-0 flex items-center justify-center">
          <Image className="w-6 h-6" />
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
        </label>
        
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={inputText}
            onChange={onInputChange}
            onKeyPress={onKeyPress}
            placeholder="Type a message"
            className="rounded-full border-0 bg-white shadow-sm pr-16 py-3 px-4 focus:ring-2 focus:ring-[#25D366] text-base"
          />
          <Button
            onClick={onSendMessage}
            disabled={!inputText.trim()}
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 p-0 bg-[#25D366] hover:bg-[#128C7E] disabled:bg-gray-300 transition-colors z-10"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
