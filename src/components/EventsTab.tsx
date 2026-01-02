import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface GameEvent {
  id: number;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  eventReward: number;
  active: boolean;
  completed: boolean;
}

interface EventsTabProps {
  events: GameEvent[];
  eventCoins: number;
  onClaimReward: (eventId: number) => void;
}

const EventsTab = ({ events, eventCoins, onClaimReward }: EventsTabProps) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gradient">События</h2>
        <div className="flex items-center gap-2 bg-purple-950/40 px-4 py-2 rounded-lg border border-purple-500/30">
          <Icon name="Sparkles" className="text-purple-400" size={20} />
          <span className="font-bold text-purple-400">{eventCoins} эвент-коинов</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {events.map((event) => {
          const progressPercent = (event.progress / event.total) * 100;
          const isCompleted = event.progress >= event.total || event.completed;

          return (
            <Card 
              key={event.id} 
              className={`p-4 md:p-6 ${
                isCompleted 
                  ? 'bg-emerald-950/40 border-emerald-500/50 glow-green' 
                  : 'bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-bold">{event.title}</h3>
                {event.active && !isCompleted && (
                  <Badge className="bg-emerald-500 text-black text-xs">Активно</Badge>
                )}
                {isCompleted && (
                  <Badge className="bg-yellow-500 text-black text-xs">Завершено</Badge>
                )}
              </div>

              <p className="text-gray-300 mb-4 text-sm md:text-base">{event.description}</p>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Прогресс</span>
                    <span className="font-bold">
                      {event.progress} / {event.total}
                    </span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex gap-3">
                  <div className="flex items-center gap-1">
                    <Icon name="Coins" className="text-yellow-400" size={16} />
                    <span className="font-bold text-yellow-400 text-sm">+{event.reward}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Sparkles" className="text-purple-400" size={16} />
                    <span className="font-bold text-purple-400 text-sm">+{event.eventReward}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => {
                  if (isCompleted && !event.completed) {
                    onClaimReward(event.id);
                  } else {
                    toast.info('Продолжайте игру для выполнения события!');
                  }
                }}
                className="w-full"
                size="sm"
                disabled={!isCompleted || event.completed}
                variant={isCompleted && !event.completed ? "default" : "secondary"}
              >
                {event.completed ? 'Награда получена' : isCompleted ? 'Забрать награду' : 'В процессе'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EventsTab;
