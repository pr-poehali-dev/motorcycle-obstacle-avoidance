import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface Avatar {
  id: number;
  emoji: string;
  name: string;
  price: number;
  unlocked: boolean;
}

interface ProfileTabProps {
  nickname: string;
  selectedAvatar: string;
  avatars: Avatar[];
  coins: number;
  onNicknameChange: (name: string) => void;
  onAvatarSelect: (emoji: string) => void;
  onAvatarPurchase: (id: number) => void;
}

export default function ProfileTab({
  nickname,
  selectedAvatar,
  avatars,
  coins,
  onNicknameChange,
  onAvatarSelect,
  onAvatarPurchase
}: ProfileTabProps) {
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(nickname);

  const handleSaveName = () => {
    if (tempName.trim().length > 0) {
      onNicknameChange(tempName.trim());
      setEditingName(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-emerald-950/40 to-emerald-900/20 border-emerald-500/30 p-6 md:p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-6xl glow-green">
              {selectedAvatar}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 glow-green">
              <Icon name="Sparkles" size={20} />
            </div>
          </div>

          <div className="text-center space-y-2 w-full">
            {editingName ? (
              <div className="flex gap-2 max-w-sm mx-auto">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Введите никнейм"
                  maxLength={20}
                  className="text-center text-xl font-bold"
                />
                <Button onClick={handleSaveName} size="sm">
                  <Icon name="Check" size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl md:text-3xl font-bold text-gradient">{nickname}</h2>
                <Button
                  onClick={() => {
                    setEditingName(true);
                    setTempName(nickname);
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <Icon name="Pencil" size={16} />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xl">
            <div className="flex items-center gap-2">
              <Icon name="Coins" className="text-yellow-400" size={24} />
              <span className="font-bold text-yellow-400">{coins}</span>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-xl font-bold mb-4">Выберите аватар</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {avatars.map((avatar) => (
            <Card
              key={avatar.id}
              className={`relative p-4 transition-all cursor-pointer ${
                selectedAvatar === avatar.emoji
                  ? 'bg-emerald-500/20 border-emerald-500 glow-green'
                  : avatar.unlocked
                  ? 'bg-black/40 border-white/10 hover:border-emerald-500/50'
                  : 'bg-black/20 border-white/5 opacity-50'
              }`}
              onClick={() => {
                if (avatar.unlocked) {
                  onAvatarSelect(avatar.emoji);
                }
              }}
            >
              {!avatar.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-sm">
                  <Icon name="Lock" size={24} className="text-gray-400" />
                </div>
              )}
              <div className="text-center space-y-2">
                <div className="text-4xl">{avatar.emoji}</div>
                <div className="text-xs font-medium text-gray-400">{avatar.name}</div>
                {!avatar.unlocked && (
                  <div className="pt-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAvatarPurchase(avatar.id);
                      }}
                      size="sm"
                      className="w-full text-xs"
                      disabled={coins < avatar.price}
                    >
                      <Icon name="Coins" size={12} className="mr-1" />
                      {avatar.price}
                    </Button>
                  </div>
                )}
              </div>
              {selectedAvatar === avatar.emoji && (
                <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1">
                  <Icon name="Check" size={14} />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
