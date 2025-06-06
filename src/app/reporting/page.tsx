
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, Download, Filter, FileText, RefreshCw } from 'lucide-react';
import { useTasks } from '@/context/TasksContext'; // To get robot names
import { format } from 'date-fns';

interface Warehouse {
  id: string;
  name: string;
}

interface RobotOption {
  id: string;
  name: string;
}

type ReportPeriod = 'daily' | 'monthly' | 'yearly';

interface ReportEntry {
  period: string; // e.g., '2024-07-25', '2024-07', '2024'
  palletsMoved: number;
  missionsCompleted: number;
  uptimePercentage: number;
  alerts: number;
}

const mockWarehouses: Warehouse[] = [
  { id: 'all', name: 'All Warehouses' },
  { id: 'wh_a', name: 'Warehouse A - North Wing' },
  { id: 'wh_b', name: 'Warehouse B - South Wing' },
  { id: 'wh_c', name: 'Warehouse C - Logistics Hub' },
];

export default function ReportingPage() {
  const { allRobots } = useTasks();

  const robotOptions: RobotOption[] = useMemo(() => [
    { id: 'all', name: 'All Robots' },
    ...allRobots.map(r => ({ id: r.id, name: r.name }))
  ], [allRobots]);

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [selectedRobot, setSelectedRobot] = useState<string>('all');
  const [selectedReportPeriod, setSelectedReportPeriod] = useState<ReportPeriod>('daily');
  const [reportData, setReportData] = useState<ReportEntry[]>([]);
  const [isReportGenerated, setIsReportGenerated] = useState<boolean>(false);

  const handleGenerateReport = () => {
    console.log('Generating report with filters:', {
      warehouse: selectedWarehouse,
      robot: selectedRobot,
      period: selectedReportPeriod,
    });

    // Mock data generation
    const mockReport: ReportEntry[] = [];
    const today = new Date();
    if (selectedReportPeriod === 'daily') {
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        mockReport.push({
          period: format(date, 'yyyy-MM-dd'),
          palletsMoved: Math.floor(Math.random() * 50) + (selectedRobot !== 'all' ? 10 : 20),
          missionsCompleted: Math.floor(Math.random() * 10) + (selectedRobot !== 'all' ? 2 : 5),
          uptimePercentage: Math.floor(Math.random() * 10) + 90,
          alerts: Math.floor(Math.random() * 3),
        });
      }
    } else if (selectedReportPeriod === 'monthly') {
      for (let i = 0; i < 6; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        mockReport.push({
          period: format(date, 'yyyy-MM'),
          palletsMoved: Math.floor(Math.random() * 1000) + 800,
          missionsCompleted: Math.floor(Math.random() * 200) + 150,
          uptimePercentage: Math.floor(Math.random() * 5) + 92,
          alerts: Math.floor(Math.random() * 10) + 5,
        });
      }
    } else { // yearly
      for (let i = 0; i < 3; i++) {
        const date = new Date(today.getFullYear() - i, 0, 1);
        mockReport.push({
          period: format(date, 'yyyy'),
          palletsMoved: Math.floor(Math.random() * 10000) + 8000,
          missionsCompleted: Math.floor(Math.random() * 2000) + 1500,
          uptimePercentage: Math.floor(Math.random() * 3) + 95,
          alerts: Math.floor(Math.random() * 50) + 20,
        });
      }
    }
    setReportData(mockReport.sort((a, b) => new Date(b.period).getTime() - new Date(a.period).getTime()));
    setIsReportGenerated(true);
  };

  const handleExportReport = () => {
    if (reportData.length === 0) {
      alert("No report data to export. Please generate a report first.");
      return;
    }
    const headers = ["Period", "Pallets Moved", "Missions Completed", "Uptime (%)", "Alerts"];
    const csvRows = [
      headers.join(','),
      ...reportData.map(entry => [
        entry.period,
        entry.palletsMoved,
        entry.missionsCompleted,
        entry.uptimePercentage,
        entry.alerts
      ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `fleet_report_${selectedReportPeriod}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert("CSV export is not supported in this browser.");
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex items-center space-x-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-semibold text-primary">Fleet Reporting</h1>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Report Filters & Options</CardTitle>
          </div>
          <CardDescription>Select criteria and period to generate your fleet report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="warehouse-select" className="text-sm font-medium text-muted-foreground">Warehouse</Label>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger id="warehouse-select" className="mt-1">
                  <SelectValue placeholder="Select Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {mockWarehouses.map(wh => (
                    <SelectItem key={wh.id} value={wh.id}>{wh.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="robot-select" className="text-sm font-medium text-muted-foreground">Robot</Label>
              <Select value={selectedRobot} onValueChange={setSelectedRobot}>
                <SelectTrigger id="robot-select" className="mt-1">
                  <SelectValue placeholder="Select Robot" />
                </SelectTrigger>
                <SelectContent>
                  {robotOptions.map(robot => (
                    <SelectItem key={robot.id} value={robot.id}>{robot.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Report Period</Label>
            <Tabs value={selectedReportPeriod} onValueChange={(value) => setSelectedReportPeriod(value as ReportPeriod)} className="mt-1">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">Day-wise</TabsTrigger>
                <TabsTrigger value="monthly">Month-wise</TabsTrigger>
                <TabsTrigger value="yearly">Year-wise</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Button onClick={handleGenerateReport} className="w-full md:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {isReportGenerated && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Generated Report ({selectedReportPeriod})</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportReport}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
            <CardDescription>
              Showing {selectedReportPeriod} report for Warehouse: {mockWarehouses.find(w => w.id === selectedWarehouse)?.name || 'N/A'}
              , Robot: {robotOptions.find(r => r.id === selectedRobot)?.name || 'N/A'}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reportData.length > 0 ? (
              <ScrollArea className="h-[400px] w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Pallets Moved</TableHead>
                      <TableHead className="text-right">Missions Completed</TableHead>
                      <TableHead className="text-right">Uptime (%)</TableHead>
                      <TableHead className="text-right">Alerts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.map((entry) => (
                      <TableRow key={entry.period}>
                        <TableCell className="font-medium">{entry.period}</TableCell>
                        <TableCell className="text-right">{entry.palletsMoved}</TableCell>
                        <TableCell className="text-right">{entry.missionsCompleted}</TableCell>
                        <TableCell className="text-right">{entry.uptimePercentage}%</TableCell>
                        <TableCell className="text-right">{entry.alerts}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground text-center py-4">No data available for the selected criteria.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
