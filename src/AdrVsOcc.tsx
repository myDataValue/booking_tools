import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';

// Generate simulated data for demonstration
const generateData = () => {
    const propertyTypes = ['Underperforming', 'Standard', 'Outperforming'] as const;
    type PropertyType = typeof propertyTypes[number];
    const data: { propertyType: string; adr: number; conversion: number; revpar: number; hasPromotionalBadge: boolean; }[] = [];

    // Define ranges for different property types
    const ranges: Record<PropertyType, { adr: number[]; conversion: number[]; count: number }> = {
        'Underperforming': { adr: [60, 100], conversion: [0.4, 1.0], count: 15 },
        'Standard': { adr: [85, 140], conversion: [0.8, 1.5], count: 25 },
        'Outperforming': { adr: [110, 200], conversion: [1.2, 2.0], count: 10 }
    };

    // Generate random data points
    propertyTypes.forEach(propertyType => {
        const range = ranges[propertyType];

        for (let i = 0; i < range.count; i++) {
            const adr = Math.round(range.adr[0] + Math.random() * (range.adr[1] - range.adr[0]));
            const conversion = Number((range.conversion[0] + Math.random() * (range.conversion[1] - range.conversion[0])).toFixed(2));
            const hasPromotionalBadge = Math.random() > 0.5;

            // Calculate revPAR - now based on conversion rate, views, and ADR
            // Simplified formula: Net ADR * (Conversion Rate * 100 * 0.6) / 100
            // This approximates occupancy from conversion rate
            const approximateOccupancy = conversion * 50; // Convert conversion rate to occupancy percentage
            const revpar = Math.round(adr * (approximateOccupancy / 100));

            data.push({
                propertyType,
                adr,
                conversion,
                revpar,
                hasPromotionalBadge
            });
        }
    });

    return data;
};

const RevisedFigure4 = () => {
    const data = generateData();

    // Calculate RevPAR thresholds for contour lines
    const revparThresholds = [20, 40, 60, 80, 100];

    // Generate contour line data points
    const generateContourLineData = (revpar: number) => {
        const points = [];
        for (let adr = 50; adr <= 250; adr += 10) {
            // Reverse engineer conversion rate from RevPAR and ADR
            // RevPAR = ADR * (Conversion Rate * 50) / 100
            // Conversion Rate = (RevPAR * 100) / (ADR * 50)
            const conversion = (revpar * 100) / (adr * 50);

            // Only add points within a reasonable conversion rate range
            if (conversion >= 0.2 && conversion <= 3.0) {
                points.push({
                    adr,
                    conversion,
                    revpar
                });
            }
        }
        return points;
    };

    // Create contour line data for each threshold
    const contourLines = revparThresholds.map(threshold => ({
        threshold,
        points: generateContourLineData(threshold)
    }));

    // Custom tooltip to display property information
    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<any> }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border rounded shadow-lg text-sm">
                    <p className="font-semibold text-gray-800">{data.propertyType} Property</p>
                    <p className="text-gray-600">Net ADR: £{data.adr}</p>
                    <p className="text-gray-600">Conversion Rate: {data.conversion.toFixed(2)}%</p>
                    <p className="text-gray-600">RevPAR: £{data.revpar}</p>
                    <p className="text-blue-600 text-xs mt-1">
                        {data.hasPromotionalBadge ? 'Has promotional badge' : 'No promotional badge'}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-8">
            <h2 className="text-xl font-bold mb-4">Figure 4: Net ADR vs Conversion Rate (RevPAR Contours)</h2>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="adr"
                            name="Net ADR"
                            domain={[50, 250]}
                            label={{ value: 'Net ADR (£)', position: 'bottom' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="conversion"
                            name="Conversion Rate"
                            domain={[0, 2.5]}
                            label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }}
                            tickFormatter={(value) => `${value.toFixed(1)}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />

                        {/* RevPAR contour lines */}
                        {contourLines.map((contour) => (
                            <Scatter
                                key={`contour-${contour.threshold}`}
                                name={`RevPAR £${contour.threshold}`}
                                data={contour.points}
                                line={{ stroke: '#999', strokeDasharray: '5 5' }}
                                lineType="joint"
                                shape={() => <></>}
                                legendType="none"
                            />
                        ))}

                        {/* RevPAR contour labels */}
                        {contourLines.map((contour) => (
                            <ReferenceLine
                                key={`label-${contour.threshold}`}
                                isFront={true}
                                ifOverflow="extendDomain"
                                segment={[
                                    { x: 200, y: contour.points.find(p => Math.abs(p.adr - 200) < 10)?.conversion || 0.5 },
                                    { x: 210, y: contour.points.find(p => Math.abs(p.adr - 200) < 10)?.conversion || 0.5 }
                                ]}
                                stroke="transparent"
                            >
                                <Label
                                    value={`RevPAR = £${contour.threshold}`}
                                    position="right"
                                    fill="#666"
                                    fontSize={10}
                                />
                            </ReferenceLine>
                        ))}

                        {/* Data points */}
                        {['Underperforming', 'Standard', 'Outperforming'].map((type) => (
                            <Scatter
                                key={`scatter-${type}`}
                                name={`${type} Properties`}
                                data={data.filter(item => item.propertyType === type)}
                                fill={type === 'Underperforming' ? '#ef4444' :
                                    type === 'Standard' ? '#3b82f6' : '#16a34a'}
                                shape={(props: { payload?: any; cx?: any; cy?: any; fill?: any; }) => {
                                    const { cx, cy, fill } = props;
                                    const item = props.payload;
                                    const size = Math.sqrt(item.revpar) * 1.2;

                                    return (
                                        <svg>
                                            <circle
                                                cx={cx}
                                                cy={cy}
                                                r={size}
                                                fill={fill}
                                                fillOpacity={0.6}
                                                stroke={item.hasPromotionalBadge ? '#8b5cf6' : fill}
                                                strokeWidth={item.hasPromotionalBadge ? 2 : 1}
                                            />
                                            {item.hasPromotionalBadge && (
                                                <circle
                                                    cx={cx}
                                                    cy={cy}
                                                    r={2}
                                                    fill="#ffffff"
                                                />
                                            )}
                                        </svg>
                                    );
                                }}
                            />
                        ))}
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-2">
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-500 opacity-60 mr-1"></div>
                    <span className="text-sm">Underperforming</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 opacity-60 mr-1"></div>
                    <span className="text-sm">Standard</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 opacity-60 mr-1"></div>
                    <span className="text-sm">Outperforming</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-purple-500 opacity-80 mr-1"></div>
                    <span className="text-sm">With Promotional Badge</span>
                </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
                This chart illustrates the relationship between Net ADR and Conversion Rate, with RevPAR represented by both dot size and contour lines.
                Properties with promotional badges (purple outline) generally achieve higher conversion rates at comparable price points,
                leading to better RevPAR. Optimal positioning varies by property type: budget properties benefit from lower ADR with higher conversion,
                while premium properties can maximize revenue with higher ADR despite lower conversion rates.
            </p>
        </div>
    );
};

export default RevisedFigure4;