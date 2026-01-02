import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface Upgrade {
  id: number;
  name: string;
  type: 'speed' | 'armor';
  level: number;
  maxLevel: number;
  price: number;
  icon: string;
}

interface UpgradesTabProps {
  upgrades: Upgrade[];
  coins: number;
  onUpgrade: (upgrade: Upgrade) => void;
}

const UpgradesTab = ({ upgrades, coins, onUpgrade }: UpgradesTabProps) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-6 md:mb-8">Улучшения</h2>
      <div className="grid sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
        {upgrades.map((upgrade) => {
          const cost = upgrade.price * (upgrade.level + 1);
          const isMaxLevel = upgrade.level >= upgrade.maxLevel;
          
          return (
            <Card key={upgrade.id} className="bg-black/40 border-white/10 p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-emerald-500/20 p-4 rounded-lg">
                  <Icon name={upgrade.icon as any} className="text-emerald-400" size={40} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl">{upgrade.name}</h3>
                  <p className="text-sm text-gray-400">
                    {upgrade.type === 'speed' ? 'Увеличивает максимальную скорость' : 'Защищает от столкновений'}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Уровень</span>
                    <span className="font-bold text-emerald-400">{upgrade.level} / {upgrade.maxLevel}</span>
                  </div>
                  <Progress value={(upgrade.level / upgrade.maxLevel) * 100} className="h-3" />
                </div>

                {!isMaxLevel && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Стоимость улучшения:</span>
                    <div className="flex items-center gap-2">
                      <Icon name="Coins" className="text-yellow-400" size={18} />
                      <span className="font-bold text-yellow-400">{cost}</span>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={() => onUpgrade(upgrade)}
                className="w-full"
                size="lg"
                disabled={isMaxLevel || coins < cost}
                variant={isMaxLevel ? "secondary" : "default"}
              >
                {isMaxLevel ? 'Макс. уровень' : `Улучшить до ${upgrade.level + 1} ур.`}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UpgradesTab;
