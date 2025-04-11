import React, { useState, useEffect } from 'react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ReferenceLine, Label, ComposedChart, Area,
    Line,
} from 'recharts';

interface DataPoint {
    day: number;
    week: number;
    date: string;
    dayOfWeek: string;
    isWeekend: boolean;
    strategy: string;
    strategyDescription: string;
    isFirstDayOfWeek: boolean;
    yourRank: number;
    competitorRank: number;
    yourConversion: number;
    competitorConversion: number;
    yourADR: number;
    competitorADR: number;
    yourBookedADR: number;
    competitorBookedADR: number;
    yourListingViews: number;
    competitorListingViews: number;
    yourBookingEfficiency: number;
    competitorBookingEfficiency: number;
    holisticScore: number;
    scoreComponents: ScoreComponents;
    targetRank: number;
    targetConversion: number;
    targetADR: number;
    targetBookedADR: number;
    targetListingViews: number;
    targetBookingEfficiency: number;
    rankScore: number;
    conversionScore: number;
    adrScore: number;
    bookedAdrScore: number;
    listingViewsScore: number;
    bookingEfficiencyScore: number;
    adrDiff: number;
    rankDiff: number;
    conversionDiff: number;
    bookedAdrDiff: number;
    listingViewsDiff: number;
    bookingEfficiencyDiff: number;
    [key: string]: any;
}

interface ScoreComponents {
    rank: number;
    conversion: number;
    adr: number;
    bookedADR: number;
    listingViews: number;
    bookingEfficiency: number;
}

interface TooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

interface StrategyBackgroundProps {
    data?: DataPoint[];
    xScale: any;
    yScale?: any;
    width?: number;
    height: number;
}

const PerformanceOptimization: React.FC = () => {
    const [data, setData] = useState<DataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDetailedCharts, setShowDetailedCharts] = useState(false);

    // Define strategies at component level so they're available globally
    const strategies = [
        {
            week: 1,
            name: "Baseline",
            rankImprovement: 0,
            conversionBoost: 0,
            adrAdjustment: 0,
            viewsMultiplier: 1.0,
            efficiencyImprovement: 0,
            description: "Initial assessment"
        },
        {
            week: 2,
            name: "Price Optimization",
            rankImprovement: 3,
            conversionBoost: 0.15,
            adrAdjustment: 2,
            viewsMultiplier: 1.1,
            efficiencyImprovement: 20,
            description: "Strategic pricing"
        },
        {
            week: 3,
            name: "Promotional Campaign",
            rankImprovement: 4,
            conversionBoost: 0.25,
            adrAdjustment: -5,
            viewsMultiplier: 1.5,
            efficiencyImprovement: 40,
            description: "Deals & badges"
        },
        {
            week: 4,
            name: "Enhanced Visibility",
            rankImprovement: 6,
            conversionBoost: 0.35,
            adrAdjustment: 0,
            viewsMultiplier: 1.8,
            efficiencyImprovement: 60,
            description: "Partner status"
        },
        {
            week: 5,
            name: "Combined Strategy",
            rankImprovement: 8,
            conversionBoost: 0.5,
            adrAdjustment: 5,
            viewsMultiplier: 2.0,
            efficiencyImprovement: 75,
            description: "All optimizations"
        }
    ];

    useEffect(() => {
        // Generate data starting from March 1st
        generateSimulatedData();
    }, []);

    const generateSimulatedData = () => {
        setLoading(true);
        const simulatedData: DataPoint[] = [];

        // Base values for each metric 
        const baseADR = 110;
        const competitorBaseADR = 100;
        const baseRank = 18; // Starting at a worse position
        const competitorBaseRank = 15;
        const baseConversion = 0.9; // Starting lower
        const competitorBaseConversion = 0.9;
        const baseListingViews = 85; // Daily listing views
        const baseBookingEfficiency = 160; // Views per booking

        // Target values
        const targets = {
            rank: 7,
            conversion: 1.4,
            adr: 115,
            bookedADR: 105,
            listingViews: 150,
            bookingEfficiency: 100
        };

        // Metric weights for holistic score (total = 100)
        const weights = {
            rank: 20,        // 20% - Very important for visibility
            conversion: 25,   // 25% - Directly impacts bookings
            adr: 15,         // 15% - Impacts revenue
            bookedADR: 15,   // 15% - Actual revenue
            listingViews: 10, // 10% - Leads to bookings
            bookingEfficiency: 15 // 15% - Conversion quality
        };

        // Weekly strategy improvements - Now using component-level strategies variable

        // Generate date range starting from March 1, 2025
        const startDate = new Date(2025, 2, 1); // March 1, 2025

        for (let day = 1; day <= 35; day++) { // 5 weeks (35 days)
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + day - 1);

            const dayOfWeek = currentDate.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            // Day factor for weekends vs weekdays
            const dayFactor = isWeekend ? 1.15 : 0.92;

            // Determine which week/strategy we're in
            const weekNumber = Math.ceil(day / 7);
            const currentStrategy = strategies.find(s => s.week === weekNumber) || strategies[0];
            const isFirstDayOfWeek = day % 7 === 1 || day === 1;

            // Calculate rank with improvement from strategy
            const yourRank = Math.max(1, Math.round((baseRank - currentStrategy.rankImprovement) * 10) / 10);
            const competitorRank = competitorBaseRank;

            // Calculate conversion rate with boost from strategy
            const yourConversion = Math.round((baseConversion + currentStrategy.conversionBoost) * 100) / 100;
            const competitorConversion = baseConversion;

            // Calculate ADR with adjustment from strategy
            const yourADR = baseADR + currentStrategy.adrAdjustment;
            const competitorADR = competitorBaseADR;

            // Calculate booked ADR (after discounts)
            const discountFactor = currentStrategy.name === "Promotional Campaign" ? 0.1 : 0.02;
            const yourBookedADR = Math.round(yourADR * (1 - discountFactor));
            const competitorBookedADR = Math.round(competitorADR * 0.98);

            // Calculate listing views
            const baseViews = baseListingViews * currentStrategy.viewsMultiplier;
            // Apply weekend factor and some random variation
            const randomFactor = 0.85 + Math.random() * 0.3;
            const yourListingViews = Math.round(baseViews * dayFactor * randomFactor);
            const competitorListingViews = Math.round(baseListingViews * dayFactor * randomFactor);

            // Calculate booking efficiency (views per booking)
            const yourBookingEfficiency = Math.max(50, baseBookingEfficiency - currentStrategy.efficiencyImprovement);
            const competitorBookingEfficiency = baseBookingEfficiency;

            // Calculate normalized scores (0-100) for each metric
            // For rank: best = 1, worst = 20, target = 7
            const rankScore = Math.min(100, Math.max(0, 100 - (yourRank - 1) / (20 - 1) * 100));

            // For conversion: 0% = 0, 2% = 100, target = 1.4%
            const conversionScore = Math.min(100, Math.max(0, (yourConversion / 2) * 100));

            // For ADR: 80 = 0, 150 = 100, target = 115
            const adrScore = Math.min(100, Math.max(0, (yourADR - 80) / (150 - 80) * 100));

            // For booked ADR: 70 = 0, 140 = 100, target = 105
            const bookedAdrScore = Math.min(100, Math.max(0, (yourBookedADR - 70) / (140 - 70) * 100));

            // For listing views: 50 = 0, 200 = 100, target = 150
            const listingViewsScore = Math.min(100, Math.max(0, (yourListingViews - 50) / (200 - 50) * 100));

            // For booking efficiency: 200 = 0, 50 = 100, target = 100 (lower is better)
            const bookingEfficiencyScore = Math.min(100, Math.max(0, (200 - yourBookingEfficiency) / (200 - 50) * 100));

            // Calculate weighted holistic score
            const holisticScore = Math.round(
                (rankScore * weights.rank +
                    conversionScore * weights.conversion +
                    adrScore * weights.adr +
                    bookedAdrScore * weights.bookedADR +
                    listingViewsScore * weights.listingViews +
                    bookingEfficiencyScore * weights.bookingEfficiency) / 100
            );

            // Calculate individual component percentages of the total score
            const scoreComponents = {
                rank: Math.round((rankScore * weights.rank) / 100),
                conversion: Math.round((conversionScore * weights.conversion) / 100),
                adr: Math.round((adrScore * weights.adr) / 100),
                bookedADR: Math.round((bookedAdrScore * weights.bookedADR) / 100),
                listingViews: Math.round((listingViewsScore * weights.listingViews) / 100),
                bookingEfficiency: Math.round((bookingEfficiencyScore * weights.bookingEfficiency) / 100)
            };

            // Add to simulation data
            simulatedData.push({
                day,
                week: weekNumber,
                date: currentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
                dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
                isWeekend,
                strategy: currentStrategy.name,
                strategyDescription: currentStrategy.description,
                isFirstDayOfWeek,

                // Metrics
                yourRank,
                competitorRank,
                yourConversion,
                competitorConversion,
                yourADR,
                competitorADR,
                yourBookedADR,
                competitorBookedADR,
                yourListingViews,
                competitorListingViews,
                yourBookingEfficiency,
                competitorBookingEfficiency,

                // Target values
                targetRank: targets.rank,
                targetConversion: targets.conversion,
                targetADR: targets.adr,
                targetBookedADR: targets.bookedADR,
                targetListingViews: targets.listingViews,
                targetBookingEfficiency: targets.bookingEfficiency,

                // Normalized scores
                rankScore,
                conversionScore,
                adrScore,
                bookedAdrScore,
                listingViewsScore,
                bookingEfficiencyScore,

                // Holistic score
                holisticScore,
                scoreComponents,

                // Differences (for analytics)
                adrDiff: yourADR - competitorADR,
                rankDiff: competitorRank - yourRank, // Reversed so positive is better
                conversionDiff: yourConversion - competitorConversion,
                bookedAdrDiff: yourBookedADR - competitorBookedADR,
                listingViewsDiff: yourListingViews - competitorListingViews,
                bookingEfficiencyDiff: competitorBookingEfficiency - yourBookingEfficiency, // Reversed so positive is better
            });
        }

        setData(simulatedData);
        setLoading(false);
    };

    const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const dayData = payload[0].payload;

            return (
                <div className="bg-white p-3 border rounded shadow-lg text-sm">
                    <p className="font-semibold">{dayData.date} ({dayData.dayOfWeek})</p>
                    <div className="bg-blue-50 p-1 rounded text-xs mb-2">
                        <span className="font-semibold">Strategy:</span> {dayData.strategy}
                        <br />
                        <span className="text-gray-600">{dayData.strategyDescription}</span>
                    </div>
                    <div className="font-medium text-base">Overall Score: {dayData.holisticScore}/100</div>
                    <div className="mt-2 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                            <span>Rank:</span>
                            <span className="font-medium">#{dayData.yourRank} ({dayData.rankScore}%)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span>Conversion:</span>
                            <span className="font-medium">{dayData.yourConversion}% ({dayData.conversionScore}%)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span>ADR:</span>
                            <span className="font-medium">£{dayData.yourADR} ({dayData.adrScore}%)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span>Booked ADR:</span>
                            <span className="font-medium">£{dayData.yourBookedADR} ({dayData.bookedAdrScore}%)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span>Listing Views:</span>
                            <span className="font-medium">{dayData.yourListingViews} ({dayData.listingViewsScore}%)</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span>Booking Efficiency:</span>
                            <span className="font-medium">{dayData.yourBookingEfficiency} ({dayData.bookingEfficiencyScore}%)</span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Holistic score tooltip
    const ScoreBreakdownTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const dayData = payload[0].payload;
            const components = dayData.scoreComponents;

            return (
                <div className="bg-white p-3 border rounded shadow-lg text-sm">
                    <p className="font-semibold">{dayData.date} ({dayData.dayOfWeek})</p>
                    <div className="bg-blue-50 p-1 rounded text-xs mb-2">
                        <span className="font-semibold">Strategy:</span> {dayData.strategy}
                    </div>
                    <div className="font-medium text-base mb-2">Overall Score: {dayData.holisticScore}/100</div>
                    <div className="flex justify-between items-center text-xs font-medium mb-1">
                        <span>Score Breakdown:</span>
                        <span className="text-gray-500">Δ = vs competitor</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                            <span>Rank (20%):</span>
                            <div>
                                <span className="font-medium">{components.rank} pts</span>
                                <span className={`ml-2 ${dayData.rankDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    Δ {dayData.rankDiff > 0 ? '+' : ''}{dayData.rankDiff.toFixed(1)}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span>Conversion (25%):</span>
                            <div>
                                <span className="font-medium">{components.conversion} pts</span>
                                <span className={`ml-2 ${dayData.conversionDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    Δ {dayData.conversionDiff > 0 ? '+' : ''}{dayData.conversionDiff.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span>ADR (15%):</span>
                            <div>
                                <span className="font-medium">{components.adr} pts</span>
                                <span className={`ml-2 ${dayData.adrDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    Δ {dayData.adrDiff > 0 ? '+' : '-'}£{Math.abs(dayData.adrDiff).toFixed(1)}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span>Booked ADR (15%):</span>
                            <div>
                                <span className="font-medium">{components.bookedADR} pts</span>
                                <span className={`ml-2 ${dayData.bookedAdrDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    Δ {dayData.bookedAdrDiff > 0 ? '+' : '-'}£{Math.abs(dayData.bookedAdrDiff).toFixed(1)}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span>Listing Views (10%):</span>
                            <div>
                                <span className="font-medium">{components.listingViews} pts</span>
                                <span className={`ml-2 ${dayData.listingViewsDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    Δ {dayData.listingViewsDiff > 0 ? '+' : ''}{dayData.listingViewsDiff}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span>Booking Efficiency (15%):</span>
                            <div>
                                <span className="font-medium">{components.bookingEfficiency} pts</span>
                                <span className={`ml-2 ${dayData.bookingEfficiencyDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    Δ {dayData.bookingEfficiencyDiff > 0 ? '+' : ''}{dayData.bookingEfficiencyDiff.toFixed(0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Custom strategy transition and background
    const StrategyBackground: React.FC<StrategyBackgroundProps> = ({ data, xScale, height }) => {
        if (!data || data.length === 0) return null;

        // Group days by week
        const weeks: { [key: number]: { week: number, strategy: string, description: string, days: DataPoint[] } } = {};
        data.forEach(day => {
            if (!weeks[day.week]) {
                weeks[day.week] = {
                    week: day.week,
                    strategy: day.strategy,
                    description: day.strategyDescription,
                    days: []
                };
            }
            weeks[day.week].days.push(day);
        });

        // Define colors for each strategy
        const weekColors: { [key: number]: string } = {
            1: "rgba(241, 245, 249, 0.5)", // slate-100 - Baseline
            2: "rgba(239, 246, 255, 0.5)", // blue-50 - Price Optimization
            3: "rgba(255, 247, 237, 0.5)", // orange-50 - Promotional Campaign
            4: "rgba(240, 253, 244, 0.5)", // green-50 - Enhanced Visibility
            5: "rgba(236, 253, 245, 0.5)", // emerald-50 - Combined Strategy
        };

        return (
            <>
                {/* Week background zones */}
                {Object.values(weeks).map((weekData) => {
                    if (weekData.days.length === 0) return null;

                    const firstDay = weekData.days[0];
                    const lastDay = weekData.days[weekData.days.length - 1];

                    const x1 = xScale(firstDay.date);
                    const x2 = xScale(lastDay.date) + xScale.bandwidth();

                    return (
                        <rect
                            key={`week-${weekData.week}`}
                            x={x1}
                            y={0}
                            width={x2 - x1}
                            height={height}
                            fill={weekColors[weekData.week]}
                            fillOpacity={0.7}
                        />
                    );
                })}

                {/* Strategy labels at top of chart */}
                {Object.values(weeks).map((weekData) => {
                    if (weekData.days.length === 0) return null;

                    const firstDay = weekData.days[0];
                    const middleDay = weekData.days[Math.floor(weekData.days.length / 2)];

                    const x = xScale(middleDay.date) + xScale.bandwidth() / 2;

                    return (
                        <foreignObject
                            key={`label-${weekData.week}`}
                            x={x - 75}
                            y={5}
                            width={150}
                            height={40}
                        >
                            <div
                                className={`text-xs font-medium px-1 py-0.5 rounded text-center mx-auto ${weekData.week === 3 ? 'bg-orange-100 text-orange-800' :
                                        weekData.week === 5 ? 'bg-emerald-100 text-emerald-800' :
                                            weekData.week === 4 ? 'bg-green-100 text-green-800' :
                                                weekData.week === 2 ? 'bg-blue-100 text-blue-800' :
                                                    'bg-slate-100 text-slate-800'
                                    }`}
                            >
                                Week {weekData.week}: {weekData.strategy}
                            </div>
                        </foreignObject>
                    );
                })}

                {/* Strategy transitions */}
                {Object.values(weeks).map((weekData, index) => {
                    if (index === 0 || weekData.days.length === 0) return null;

                    const firstDay = weekData.days[0];
                    const x = xScale(firstDay.date);

                    return (
                        <line
                            key={`transition-${weekData.week}`}
                            x1={x}
                            y1={0}
                            x2={x}
                            y2={height}
                            stroke="#4f46e5"
                            strokeWidth={2}
                            strokeDasharray="4 2"
                        />
                    );
                })}
            </>
        );
    };

    // The holistic score chart
    const renderHolisticScoreChart = () => {
        if (loading || !data || data.length === 0) {
            return (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <p className="text-gray-500">Loading data...</p>
                </div>
            );
        }

        // Get score improvements by week
        const weeklyScores: { [key: number]: number[] } = {};
        data.forEach(day => {
            if (!weeklyScores[day.week]) {
                weeklyScores[day.week] = [];
            }
            weeklyScores[day.week].push(day.holisticScore);
        });

        const weeklyAverageScores = Object.entries(weeklyScores).map(([week, scores]) => ({
            week: parseInt(week),
            averageScore: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
        }));

        const firstDayScore = data[0].holisticScore;
        const lastDayScore = data[data.length - 1].holisticScore;
        const scoreImprovement = lastDayScore - firstDayScore;
        const improvementPercentage = Math.round((scoreImprovement / firstDayScore) * 100);

        // Color based on score
        const getScoreColor = (score: number) => {
            if (score >= 85) return "#16a34a"; // Green
            if (score >= 70) return "#84cc16"; // Lime
            if (score >= 50) return "#f59e0b"; // Amber
            if (score >= 30) return "#f97316"; // Orange
            return "#ef4444"; // Red
        };

        // Current score color
        const currentScoreColor = getScoreColor(lastDayScore);

        // Find when specific promotions were applied
        const promotionHighlights = [
            {
                week: 2,
                name: "Price Optimization",
                impact: "+" + (weeklyAverageScores[1].averageScore - weeklyAverageScores[0].averageScore) + " pts",
                color: "#93c5fd" // blue-300
            },
            {
                week: 3,
                name: "Promotional Campaign",
                impact: "+" + (weeklyAverageScores[2].averageScore - weeklyAverageScores[1].averageScore) + " pts",
                color: "#fdba74" // orange-300
            },
            {
                week: 4,
                name: "Enhanced Visibility",
                impact: "+" + (weeklyAverageScores[3].averageScore - weeklyAverageScores[2].averageScore) + " pts",
                color: "#86efac" // green-300
            },
            {
                week: 5,
                name: "Combined Strategy",
                impact: "+" + (weeklyAverageScores[4].averageScore - weeklyAverageScores[3].averageScore) + " pts",
                color: "#6ee7b7" // emerald-300
            }
        ];

        return (
            <div className="bg-white p-4 rounded shadow-md">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-xl">Booking.com Property Performance Score</h3>
                    <div className="flex items-center">
                        <span className="text-sm mr-2">Show detailed metrics:</span>
                        <button
                            onClick={() => setShowDetailedCharts(!showDetailedCharts)}
                            className={`px-3 py-1 rounded ${showDetailedCharts ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            {showDetailedCharts ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="flex flex-col items-center justify-center bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Initial Score</div>
                        <div className="text-2xl font-bold" style={{ color: getScoreColor(firstDayScore) }}>{firstDayScore}</div>
                        <div className="text-xs">Week 1: Baseline</div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Current Score</div>
                        <div className="text-3xl font-bold" style={{ color: currentScoreColor }}>{lastDayScore}</div>
                        <div className="text-xs">Week 5: Combined Strategy</div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Improvement</div>
                        <div className="text-2xl font-bold text-green-600">+{scoreImprovement} points</div>
                        <div className="text-xs text-green-600">+{improvementPercentage}%</div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-gray-50 p-3 rounded relative">
                        <div className="text-sm text-gray-600 mb-1">Performance Rating</div>
                        <div className="text-xl font-bold" style={{ color: currentScoreColor }}>
                            {lastDayScore >= 85 ? "Excellent" :
                                lastDayScore >= 70 ? "Good" :
                                    lastDayScore >= 50 ? "Average" :
                                        lastDayScore >= 30 ? "Needs Improvement" :
                                            "Poor"}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div
                                className="h-2.5 rounded-full"
                                style={{ width: `${lastDayScore}%`, backgroundColor: currentScoreColor }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                                data={data}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    interval={4}
                                    angle={0}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    domain={[0, 100]}
                                    label={{
                                        value: "Overall Performance Score",
                                        angle: -90,
                                        position: 'insideLeft',
                                        style: { textAnchor: 'middle', fontSize: 12 },
                                        offset: -10
                                    }}
                                />
                                <Tooltip content={<ScoreBreakdownTooltip />} />
                                <Legend />

                                {/* Background showing weekly strategies */}
                                <StrategyBackground height={0} xScale={undefined} />

                                {/* Highlight the promotion points */}
                                {promotionHighlights.map((highlight, index) => {
                                    const dayWithChange = data.find(d => d.week === highlight.week && d.isFirstDayOfWeek);
                                    if (!dayWithChange) return null;

                                    return (
                                        <ReferenceLine
                                            key={`highlight-${index}`}
                                            x={dayWithChange.date}
                                            stroke={highlight.color}
                                            strokeWidth={3}
                                        >
                                            <Label
                                                value={`${highlight.name}: ${highlight.impact}`}
                                                position="insideTopRight"
                                                fill="#374151"
                                                fontSize={11}
                                            />
                                        </ReferenceLine>
                                    );
                                })}

                                <Area
                                    type="monotone"
                                    dataKey="holisticScore"
                                    name="Performance Score"
                                    stroke="#3483eb"
                                    fill="#3483eb"
                                    fillOpacity={0.2}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 6 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="p-3 bg-gray-50 rounded">
                        <h4 className="font-semibold mb-3">Weekly Average Scores</h4>
                        <div className="space-y-3">
                            {weeklyAverageScores.map(week => (
                                <div key={week.week} className="flex flex-col">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm">
                                            Week {week.week}: {strategies.find(s => s.week === week.week)?.name}
                                        </span>
                                        <span className="font-medium" style={{ color: getScoreColor(week.averageScore) }}>
                                            {week.averageScore}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full"
                                            style={{
                                                width: `${week.averageScore}%`,
                                                backgroundColor: getScoreColor(week.averageScore)
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Strategy Impact Summary</h4>
                            <div className="text-sm space-y-2">
                                {promotionHighlights.map((highlight, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: highlight.color }}></div>
                                        <span>{highlight.name}: <span className="text-green-600 font-medium">{highlight.impact}</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    <p className="font-medium">Performance Score Interpretation:</p>
                    <p className="text-xs mt-1">
                        The holistic performance score combines all six key metrics into a single 0-100 value,
                        weighted by their importance to overall property success. This makes it easy to see
                        if your strategy changes are having a positive impact.
                    </p>
                    <div className="mt-2 flex justify-between text-xs">
                        <span className="px-2 py-1 rounded bg-red-100 text-red-800">0-30: Poor</span>
                        <span className="px-2 py-1 rounded bg-orange-100 text-orange-800">30-50: Needs Improvement</span>
                        <span className="px-2 py-1 rounded bg-amber-100 text-amber-800">50-70: Average</span>
                        <span className="px-2 py-1 rounded bg-lime-100 text-lime-800">70-85: Good</span>
                        <span className="px-2 py-1 rounded bg-green-100 text-green-800">85-100: Excellent</span>
                    </div>
                </div>
            </div>
        );
    };

    // Render strategy summary
    const renderStrategyLegend = () => {
        return (
            <div className="bg-white p-4 rounded shadow-md">
                <h3 className="font-bold text-lg mb-3">Weekly Strategy Implementation</h3>
                <div className="grid grid-cols-5 gap-2">
                    {strategies.map((strategy, index) => (
                        <div key={index} className="border rounded p-3">
                            <div className="font-semibold">Week {strategy.week}</div>
                            <div className="text-blue-700">{strategy.name}</div>
                            <div className="text-gray-600 text-sm">{strategy.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render detailed charts for each metric
    const renderDetailedCharts = () => {
        if (loading || !data || data.length === 0) {
            return null;
        }

        if (!showDetailedCharts) {
            return (
                <div
                    className="mt-4 bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center cursor-pointer"
                    onClick={() => setShowDetailedCharts(true)}
                >
                    <h3 className="text-lg font-medium text-gray-700">Click to Show Detailed Metric Charts</h3>
                    <p className="text-gray-500 text-sm mt-1">
                        View detailed charts for Search Rank, Conversion Rate, ADR, Listing Views, and more
                    </p>
                </div>
            );
        }

        // Target values
        const targets = {
            rank: 7,
            conversion: 1.4,
            adr: 115,
            bookedADR: 105,
            listingViews: 150,
            bookingEfficiency: 100
        };

        // Chart configurations
        const charts = [
            {
                id: 'rank',
                title: 'Search Rank Position',
                yourKey: 'yourRank',
                competitorKey: 'competitorRank',
                yourColor: '#3483eb',
                competitorColor: '#8884d8',
                target: targets.rank,
                yLabel: 'Position (#)',
                targetLabel: `Target: #${targets.rank}`,
                isLowerBetter: true
            },
            {
                id: 'conversion',
                title: 'Conversion Rate (%)',
                yourKey: 'yourConversion',
                competitorKey: 'competitorConversion',
                yourColor: '#16a34a',
                competitorColor: '#8884d8',
                target: targets.conversion,
                yLabel: 'Rate (%)',
                targetLabel: `Target: ${targets.conversion}%`
            },
            {
                id: 'adr',
                title: 'Average Daily Rate (ADR)',
                yourKey: 'yourADR',
                competitorKey: 'competitorADR',
                yourColor: '#f59e0b',
                competitorColor: '#8884d8',
                target: targets.adr,
                yLabel: 'Price (£)',
                targetLabel: `Target: £${targets.adr}`
            },
            {
                id: 'bookedADR',
                title: 'Booked ADR (After Discounts)',
                yourKey: 'yourBookedADR',
                competitorKey: 'competitorBookedADR',
                yourColor: '#ef4444',
                competitorColor: '#8884d8',
                target: targets.bookedADR,
                yLabel: 'Price (£)',
                targetLabel: `Target: £${targets.bookedADR}`
            },
            {
                id: 'listingViews',
                title: 'Daily Listing Views',
                yourKey: 'yourListingViews',
                competitorKey: 'competitorListingViews',
                yourColor: '#8b5cf6',
                competitorColor: '#8884d8',
                target: targets.listingViews,
                yLabel: 'Views per Day',
                targetLabel: `Target: ${targets.listingViews} views`,
                useArea: true
            },
            {
                id: 'bookingEfficiency',
                title: 'Booking Efficiency (Views per Booking)',
                yourKey: 'yourBookingEfficiency',
                competitorKey: 'competitorBookingEfficiency',
                yourColor: '#0891b2',
                competitorColor: '#8884d8',
                target: targets.bookingEfficiency,
                yLabel: 'Views/Booking',
                targetLabel: `Target: ${targets.bookingEfficiency} views`,
                isLowerBetter: true
            }
        ];

        // Check which targets are reached by the end
        const lastDay = data[data.length - 1];
        const targetsMet = {
            rank: lastDay.yourRank <= targets.rank,
            conversion: lastDay.yourConversion >= targets.conversion,
            adr: lastDay.yourADR >= targets.adr,
            bookedADR: lastDay.yourBookedADR >= targets.bookedADR,
            listingViews: lastDay.yourListingViews >= targets.listingViews,
            bookingEfficiency: lastDay.yourBookingEfficiency <= targets.bookingEfficiency
        };

        // Check which week each target was first met
        const targetFirstMetWeeks = {
            rank: data.find(d => d.yourRank <= targets.rank)?.week,
            conversion: data.find(d => d.yourConversion >= targets.conversion)?.week,
            adr: data.find(d => d.yourADR >= targets.adr)?.week,
            bookedADR: data.find(d => d.yourBookedADR >= targets.bookedADR)?.week,
            listingViews: data.find(d => d.yourListingViews >= targets.listingViews)?.week,
            bookingEfficiency: data.find(d => d.yourBookingEfficiency <= targets.bookingEfficiency)?.week
        };

        return (
            <div className="space-y-6 mt-6">
                <h3 className="font-bold text-xl">Detailed Performance Metrics</h3>
                {charts.map(chart => {
                    // Get domain based on data
                    let yDomain;
                    if (chart.id === 'rank') {
                        const maxRank = Math.max(...data.map(d => Math.max(d[chart.yourKey], d[chart.competitorKey])));
                        yDomain = [0, Math.ceil(maxRank * 1.2)];
                    } else if (chart.id === 'listingViews') {
                        const maxViews = Math.max(...data.map(d => Math.max(d[chart.yourKey], d[chart.competitorKey])));
                        yDomain = [0, Math.ceil(maxViews * 1.1)];
                    } else if (chart.id === 'bookingEfficiency') {
                        const maxEfficiency = Math.max(...data.map(d => Math.max(d[chart.yourKey], d[chart.competitorKey])));
                        const minEfficiency = Math.min(...data.map(d => Math.min(d[chart.yourKey], d[chart.competitorKey])));
                        yDomain = [Math.max(0, Math.floor(minEfficiency * 0.9)), Math.ceil(maxEfficiency * 1.1)];
                    }

                    // Find first day target was met
                    const firstDayTargetMet = data.find(d =>
                        chart.isLowerBetter
                            ? d[chart.yourKey] <= chart.target
                            : d[chart.yourKey] >= chart.target
                    );

                    // Find when specific promotions affected this metric
                    const metricImpacts = [];
                    for (let i = 2; i <= 5; i++) {
                        const prevWeekData = data.filter(d => d.week === i - 1);
                        const currWeekData = data.filter(d => d.week === i);

                        if (prevWeekData.length && currWeekData.length) {
                            const prevAvg = prevWeekData.reduce((sum, d) => sum + d[chart.yourKey], 0) / prevWeekData.length;
                            const currAvg = currWeekData.reduce((sum, d) => sum + d[chart.yourKey], 0) / currWeekData.length;

                            let impact;
                            if (chart.isLowerBetter) {
                                impact = prevAvg - currAvg; // For rank and efficiency, lower is better
                            } else {
                                impact = currAvg - prevAvg;
                            }

                            // Format the impact value based on metric type
                            let formattedImpact;
                            if (chart.id === 'rank') {
                                formattedImpact = impact > 0 ? `+${impact.toFixed(1)} positions` : `${impact.toFixed(1)} positions`;
                            } else if (chart.id === 'conversion') {
                                formattedImpact = impact > 0 ? `+${impact.toFixed(2)}%` : `${impact.toFixed(2)}%`;
                            } else if (chart.id === 'adr' || chart.id === 'bookedADR') {
                                formattedImpact = impact > 0 ? `+£${impact.toFixed(1)}` : `-£${Math.abs(impact).toFixed(1)}`;
                            } else if (chart.id === 'listingViews') {
                                formattedImpact = impact > 0 ? `+${Math.round(impact)} views` : `${Math.round(impact)} views`;
                            } else {
                                formattedImpact = impact > 0 ? `+${Math.round(impact)}` : `${Math.round(impact)}`;
                            }

                            const strategy = strategies.find(s => s.week === i);
                            if (strategy) {
                                metricImpacts.push({
                                    week: i,
                                    strategy: strategy.name,
                                    impact: formattedImpact,
                                    color: i === 2 ? "#93c5fd" : i === 3 ? "#fdba74" : i === 4 ? "#86efac" : "#6ee7b7" // Blue, orange, green, emerald
                                });
                            }
                        }
                    }

                    return (
                        <div key={chart.id} className="bg-white p-4 rounded shadow-md">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-lg">{chart.title}</h3>
                                {targetsMet[chart.id as keyof typeof targetsMet] && (
                                    <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                        Target met in Week {targetFirstMetWeeks[chart.id as keyof typeof targetFirstMetWeeks]}
                                    </span>
                                )}
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart
                                        data={data}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="date"
                                            interval={4}
                                            angle={0}
                                            tick={{ fontSize: 12 }}
                                        />
                                        <YAxis
                                            domain={yDomain}
                                            label={{
                                                value: chart.yLabel,
                                                angle: -90,
                                                position: 'insideLeft',
                                                style: { textAnchor: 'middle', fontSize: 12 },
                                                offset: -10
                                            }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend wrapperStyle={{ paddingTop: "10px" }} />

                                        {/* Strategy backgrounds */}
                                        <StrategyBackground height={0} xScale={undefined} />

                                        {/* Target line */}
                                        <ReferenceLine
                                            y={chart.target}
                                            stroke="#16a34a"
                                            strokeDasharray="3 3"
                                            label={{
                                                value: chart.targetLabel,
                                                position: 'insideBottomRight',
                                                fill: '#16a34a',
                                                fontSize: 12
                                            }}
                                        />

                                        {/* First target achievement marker */}
                                        {firstDayTargetMet && (
                                            <ReferenceLine
                                                x={firstDayTargetMet.date}
                                                stroke="#16a34a"
                                                strokeWidth={1}
                                            />
                                        )}

                                        {/* Strategy impact labels */}
                                        {metricImpacts.map((impact, index) => {
                                            const dayWithChange = data.find(d => d.week === impact.week && d.isFirstDayOfWeek);
                                            if (!dayWithChange) return null;

                                            return (
                                                <ReferenceLine
                                                    key={`impact-${index}`}
                                                    x={dayWithChange.date}
                                                    stroke={impact.color}
                                                    strokeWidth={2}
                                                >
                                                    <Label
                                                        value={`${impact.strategy}: ${impact.impact}`}
                                                        position="insideTopRight"
                                                        fill="#374151"
                                                        fontSize={11}
                                                    />
                                                </ReferenceLine>
                                            );
                                        })}

                                        {/* Competitor metric line */}
                                        <Line
                                            type="monotone"
                                            dataKey={chart.competitorKey}
                                            name="Competitor"
                                            stroke={chart.competitorColor}
                                            strokeWidth={1.5}
                                            dot={{ r: 1 }}
                                            activeDot={{ r: 3 }}
                                            strokeDasharray="4 2"
                                        />

                                        {/* Your metric line/area */}
                                        {chart.useArea ? (
                                            <Area
                                                type="monotone"
                                                dataKey={chart.yourKey}
                                                name="Your Property"
                                                stroke={chart.yourColor}
                                                fill={chart.yourColor}
                                                fillOpacity={0.2}
                                                strokeWidth={2}
                                                dot={{ r: 2 }}
                                                activeDot={{ r: 4 }}
                                            />
                                        ) : (
                                            <Line
                                                type="monotone"
                                                dataKey={chart.yourKey}
                                                name="Your Property"
                                                stroke={chart.yourColor}
                                                strokeWidth={2}
                                                dot={{ r: 2 }}
                                                activeDot={{ r: 4 }}
                                            />
                                        )}
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-1 text-center">
                Booking.com Performance Optimization
            </h2>
            <p className="text-sm text-center text-gray-600 mb-4">
                5-Week Strategy Progression from March 1, 2025
            </p>

            {/* Strategy legend */}
            {renderStrategyLegend()}

            {/* Holistic score chart */}
            <div className="mt-4">
                {renderHolisticScoreChart()}
            </div>

            {/* Detailed charts (toggled) */}
            {renderDetailedCharts()}

            <div className="text-center text-sm text-gray-600 mt-6 bg-white p-3 rounded shadow-md">
                <p className="font-medium">About This Dashboard:</p>
                <p className="text-xs mt-1">
                    This dashboard shows how your property's overall performance score improves as different weekly strategies are implemented.
                    The score combines six key metrics (weighted by importance) to give you a single value that represents your property's health.
                </p>
                <p className="text-xs mt-1">
                    Use the "Show Detailed Metrics" button to view individual performance charts for all six metrics.
                </p>
            </div>
        </div>
    );
};

export default PerformanceOptimization;