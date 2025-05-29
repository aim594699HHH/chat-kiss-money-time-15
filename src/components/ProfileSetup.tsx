
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/pages/Index';
import { Upload } from 'lucide-react';

interface ProfileSetupProps {
  user1: User;
  user2: User;
  setUser1: (user: User) => void;
  setUser2: (user: User) => void;
  onComplete: () => void;
}

const defaultAvatars = [
  'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, userId: '1' | '2') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (userId === '1') {
          setUser1({ ...user1, avatar: result });
        } else {
          setUser2({ ...user2, avatar: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // تحديث شرط التحقق - يجب أن يكون الاسم أكثر من 2 أحرف على الأقل
  const isComplete = user1.name.trim().length >= 2 && user2.name.trim().length >= 2;

  const handleCompleteClick = () => {
    if (isComplete) {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#075E54] to-[#128C7E] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to Chat</h1>
          <p className="text-green-100">Set up profiles for both participants</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* User 1 Setup */}
          <Card className="shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl">
            <CardHeader className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-t-3xl">
              <CardTitle className="text-center">Person 1 Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar 
                    className="w-24 h-24 cursor-pointer hover:ring-4 hover:ring-green-200 transition-all"
                    onClick={() => setShowAvatarSelector('1')}
                  >
                    <AvatarImage src={user1.avatar} alt="User 1" />
                    <AvatarFallback className="text-2xl bg-green-100">
                      {user1.name.charAt(0) || '1'}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute -bottom-2 -right-2 bg-[#25D366] text-white rounded-full p-2 cursor-pointer hover:bg-[#128C7E] transition-colors">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, '1')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="user1-name" className="text-gray-700 font-medium">Name/Nickname (minimum 2 characters)</Label>
                <Input
                  id="user1-name"
                  value={user1.name}
                  onChange={(e) => setUser1({ ...user1, name: e.target.value })}
                  placeholder="Enter your name..."
                  className="mt-2 border-2 focus:border-[#25D366] rounded-lg"
                  minLength={2}
                />
                {user1.name.length > 0 && user1.name.length < 2 && (
                  <p className="text-red-500 text-sm mt-1">Name must be at least 2 characters</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User 2 Setup */}
          <Card className="shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl">
            <CardHeader className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-t-3xl">
              <CardTitle className="text-center">Person 2 Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar 
                    className="w-24 h-24 cursor-pointer hover:ring-4 hover:ring-green-200 transition-all"
                    onClick={() => setShowAvatarSelector('2')}
                  >
                    <AvatarImage src={user2.avatar} alt="User 2" />
                    <AvatarFallback className="text-2xl bg-green-100">
                      {user2.name.charAt(0) || '2'}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute -bottom-2 -right-2 bg-[#25D366] text-white rounded-full p-2 cursor-pointer hover:bg-[#128C7E] transition-colors">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, '2')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="user2-name" className="text-gray-700 font-medium">Name/Nickname (minimum 2 characters)</Label>
                <Input
                  id="user2-name"
                  value={user2.name}
                  onChange={(e) => setUser2({ ...user2, name: e.target.value })}
                  placeholder="Enter your name..."
                  className="mt-2 border-2 focus:border-[#25D366] rounded-lg"
                  minLength={2}
                />
                {user2.name.length > 0 && user2.name.length < 2 && (
                  <p className="text-red-500 text-sm mt-1">Name must be at least 2 characters</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Avatar Selector */}
        {showAvatarSelector && (
          <Card className="mt-6 shadow-xl animate-fade-in bg-white/95 backdrop-blur-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-center text-gray-800">Choose an Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {defaultAvatars.map((avatar, index) => (
                  <Avatar
                    key={index}
                    className="w-16 h-16 cursor-pointer hover:ring-4 hover:ring-[#25D366] transition-all hover-scale"
                    onClick={() => handleAvatarSelect(avatar, showAvatarSelector)}
                  >
                    <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                    <AvatarFallback>{index + 1}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-2 hover:bg-gray-50 rounded-full"
                onClick={() => setShowAvatarSelector(null)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8">
          <Button
            onClick={handleCompleteClick}
            disabled={!isComplete}
            size="lg"
            className="px-8 py-4 text-lg bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] text-white font-semibold rounded-full shadow-lg transform transition-all hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            Start Chatting 💬
          </Button>
          {!isComplete && (
            <p className="text-white/80 text-sm mt-2">Please complete both profiles with at least 2 characters each</p>
          )}
        </div>
      </div>
    </div>
  );
};
