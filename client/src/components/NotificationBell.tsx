import { useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUp, 
  ArrowDown, 
  Info
} from "lucide-react";

const NotificationBell = () => {
  const { t } = useTranslation();
  const { notifications, markAsRead } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setIsOpen(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "arrow-up":
        return <ArrowUp className="h-3 w-3" />;
      case "arrow-down":
        return <ArrowDown className="h-3 w-3" />;
      case "info":
        return <Info className="h-3 w-3" />;
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-500";
      case "error":
        return "bg-red-100 text-red-500";
      case "info":
        return "bg-blue-100 text-blue-500";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) {
      return t("notifications.justNow");
    }
    if (diffMins < 60) {
      return t("notifications.minutesAgo", { count: diffMins });
    }
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return t("notifications.hoursAgo", { count: diffHours });
    }
    const diffDays = Math.floor(diffHours / 24);
    return t("notifications.daysAgo", { count: diffDays });
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full"
        onClick={toggleNotifications}
        aria-label={t("notifications.toggle")}
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive"
            className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-[1.25rem] h-5 flex items-center justify-center"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-10 overflow-y-auto bg-transparent"
          onClick={handleClickOutside}
        >
          <div 
            className="absolute left-0 right-auto mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
            style={{ top: "3rem", left: "1rem" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="py-2 px-4 bg-primary-600 text-white rounded-t-md flex justify-between items-center">
              <h3 className="font-semibold">{t("notifications.title")}</h3>
              <span className="text-xs cursor-pointer hover:underline">
                {t("notifications.viewAll")}
              </span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {t("notifications.empty")}
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? "bg-blue-50/30" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-2 items-start">
                      <div className={`mt-1 rounded-full ${getTypeClass(notification.type)} p-2`}>
                        {getIcon(notification.icon)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{notification.title}</p>
                        <p className="text-xs text-gray-500">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="py-2 px-4 bg-gray-50 text-center text-gray-600 text-sm rounded-b-md">
              {t("notifications.manageSettings")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
