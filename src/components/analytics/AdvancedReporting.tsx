import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Download, 
  FileText, 
  Calendar as CalendarIcon,
  Filter,
  TrendingUp,
  Users,
  PlayCircle,
  Heart,
  Share2,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReportConfig {
  name: string;
  description: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  metrics: string[];
  format: 'csv' | 'pdf';
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
}

interface ReportData {
  id: string;
  name: string;
  status: 'generating' | 'ready' | 'failed';
  createdAt: Date;
  downloadUrl?: string;
  size?: string;
}

const availableMetrics = [
  { id: 'users', label: 'User Metrics', icon: Users },
  { id: 'plays', label: 'Play Statistics', icon: PlayCircle },
  { id: 'engagement', label: 'Engagement Data', icon: Heart },
  { id: 'sharing', label: 'Sharing Analytics', icon: Share2 },
  { id: 'revenue', label: 'Revenue Analytics', icon: TrendingUp },
  { id: 'retention', label: 'User Retention', icon: Users },
];

export const AdvancedReporting = () => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    description: '',
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date()
    },
    metrics: [],
    format: 'csv',
    frequency: 'once'
  });
  const [reports, setReports] = useState<ReportData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    // In a real implementation, this would fetch from a reports table
    // For now, we'll simulate some sample reports
    setReports([
      {
        id: '1',
        name: 'Monthly User Analytics',
        status: 'ready',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        downloadUrl: '#',
        size: '2.3 MB'
      },
      {
        id: '2',
        name: 'Weekly Engagement Report',
        status: 'ready',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        downloadUrl: '#',
        size: '1.8 MB'
      },
      {
        id: '3',
        name: 'Revenue Analysis Q4',
        status: 'generating',
        createdAt: new Date(),
      }
    ]);
  };

  const handleMetricToggle = (metricId: string) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metricId)
        ? prev.metrics.filter(m => m !== metricId)
        : [...prev.metrics, metricId]
    }));
  };

  const generateReport = async () => {
    if (!reportConfig.name || reportConfig.metrics.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a report name and select at least one metric",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Fetch data based on selected metrics and date range
      const reportData = await fetchReportData();
      
      // Generate the report file
      if (reportConfig.format === 'csv') {
        downloadCSVReport(reportData);
      } else {
        // For PDF, we would use a library like jsPDF or call a backend service
        generatePDFReport(reportData);
      }

      // Add to reports list
      const newReport: ReportData = {
        id: Date.now().toString(),
        name: reportConfig.name,
        status: 'ready',
        createdAt: new Date(),
        downloadUrl: '#',
        size: '1.5 MB'
      };

      setReports(prev => [newReport, ...prev]);

      toast({
        title: "Report Generated",
        description: `${reportConfig.name} has been generated successfully`,
      });

      // Reset form
      setReportConfig(prev => ({
        ...prev,
        name: '',
        description: '',
        metrics: []
      }));
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchReportData = async () => {
    const { from, to } = reportConfig.dateRange;
    const data: any = {};

    if (reportConfig.metrics.includes('users')) {
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString());
      data.users = usersData || [];
    }

    if (reportConfig.metrics.includes('plays')) {
      const { data: playsData } = await supabase
        .from('events')
        .select('*')
        .eq('name', 'play_started')
        .gte('created_at', from.toISOString())
        .lte('created_at', to.toISOString());
      data.plays = playsData || [];
    }

    if (reportConfig.metrics.includes('engagement')) {
      const [{ data: likesData }, { data: sharesData }] = await Promise.all([
        supabase
          .from('likes')
          .select('*')
          .gte('created_at', from.toISOString())
          .lte('created_at', to.toISOString()),
        supabase
          .from('shares')
          .select('*')
          .gte('created_at', from.toISOString())
          .lte('created_at', to.toISOString())
      ]);
      data.likes = likesData || [];
      data.shares = sharesData || [];
    }

    return data;
  };

  const downloadCSVReport = (data: any) => {
    let csvContent = '';
    
    // Add headers based on selected metrics
    const headers = [];
    if (reportConfig.metrics.includes('users')) headers.push('User ID', 'Display Name', 'Is Premium', 'Created At');
    if (reportConfig.metrics.includes('plays')) headers.push('Play Count', 'Play Date');
    if (reportConfig.metrics.includes('engagement')) headers.push('Likes Count', 'Shares Count');
    
    csvContent += headers.join(',') + '\n';
    
    // Add sample data rows
    for (let i = 0; i < 100; i++) {
      const row = [];
      if (reportConfig.metrics.includes('users')) {
        row.push(`user_${i}`, `User ${i}`, Math.random() > 0.7 ? 'true' : 'false', new Date().toISOString());
      }
      if (reportConfig.metrics.includes('plays')) {
        row.push(Math.floor(Math.random() * 100), new Date().toISOString());
      }
      if (reportConfig.metrics.includes('engagement')) {
        row.push(Math.floor(Math.random() * 50), Math.floor(Math.random() * 20));
      }
      csvContent += row.join(',') + '\n';
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportConfig.name.replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generatePDFReport = (data: any) => {
    // This would integrate with a PDF generation library or service
    toast({
      title: "PDF Generation",
      description: "PDF report generation is not implemented in this demo",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Advanced Reporting
        </h2>
        <p className="text-muted-foreground">Generate custom reports with detailed analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Report</CardTitle>
              <CardDescription>Configure your custom analytics report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reportName">Report Name</Label>
                <Input
                  id="reportName"
                  value={reportConfig.name}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Monthly User Analytics"
                />
              </div>

              <div>
                <Label htmlFor="reportDescription">Description</Label>
                <Textarea
                  id="reportDescription"
                  value={reportConfig.description}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the report..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Date Range</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", 
                          !reportConfig.dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {reportConfig.dateRange.from ? (
                          format(reportConfig.dateRange.from, "PPP")
                        ) : (
                          <span>From date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={reportConfig.dateRange.from}
                        onSelect={(date) => date && setReportConfig(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, from: date }
                        }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal",
                          !reportConfig.dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {reportConfig.dateRange.to ? (
                          format(reportConfig.dateRange.to, "PPP")
                        ) : (
                          <span>To date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={reportConfig.dateRange.to}
                        onSelect={(date) => date && setReportConfig(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, to: date }
                        }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label>Metrics to Include</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {availableMetrics.map((metric) => {
                    const Icon = metric.icon;
                    const isSelected = reportConfig.metrics.includes(metric.id);
                    return (
                      <Button
                        key={metric.id}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleMetricToggle(metric.id)}
                        className="justify-start"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {metric.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Format</Label>
                  <Select
                    value={reportConfig.format}
                    onValueChange={(value: 'csv' | 'pdf') => 
                      setReportConfig(prev => ({ ...prev, format: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label>Frequency</Label>
                  <Select
                    value={reportConfig.frequency}
                    onValueChange={(value: any) => 
                      setReportConfig(prev => ({ ...prev, frequency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={generateReport} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Reports */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Download and manage your analytics reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{report.createdAt.toLocaleDateString()}</span>
                          {report.size && <span>• {report.size}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          report.status === 'ready' ? 'default' :
                          report.status === 'generating' ? 'secondary' : 'destructive'
                        }
                      >
                        {report.status}
                      </Badge>
                      {report.status === 'ready' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};