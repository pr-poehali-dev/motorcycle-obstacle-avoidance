import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

export interface Quest {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  reward: number;
  eventReward: number;
  completed: boolean;
  claimed: boolean;
  type: 'daily' | 'weekly' | 'special';
}

interface QuestsTabProps {
  quests: Quest[];
  onClaimReward: (questId: number) => void;
}

export default function QuestsTab({ quests, onClaimReward }: QuestsTabProps) {
  const dailyQuests = quests.filter(q => q.type === 'daily');
  const weeklyQuests = quests.filter(q => q.type === 'weekly');
  const specialQuests = quests.filter(q => q.type === 'special');

  const renderQuest = (quest: Quest) => {
    const percentage = Math.min((quest.progress / quest.target) * 100, 100);
    
    return (
      <Card
        key={quest.id}
        className={`p-4 md:p-6 transition-all ${
          quest.completed && !quest.claimed
            ? 'bg-emerald-950/40 border-emerald-500/50 glow-green'
            : quest.claimed
            ? 'bg-black/20 border-white/5 opacity-60'
            : 'bg-black/40 border-white/10'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${quest.completed ? 'bg-emerald-500/20' : 'bg-gray-800/40'}`}>
            <Icon
              name={quest.icon as any}
              className={quest.completed ? 'text-emerald-400' : 'text-gray-400'}
              size={28}
            />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-bold text-lg mb-1">{quest.title}</h3>
              <p className="text-sm text-gray-400">{quest.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Прогресс</span>
                <span className="font-bold">
                  {quest.progress}/{quest.target}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5">
                  <Icon name="Coins" className="text-yellow-400" size={18} />
                  <span className="font-bold text-yellow-400">+{quest.reward}</span>
                </div>
                {quest.eventReward > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Icon name="Sparkles" className="text-purple-400" size={18} />
                    <span className="font-bold text-purple-400">+{quest.eventReward}</span>
                  </div>
                )}
              </div>
              
              {quest.claimed ? (
                <Button size="sm" disabled variant="secondary">
                  <Icon name="Check" size={16} className="mr-1" />
                  Получено
                </Button>
              ) : quest.completed ? (
                <Button
                  size="sm"
                  onClick={() => onClaimReward(quest.id)}
                  className="glow-green"
                >
                  <Icon name="Gift" size={16} className="mr-1" />
                  Забрать награду
                </Button>
              ) : (
                <Button size="sm" disabled variant="ghost">
                  В процессе
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {dailyQuests.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Calendar" className="text-cyan-400" size={24} />
            <h2 className="text-2xl font-bold text-gradient">Ежедневные задания</h2>
          </div>
          <div className="grid gap-4">
            {dailyQuests.map(renderQuest)}
          </div>
        </div>
      )}

      {weeklyQuests.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="CalendarDays" className="text-purple-400" size={24} />
            <h2 className="text-2xl font-bold text-gradient">Недельные задания</h2>
          </div>
          <div className="grid gap-4">
            {weeklyQuests.map(renderQuest)}
          </div>
        </div>
      )}

      {specialQuests.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Star" className="text-yellow-400" size={24} />
            <h2 className="text-2xl font-bold text-gradient">Специальные задания</h2>
          </div>
          <div className="grid gap-4">
            {specialQuests.map(renderQuest)}
          </div>
        </div>
      )}
    </div>
  );
}
