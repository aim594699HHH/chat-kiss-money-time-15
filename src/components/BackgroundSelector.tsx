
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BackgroundSelectorProps {
  currentBackground: string;
  onBackgroundChange: (background: string) => void;
  onClose: () => void;
}

const backgrounds = [
  { name: 'Green Gradient', class: 'bg-gradient-to-br from-green-50 to-green-100' },
  { name: 'Blue Ocean', class: 'bg-gradient-to-br from-blue-400 to-blue-600' },
  { name: 'Purple Sunset', class: 'bg-gradient-to-br from-purple-400 to-pink-400' },
  { name: 'Rose Gold', class: 'bg-gradient-to-br from-rose-200 to-rose-400' },
  { name: 'Emerald Forest', class: 'bg-gradient-to-br from-emerald-300 to-green-500' },
  { name: 'Twilight', class: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
  { name: 'Sunset Orange', class: 'bg-gradient-to-br from-orange-300 to-red-400' },
  { name: 'Ocean Breeze', class: 'bg-gradient-to-br from-cyan-200 to-blue-400' },
];

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentBackground,
  onBackgroundChange,
  onClose,
}) => {
  return (
    <Card className="mb-4 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-center">Choose Background</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {backgrounds.map((bg) => (
            <div
              key={bg.name}
              className={`${bg.class} h-20 rounded-lg cursor-pointer border-2 transition-all hover-scale ${
                currentBackground === bg.class ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'
              }`}
              onClick={() => onBackgroundChange(bg.class)}
            >
              <div className="h-full flex items-center justify-center">
                <span className="text-xs font-medium text-center px-2 bg-white/80 rounded backdrop-blur-sm">
                  {bg.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full mt-4"
        >
          Close
        </Button>
      </CardContent>
    </Card>
  );
};
