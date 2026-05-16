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
    if (theme === "dark") {
      return {
        grid: "#4c1d95",
        xAxis: "#ffffff",
        xAxisTick: "#ffffff",
        xAxisLine: "#7c3aed",
        yAxis: "#ffffff",
        yAxisTick: "#ffffff",
        yAxisLine: "#7c3aed",
        tooltipBg: "rgba(19, 9, 34, 0.9)",
        tooltipBorder: "#8b5cf6",
        tooltipLabel: "#e9d5ff",
        legend: "#ffffff",
        bar: "#a855f7",
      };
    } else {
      return {
        grid: "#e0e7ff",
        xAxis: "#6366f1",
        xAxisTick: "#4f46e5",
        xAxisLine: "#818cf8",
        yAxis: "#6366f1",
        yAxisTick: "#4f46e5",
        yAxisLine: "#818cf8",
        tooltipBg: "rgba(255, 255, 255, 0.9)",
        tooltipBorder: "#c7d2fe",
        tooltipLabel: "#4338ca",
        legend: "#4f46e5",
        bar: "#818cf8",
      };
    }
  };

  const colors = getChartColors();
  const customerDataByMonth = getCustomerDataByMonth();

  if (!isMounted) {
    return (
      <div className="relative overflow-hidden rounded-2xl p-[2px] z-0 shadow-2xl">
        <div className="relative z-10 h-full w-full bg-[#0d041a] rounded-[14px] p-5">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-lg font-bold text-gray-200">
              Customer Registration Trend
            </h3>
          </div>
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500 font-medium">
              Loading chart...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl p-[2px] z-0 shadow-2xl mt-10">
      <div className="absolute top-1/2 left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_60%,#fde047_75%,#ec4899_90%,#a855f7_100%)] opacity-90" />
      
      <div className="relative z-10 flex flex-col h-full w-full bg-[#0d041a] rounded-[14px] p-5">
        <div className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
          <h3 className="text-lg font-bold text-gray-200">
            Customer Registration Trend
          </h3>
        {availableYears.length > 0 && (
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[120px] bg-purple-900/40 border-purple-500/50 text-purple-100 focus:ring-fuchsia-500 focus:border-fuchsia-500 rounded-xl backdrop-blur-md hover:bg-purple-800/50 transition-colors">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-[#1e0a3c] border-purple-500/50">
              {availableYears.map((year) => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                  className="text-purple-200 focus:bg-fuchsia-600/40 focus:text-white"
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
          <div className="h-80 mt-6 min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)",
                    color: theme === "dark" ? "#fff" : "#000",
                  }}
                  itemStyle={{ color: theme === "dark" ? "#000" : "#000" }}
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
            <p className="text-purple-300/70 font-medium">
              No customer data available
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
