import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  valueClassName?: string;
}

export function InfoCard({ title, value, icon: Icon, description, valueClassName }: InfoCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] hover:border-accent transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold text-primary", valueClassName)}>{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground pt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
