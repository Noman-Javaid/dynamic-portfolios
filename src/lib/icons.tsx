import {
  Gem,
  Braces,
  Code2,
  Sparkles,
  Cloud,
  Blocks,
  Server,
  Layers,
  Network,
  Database,
  TestTube,
  Plug,
  Cpu,
  Brain,
  Workflow,
  Container,
  GitBranch,
  Wallet,
  Coins,
  ShieldCheck,
  Activity,
  LineChart,
  Boxes,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Gem,
  Braces,
  Code2,
  Sparkles,
  Cloud,
  Blocks,
  Server,
  Layers,
  Network,
  Database,
  TestTube,
  Plug,
  Cpu,
  Brain,
  Workflow,
  Container,
  GitBranch,
  Wallet,
  Coins,
  ShieldCheck,
  Activity,
  LineChart,
  Boxes,
};

export const iconNames = Object.keys(iconMap).sort();

export function DynamicIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && iconMap[name]) || Boxes;
  return <Icon className={className} />;
}
