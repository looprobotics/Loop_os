
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, LabelList } from "recharts";
import { PieChart as RechartsPieChart, Pie, Tooltip as RechartsTooltip } from "recharts";
import { Package, ArrowDownToLine, ArrowUpFromLine, Archive, Truck, PieChartIcon, RefreshCw, ListChecks, BarChartHorizontalBig, Download } from "lucide-react";
import { format } from 'date-fns';

interface PalletMovement {
  id: string;
  robotId: string;
  robotName: string;
  warehouseId: string;
  warehouseName: string;
  taskType: 'Inbound' | 'Outbound' | 'Internal Transfer';
  palletsMoved: number;
  timestamp: Date;
}

interface Warehouse {
  id: string;
  name: string;
}

const mockWarehouses: Warehouse[] = [
  { id: 'all', name: 'All Warehouses' },
  { id: 'wh_a', name: 'Warehouse A - North Wing' },
  { id: 'wh_b', name: 'Warehouse B - South Wing' },
  { id: 'wh_c', name: 'Warehouse C - Logistics Hub' },
];

const mockRobotData: { id: string, name: string }[] = [
  { id: 'R001', name: 'Loop Fork 250 A' },
  { id: 'R002', name: 'Loop Fork 250 B' },
  { id: 'R003', name: 'Loop Fork 250 C' },
  { id: 'R004', name: 'Loop Fork 500' },
  { id: 'R005', name: 'Loop Fork 1000' },
  { id: 'R006', name: 'Ironhide' },
];


const initialPalletMovements: PalletMovement[] = [
  { id: 'pm001', robotId: 'R001', robotName: 'Loop Fork 250 A', warehouseId: 'wh_a', warehouseName: 'Warehouse A - North Wing', taskType: 'Inbound', palletsMoved: 15, timestamp: new Date(2024, 6, 20, 10, 30) },
  { id: 'pm002', robotId: 'R002', robotName: 'Loop Fork 250 B', warehouseId: 'wh_a', warehouseName: 'Warehouse A - North Wing', taskType: 'Outbound', palletsMoved: 10, timestamp: new Date(2024, 6, 20, 11, 15) },
  { id: 'pm003', robotId: 'R003', robotName: 'Loop Fork 250 C', warehouseId: 'wh_b', warehouseName: 'Warehouse B - South Wing', taskType: 'Internal Transfer', palletsMoved: 8, timestamp: new Date(2024, 6, 20, 12, 0) },
  { id: 'pm004', robotId: 'R001', robotName: 'Loop Fork 250 A', warehouseId: 'wh_b', warehouseName: 'Warehouse B - South Wing', taskType: 'Inbound', palletsMoved: 12, timestamp: new Date(2024, 6, 21, 9, 45) },
  { id: 'pm005', robotId: 'R004', robotName: 'Loop Fork 500', warehouseId: 'wh_c', warehouseName: 'Warehouse C - Logistics Hub', taskType: 'Outbound', palletsMoved: 25, timestamp: new Date(2024, 6, 21, 14, 0) },
  { id: 'pm006', robotId: 'R002', robotName: 'Loop Fork 250 B', warehouseId: 'wh_a', warehouseName: 'Warehouse A - North Wing', taskType: 'Inbound', palletsMoved: 7, timestamp: new Date(2024, 6, 22, 8, 0) },
  { id: 'pm007', robotId: 'R005', robotName: 'Loop Fork 1000', warehouseId: 'wh_c', warehouseName: 'Warehouse C - Logistics Hub', taskType: 'Internal Transfer', palletsMoved: 18, timestamp: new Date(2024, 6, 22, 10, 30) },
  { id: 'pm008', robotId: 'R006', robotName: 'Ironhide', warehouseId: 'wh_b', warehouseName: 'Warehouse B - South Wing', taskType: 'Inbound', palletsMoved: 20, timestamp: new Date(2024, 6, 22, 13, 15) },
];

const CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

interface InfoCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
}

function InfoCard({ title, value, icon: Icon, description }: InfoCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] hover:border-accent transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground pt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function PalletManagementPage() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('');
  const [movements, setMovements] = useState<PalletMovement[]>(initialPalletMovements);

  const handleRefresh = () => {
    console.log(`Refreshing data for warehouse: ${selectedWarehouse}, date range: ${dateRange}`);
    setMovements([...initialPalletMovements]);
  };

  const filteredMovements = useMemo(() => {
    return movements.filter(movement => {
      const warehouseMatch = selectedWarehouse === 'all' || movement.warehouseId === selectedWarehouse;
      return warehouseMatch;
    });
  }, [movements, selectedWarehouse, dateRange]);

  const handleExport = () => {
    if (filteredMovements.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = ["ID", "Robot ID", "Robot Name", "Warehouse ID", "Warehouse Name", "Task Type", "Pallets Moved", "Timestamp"];
    const csvRows = [
      headers.join(','),
      ...filteredMovements.map(m => [
        m.id,
        m.robotId,
        m.robotName,
        m.warehouseId,
        m.warehouseName,
        m.taskType,
        m.palletsMoved,
        format(new Date(m.timestamp), 'yyyy-MM-dd HH:mm:ss')
      ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')) // Escape quotes and ensure values are strings
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) { // Feature detection
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "pallet_movements_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert("CSV export is not supported in this browser.");
    }
  };

  const summaryStats = useMemo(() => {
    const totalPalletsMoved = filteredMovements.reduce((sum, m) => sum + m.palletsMoved, 0);
    const palletsInbound = filteredMovements.filter(m => m.taskType === 'Inbound').reduce((sum, m) => sum + m.palletsMoved, 0);
    const palletsOutbound = filteredMovements.filter(m => m.taskType === 'Outbound').reduce((sum, m) => sum + m.palletsMoved, 0);
    const palletsInStorage = Math.max(0, palletsInbound - palletsOutbound + 50);

    return { totalPalletsMoved, palletsInbound, palletsOutbound, palletsInStorage };
  }, [filteredMovements]);

  const pieChartData = useMemo(() => {
    const dataByWarehouse: Record<string, number> = {};
    filteredMovements.forEach(movement => {
      dataByWarehouse[movement.warehouseName] = (dataByWarehouse[movement.warehouseName] || 0) + movement.palletsMoved;
    });
    return Object.entries(dataByWarehouse).map(([name, value], index) => ({ name, value, fill: CHART_COLORS[index % CHART_COLORS.length] }));
  }, [filteredMovements]);

  const pieChartConfig = useMemo(() => {
    const config: any = {};
    pieChartData.forEach(item => {
      config[item.name] = { label: item.name, color: item.fill };
    });
    return config;
  }, [pieChartData]);

  const robotPalletSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    const loopRobotMovements = filteredMovements.filter(movement => movement.robotName.startsWith("Loop"));

    loopRobotMovements.forEach(movement => {
      summary[movement.robotName] = (summary[movement.robotName] || 0) + movement.palletsMoved;
    });
    return Object.entries(summary).map(([name, total], index) => ({
      name,
      total,
      fill: CHART_COLORS[index % CHART_COLORS.length]
    }));
  }, [filteredMovements]);

  const barChartConfig = useMemo(() => {
    const config: any = {};
    robotPalletSummary.forEach(item => {
      config[item.name] = { label: item.name, color: item.fill };
    });
    config.total = { label: 'Total Pallets' };
    return config;
  }, [robotPalletSummary]);


  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-semibold text-primary">Pallet Management</h1>
        </div>
      </div>
      <Card className="shadow-lg p-4 sm:p-6">
        <CardHeader className="p-0 pb-4 sm:pb-6">
          <CardTitle className="text-lg text-primary">Filters</CardTitle>
          <CardDescription>Refine pallet movement data by warehouse and date.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
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
              <Label htmlFor="date-range" className="text-sm font-medium text-muted-foreground">Date Range (Placeholder)</Label>
              <Input
                id="date-range"
                type="text"
                placeholder="e.g., 2024-07-01 to 2024-07-31"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleRefresh} className="w-full sm:w-auto self-end">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <section aria-labelledby="summary-stats-title">
         <h2 id="summary-stats-title" className="sr-only">Summary Statistics</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard title="Total Pallets Moved" value={summaryStats.totalPalletsMoved} icon={Package} description="Sum of all movements" />
          <InfoCard title="Pallets Inbound" value={summaryStats.palletsInbound} icon={ArrowDownToLine} description="Received into warehouses" />
          <InfoCard title="Pallets Outbound" value={summaryStats.palletsOutbound} icon={ArrowUpFromLine} description="Shipped from warehouses" />
          <InfoCard title="Pallets In Storage (Est.)" value={summaryStats.palletsInStorage} icon={Archive} description="Estimated current storage" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <Truck className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg font-semibold text-primary">Robot Pallet Activity</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Robot Name</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Task Type</TableHead>
                    <TableHead className="text-right">Pallets</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.length > 0 ? (
                    filteredMovements.map(m => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.robotName}</TableCell>
                        <TableCell>{m.warehouseName}</TableCell>
                        <TableCell>{m.taskType}</TableCell>
                        <TableCell className="text-right">{m.palletsMoved}</TableCell>
                        <TableCell>{format(new Date(m.timestamp), 'PP pp')}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No pallet movements found for the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out">
          <CardHeader className="flex flex-row items-center space-x-2">
            <PieChartIcon className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg font-semibold text-primary">Pallet Movement by Warehouse</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[380px]">
            {pieChartData.length > 0 ? (
              <ChartContainer config={pieChartConfig} className="min-h-[300px] w-full">
                <RechartsPieChart>
                  <RechartsTooltip
                    cursor={false}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                  />
                  <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}>
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </RechartsPieChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground">No data available for chart.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6">
         <Card className="shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 ease-in-out">
           <CardHeader className="flex flex-row items-center space-x-2">
             <BarChartHorizontalBig className="h-6 w-6 text-primary" />
             <CardTitle className="text-lg font-semibold text-primary">Pallet Movement by Robot</CardTitle>
           </CardHeader>
           <CardContent className="h-[400px] pt-4">
            {robotPalletSummary.length > 0 ? (
                <ChartContainer config={barChartConfig} className="w-full h-full">
                    <BarChart accessibilityLayer data={robotPalletSummary} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            fontSize={12}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            fontSize={12}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="total" radius={4}>
                            {robotPalletSummary.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                            <LabelList dataKey="total" position="top" />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            ) : (
                <p className="text-muted-foreground flex items-center justify-center h-full">No "Loop" robots found with pallet movements for the selected filters.</p>
            )}
           </CardContent>
         </Card>
      </div>
    </div>
  );
}
