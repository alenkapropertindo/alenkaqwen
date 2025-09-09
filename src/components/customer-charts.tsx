"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  komisi: number;
  status: string;
  paidStatus: string;
  createdAt: string | Date;
}

interface ChartData {
  month: string;
  count: number;
}

interface CustomerChartsProps {
  customers: Customer[];
}

export function CustomerCharts({ customers }: CustomerChartsProps) {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Get available years from customer data
  useEffect(() => {
    const yearsSet = new Set<number>();
    customers.forEach(customer => {
      const date = new Date(customer.createdAt);
      yearsSet.add(date.getFullYear());
    });
    
    const years = Array.from(yearsSet).sort((a, b) => b - a);
    setAvailableYears(years);
    
    // Set to latest year if current year is not available
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
  }, [customers]);

  // Process customer data for chart based on selected year
  const getCustomerDataByMonth = (): ChartData[] => {
    // Initialize data for all 12 months
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    
    const chartData: ChartData[] = months.map((month) => ({
      month,
      count: 0
    }));

    // Count customers by month for selected year
    customers.forEach(customer => {
      const date = new Date(customer.createdAt);
      if (date.getFullYear() === selectedYear) {
        const monthIndex = date.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          chartData[monthIndex].count += 1;
        }
      }
    });

    return chartData;
  };

  const customerDataByMonth = getCustomerDataByMonth();

  return (
    <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/50 rounded-lg shadow-lg shadow-purple-500/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-purple-100">Customer Registration Trend</CardTitle>
        {availableYears.length > 0 && (
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-[120px] bg-purple-900/50 border-purple-500/50 text-purple-100">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()} className="text-purple-900">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        {customers.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={customerDataByMonth}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="#a78bfa" 
                  tick={{ fill: '#c4b5fd' }}
                  axisLine={{ stroke: '#7c3aed' }}
                />
                <YAxis 
                  stroke="#a78bfa" 
                  tick={{ fill: '#c4b5fd' }}
                  axisLine={{ stroke: '#7c3aed' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(19, 9, 34, 0.9)', 
                    borderColor: '#8b5cf6',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#000' }}
                  labelStyle={{ color: '#e9d5ff', fontWeight: 'bold' }}
                />
                <Legend 
                  wrapperStyle={{ color: '#c4b5fd' }}
                />
                <Bar 
                  dataKey="count" 
                  name="Customers" 
                  fill="#a855f7" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <p className="text-purple-200/70">No customer data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}