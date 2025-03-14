import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Notification } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  markAsRead: () => {},
});

export const useNotification = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch notifications
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PATCH", `/api/notifications/${id}/read`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to mark notification as read: ${error}`,
      });
    },
  });

  const markAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  // Check for new notifications and show toast
  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read
    );

    if (unreadNotifications.length > 0) {
      // Show toast for the most recent unread notification
      const latestNotification = unreadNotifications[0];
      
      // Show toast for new notification
      toast({
        title: latestNotification.title,
        description: latestNotification.message,
        variant: latestNotification.type === "error" ? "destructive" : "default",
      });
    }
  }, [notifications, toast]);

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
