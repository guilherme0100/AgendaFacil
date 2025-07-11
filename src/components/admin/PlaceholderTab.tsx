
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderTabProps {
  title: string;
  description: string;
  icon: LucideIcon;
  message: string;
  subtitle: string;
}

export const PlaceholderTab = ({ 
  title, 
  description, 
  icon: Icon, 
  message, 
  subtitle 
}: PlaceholderTabProps) => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Icon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
};
