"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";

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
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get available years from customer data
  useEffect(() => {
    const yearsSet = new Set<number>();
    customers.forEach((customer) => {
      const date = new Date(customer.createdAt);
      yearsSet.add(date.getFullYear());
    });

    const years = Array.from(yearsSet).sort((a, b) => b - a);
    setAvailableYears(years);

    // Set to latest year if current year is not available
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[0]);
    }
  }, [customers, selectedYear]);

  // Process customer data for chart based on selected year
  const getCustomerDataByMonth = (): ChartData[] => {
    // Initialize data for all 12 months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData: ChartData[] = months.map((month) => ({
      month,
      count: 0,
    }));

    // Count customers by month for selected year
    customers.forEach((customer) => {
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

  // Theme-based chart colors
  const getChartColors = () => {
    return {
      grid: "rgba(255,255,255,0.4)",
      xAxis: "#1f4f59",
      xAxisTick: "#1f4f59",
      xAxisLine: "#ffffff",
      yAxis: "#1f4f59",
      yAxisTick: "#1f4f59",
      yAxisLine: "#ffffff",
      tooltipBg: "rgba(196, 235, 242, 0.9)",
      tooltipBorder: "#ffffff",
      tooltipLabel: "#1f4f59",
      legend: "#1f4f59",
      bar: "#d64560",
    };
  };

  const colors = getChartColors();
  const customerDataByMonth = getCustomerDataByMonth();

  if (!isMounted) {
    return (
      <div className="clay-panel mt-10 p-5">
        <div className="flex flex-col h-full w-full">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-lg font-extrabold clay-text-title">
              Customer Registration Trend
            </h3>
          </div>
          <div className="h-80 flex items-center justify-center">
            <p className="clay-text-muted font-bold">
              Loading chart...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="clay-panel mt-10 p-5">
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-row items-center justify-between pb-4 border-b border-white/50">
          <h3 className="text-lg font-extrabold clay-text-title">
            Customer Registration Trend
          </h3>
        {availableYears.length > 0 && (
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[120px] bg-white/40 border-white text-[#1f4f59] font-bold focus:ring-[#d64560] rounded-[20px] backdrop-blur-md transition-colors">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-[#aae4ee] border-white/40 rounded-[20px]">
              {availableYears.map((year) => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                  className="clay-text-title font-bold focus:bg-white/40 focus:text-[#731b31]"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="relative z-10 w-full">
        {customers.length > 0 ? (
          <div className="h-80 mt-6 min-w-0 w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={customerDataByMonth}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} opacity={0.3} />
                <XAxis
                  dataKey="month"
                  stroke={colors.xAxis}
                  tick={{ fill: colors.xAxisTick }}
                  axisLine={{ stroke: colors.xAxisLine }}
                />
                <YAxis
                  stroke={colors.yAxis}
                  tick={{ fill: colors.yAxisTick }}
                  axisLine={{ stroke: colors.yAxisLine }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: colors.tooltipBg,
                    borderColor: colors.tooltipBorder,
                    borderRadius: "20px",
                    boxShadow: "4px 4px 10px rgba(120, 190, 205, 0.5)",
                    color: "#1f4f59",
                  }}
                  itemStyle={{ color: "#d64560", fontWeight: "bold" }}
                  labelStyle={{
                    color: colors.tooltipLabel,
                    fontWeight: "bold",
                  }}
                />
                <Legend wrapperStyle={{ color: colors.legend }} />
                <Bar
                  dataKey="count"
                  name="Customers"
                  fill={colors.bar}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center mt-6">
            <p className="clay-text-muted font-bold">
              No customer data available
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
