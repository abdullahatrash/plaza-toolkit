'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Gavel,
  Clock,
  AlertCircle,
  FileText,
  RefreshCw
} from 'lucide-react';
import { CaseStatus, Priority } from '@workspace/database';
import { formatDate } from '@workspace/lib/utils';
import { toast } from 'sonner';

interface Case {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  priority: string;
  courtDate: string | null;
  legalStatus: string | null;
  _count: {
    reports: number;
  };
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CourtCalendarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<Case[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchCasesWithCourtDates();
  }, []);

  const fetchCasesWithCourtDates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cases?assigned=me&hasCourtDate=true');

      if (!response.ok) {
        throw new Error('Failed to fetch cases');
      }

      const data = await response.json();
      setCases(data.cases || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Failed to load court calendar');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getCasesForDate = (date: Date) => {
    return cases.filter(c => {
      if (!c.courtDate) return false;
      const courtDate = new Date(c.courtDate);
      return (
        courtDate.getDate() === date.getDate() &&
        courtDate.getMonth() === date.getMonth() &&
        courtDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  // Generate calendar days
  const calendarDays: (Date | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day));
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date) => {
    return date < today;
  };

  const selectedDateCases = selectedDate ? getCasesForDate(selectedDate) : [];

  // Get upcoming cases (next 30 days)
  const upcomingCases = cases.filter(c => {
    if (!c.courtDate) return false;
    const courtDate = new Date(c.courtDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return courtDate >= today && courtDate <= thirtyDaysFromNow;
  }).sort((a, b) => new Date(a.courtDate!).getTime() - new Date(b.courtDate!).getTime());

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Court Calendar</h1>
          <p className="text-muted-foreground mt-2">
            Scheduled court dates and deadlines
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/cases/my')}>
          <FileText className="h-4 w-4 mr-2" />
          My Cases
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                {MONTHS[month]} {year}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {DAYS.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const casesOnDate = getCasesForDate(date);
                const isSelected = selectedDate?.toDateString() === date.toDateString();

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      aspect-square p-2 rounded-md border transition-all
                      ${isToday(date) ? 'border-primary border-2 bg-primary/5' : 'border-border'}
                      ${isPast(date) ? 'text-muted-foreground' : ''}
                      ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}
                      ${casesOnDate.length > 0 ? 'font-semibold' : ''}
                    `}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span className="text-sm">{date.getDate()}</span>
                      {casesOnDate.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {casesOnDate.slice(0, 3).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? 'bg-primary-foreground' : 'bg-primary'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Date Details */}
            {selectedDate && selectedDateCases.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">
                  {formatDate(selectedDate.toISOString(), 'long')}
                </h3>
                <div className="space-y-2">
                  {selectedDateCases.map(caseItem => (
                    <div
                      key={caseItem.id}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-accent cursor-pointer transition-all"
                      onClick={() => router.push(`/dashboard/cases/${caseItem.id}`)}
                    >
                      <div>
                        <p className="font-medium">{caseItem.title}</p>
                        <p className="text-sm text-muted-foreground">Case #{caseItem.caseNumber}</p>
                      </div>
                      <Gavel className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && selectedDateCases.length === 0 && (
              <div className="mt-6 pt-6 border-t text-center text-muted-foreground">
                No cases scheduled for {formatDate(selectedDate.toISOString(), 'long')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Cases Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming (30 days)</CardTitle>
              <CardDescription>{upcomingCases.length} cases scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingCases.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No upcoming court dates</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {upcomingCases.map(caseItem => {
                    const courtDate = new Date(caseItem.courtDate!);
                    const daysUntil = Math.ceil((courtDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <div
                        key={caseItem.id}
                        className="p-3 border rounded-md hover:bg-accent cursor-pointer transition-all"
                        onClick={() => router.push(`/dashboard/cases/${caseItem.id}`)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-medium text-sm line-clamp-1">{caseItem.title}</h4>
                          {daysUntil <= 7 && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {daysUntil}d
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{formatDate(caseItem.courtDate!, 'short')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <FileText className="h-3 w-3" />
                          <span>Case #{caseItem.caseNumber}</span>
                        </div>
                        {caseItem.legalStatus && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {caseItem.legalStatus}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total with Dates</span>
                <span className="font-semibold">{cases.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="font-semibold">
                  {cases.filter(c => {
                    if (!c.courtDate) return false;
                    const courtDate = new Date(c.courtDate);
                    return courtDate.getMonth() === month && courtDate.getFullYear() === year;
                  }).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Next 7 Days</span>
                <span className="font-semibold text-orange-600">
                  {upcomingCases.filter(c => {
                    const courtDate = new Date(c.courtDate!);
                    const sevenDaysFromNow = new Date();
                    sevenDaysFromNow.setDate(today.getDate() + 7);
                    return courtDate <= sevenDaysFromNow;
                  }).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
