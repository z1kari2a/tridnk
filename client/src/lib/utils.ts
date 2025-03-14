import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
  
  return formatter.format(amount);
}

export function getRandomChangeInPercent(min: number = -2, max: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

export function getPercentChangeClass(percentChange: number): string {
  return percentChange >= 0 ? 'text-green-500' : 'text-red-500';
}

export function getPercentChangeIcon(percentChange: number): string {
  return percentChange >= 0 ? 'arrow-up' : 'arrow-down';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `منذ ${diffInSeconds} ثانية`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `منذ ${diffInMinutes} دقيقة`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `منذ ${diffInHours} ساعة`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `منذ ${diffInDays} يوم`;
}
