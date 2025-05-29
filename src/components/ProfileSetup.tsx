
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/pages/Index';

interface ProfileSetupProps {
  user1: User;
  user2: User;
  setUser1: (user: User) => void;
  setUser2: (user: User) => void;
  onComplete: () => void;
}

const defaultAvatars = [
  'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=100&h=100&fit=crop&crop=face',
];

export const ProfileSetup: React.FC<ProfileSetupProps> = ({
  user1,
  user2,
  setUser1,
  setUser2,
  onComplete,
}) => {
  const [showAvatarSelector, setShowAvatarSelector] = useState<'1' | '2' | null>(null);

  const handleAvatarSelect = (avatar: string, userId: '1' | '2') => {
    if (userId === '1') {
      setUser1({ ...user1, avatar });
    } else {
      setUser2({ ...user2, avatar });
    }
    setShowAvatarSelector(null);
  };

  const isComplete = user1.name.trim() && user2.name.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Dual Chat</h1>
          <p className="text-gray-600">Set up profiles for both participants</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* User 1 Setup */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-green-600">Person 1 Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Avatar 
                  className="w-24 h-24 cursor-pointer hover:ring-4 hover:ring-green-200 transition-all"
                  onClick={() => setShowAvatarSelector('1')}
                >
                  <AvatarImage src={user1.avatar} />
                  <AvatarFallback className="text-2xl bg-green-100">
                    {user1.name.charAt(0) || '1'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <Label htmlFor="user1-name">Name/Nickname</Label>
                <Input
                  id="user1-name"
                  value={user1.name}
                  onChange={(e) => setUser1({ ...user1, name: e.target.value })}
                  placeholder="Enter your name..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* User 2 Setup */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-blue-600">Person 2 Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Avatar 
                  className="w-24 h-24 cursor-pointer hover:ring-4 hover:ring-blue-200 transition-all"
                  onClick={() => setShowAvatarSelector('2')}
                >
                  <AvatarImage src={user2.avatar} />
                  <AvatarFallback className="text-2xl bg-blue-100">
                    {user2.name.charAt(0) || '2'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <Label htmlFor="user2-name">Name/Nickname</Label>
                <Input
                  id="user2-name"
                  value={user2.name}
                  onChange={(e) => setUser2({ ...user2, name: e.target.value })}
                  placeholder="Enter your name..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Avatar Selector */}
        {showAvatarSelector && (
          <Card className="mt-6 shadow-lg animate-fade-in">
            <CardHeader>
              <CardTitle className="text-center">Choose an Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {defaultAvatars.map((avatar, index) => (
                  <Avatar
                    key={index}
                    className="w-16 h-16 cursor-pointer hover:ring-4 hover:ring-purple-200 transition-all hover-scale"
                    onClick={() => handleAvatarSelect(avatar, showAvatarSelector)}
                  >
                    <AvatarImage src={avatar} />
                    <AvatarFallback>{index + 1}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setShowAvatarSelector(null)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <Button
            onClick={onComplete}
            disabled={!isComplete}
            size="lg"
            className="px-8 py-3 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            Start Chatting
          </Button>
        </div>
      </div>
    </div>
  );
};
