"use client";

import { TimelineStep } from "@/lib/compute/types";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import { useProfilerStore } from "@/lib/store";

interface TimelineChartProps {
    data: TimelineStep[];
}

export function TimelineChart({ data }: TimelineChartProps) {
    const { currentStep, setCurrentStep } = useProfilerStore();

    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    onMouseMove={(e) => {
                        if (e && typeof e.activeTooltipIndex === 'number') {
                            setCurrentStep(e.activeTooltipIndex);
                        }
                    }}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorEntropy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDifficulty" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                    <XAxis
                        dataKey="step"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#71717a", fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#71717a", fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#18181b",
                            border: "1px solid #3f3f46",
                            borderRadius: "8px",
                            color: "#fff",
                        }}
                        itemStyle={{ color: "#fff" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="bestCutEntropy"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorEntropy)"
                        name="Max Entropy"
                    />
                    <Area
                        type="monotone"
                        dataKey="hardnessHeuristic"
                        stroke="#a855f7"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorDifficulty)"
                        name="Simulation Difficulty"
                    />

                    {/* Active step indicator */}
                    <rect
                        x={`${(currentStep / (data.length - 1)) * 100}%`}
                        y="0"
                        width="2"
                        height="100%"
                        fill="#ffffff"
                        className="pointer-events-none transition-all duration-100"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
