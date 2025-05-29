
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { X, DollarSign } from 'lucide-react';

interface GiftSelectorProps {
  onSendGift: (giftType: string, amount?: number) => void;
  onClose: () => void;
}

export const GiftSelector: React.FC<GiftSelectorProps> = ({ onSendGift, onClose }) => {
  const [showMoney, setShowMoney] = useState(false);
  const [amount, setAmount] = useState([50]);

  const stickers = [
    { type: 'kiss', emoji: '💋', label: 'Kiss', color: 'bg-pink-100 hover:bg-pink-200' },
    { type: 'angry', emoji: '😡', label: 'Angry', color: 'bg-red-100 hover:bg-red-200' },
    { type: 'laugh', emoji: '😂', label: 'Laugh', color: 'bg-yellow-100 hover:bg-yellow-200' },
    { type: 'heart', emoji: '❤️', label: 'Love', color: 'bg-red-100 hover:bg-red-200' },
    { type: 'thumbsUp', emoji: '👍', label: 'Like', color: 'bg-blue-100 hover:bg-blue-200' },
    { type: 'fire', emoji: '🔥', label: 'Hot', color: 'bg-orange-100 hover:bg-orange-200' },
    { type: 'clap', emoji: '👏', label: 'Clap', color: 'bg-green-100 hover:bg-green-200' },
    { type: 'surprise', emoji: '😮', label: 'Wow', color: 'bg-purple-100 hover:bg-purple-200' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20">
      <Card className="bg-white shadow-xl border-t-2 border-gray-200 rounded-t-2xl">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">
              {showMoney ? 'Send Money' : 'Send Sticker'}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {!showMoney ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {stickers.map((sticker) => (
                  <Button
                    key={sticker.type}
                    variant="ghost"
                    onClick={() => onSendGift(sticker.type)}
                    className={`h-16 flex flex-col gap-1 ${sticker.color} border border-gray-200 rounded-xl transition-all duration-200 hover:scale-105`}
                  >
                    <span className="text-2xl">{sticker.emoji}</span>
                    <span className="text-xs text-gray-600">{sticker.label}</span>
                  </Button>
                ))}
              </div>
              
              <Button
                onClick={() => setShowMoney(true)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl py-3 flex items-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                Send Money
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-2">${amount[0]}</div>
                  <div className="text-sm text-green-600">Amount to send</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Select Amount</div>
                <Slider
                  value={amount}
                  onValueChange={setAmount}
                  max={1000}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$1</span>
                  <span>$1000</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount([preset])}
                    className="rounded-lg"
                  >
                    ${preset}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowMoney(false)}
                  className="flex-1 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={() => onSendGift('kiss', amount[0])}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl"
                >
                  Send ${amount[0]}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
