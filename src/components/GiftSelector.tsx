
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GiftSelectorProps {
  onSendGift: (giftType: 'kiss' | 'angry', amount?: number) => void;
  onClose: () => void;
}

export const GiftSelector: React.FC<GiftSelectorProps> = ({ onSendGift, onClose }) => {
  const [moneyAmount, setMoneyAmount] = useState('');

  const handleSendMoney = () => {
    const amount = parseFloat(moneyAmount);
    if (amount > 0) {
      onSendGift('kiss', amount);
      setMoneyAmount('');
    }
  };

  const playSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  return (
    <Card className="m-4 animate-scale-in border-2 border-purple-200 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-purple-600 text-lg">Send a Gift</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => {
              playSound();
              onSendGift('kiss');
            }}
            className="bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 text-white p-4 h-auto flex flex-col items-center gap-2 hover-scale"
          >
            <span className="text-2xl">💋</span>
            <span className="text-sm">Send Kiss</span>
          </Button>
          
          <Button
            onClick={() => {
              playSound();
              onSendGift('angry');
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 h-auto flex flex-col items-center gap-2 hover-scale"
          >
            <span className="text-2xl">😡</span>
            <span className="text-sm">Show Anger</span>
          </Button>
        </div>

        <div className="border-t pt-4">
          <div className="text-center text-sm text-gray-600 mb-3">💰 Send Money</div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Amount ($)"
              value={moneyAmount}
              onChange={(e) => setMoneyAmount(e.target.value)}
              className="flex-1"
              min="0"
              step="0.01"
            />
            <Button
              onClick={() => {
                playSound();
                handleSendMoney();
              }}
              disabled={!moneyAmount || parseFloat(moneyAmount) <= 0}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white hover-scale"
            >
              Send
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={onClose}
          className="w-full"
        >
          Cancel
        </Button>
      </CardContent>
    </Card>
  );
};
