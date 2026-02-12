import {
    GraduationCap,
    Briefcase,
    RefreshCw,
    AlertTriangle,
    TrendingUp,
    Heart,
    Building,
    Home,
    Users,
    PauseCircle,
    Rocket,
    Sun,
    Activity,
    MapPin,
    HeartHandshake,
    Car,
    Palmtree,
    Wallet,
    ShieldCheck,
    LucideIcon
} from 'lucide-react';
import { LifeEventType } from '@/types/life-planning';

export const EVENT_ICONS: Record<LifeEventType, LucideIcon> = {
    education: GraduationCap,
    job: Briefcase,
    'job-change': RefreshCw,
    'job-loss': AlertTriangle,
    'side-hustle': TrendingUp,
    marriage: Heart,
    rent: Building,
    home: Home,
    children: Users,
    'career-break': PauseCircle,
    business: Rocket,
    retirement: Sun,
    health: Activity,
    move: MapPin,
    'family-support': HeartHandshake,
    car: Car,
    vacation: Palmtree,
    'one-time-expense': Wallet,
    insurance: ShieldCheck
};

export const getEventIcon = (type: LifeEventType) => {
    return EVENT_ICONS[type] || Briefcase;
};
