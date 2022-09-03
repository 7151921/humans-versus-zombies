import * as React from 'react';
import {useEffect, useState} from 'react';
import {Label, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {ModPanelH1} from "../ReportTag/ReportTagElements";

interface Burndown {
    day: string;
    remainingHumans: number;
    idealRemainingHuman: number;
}

function getModServiceCard(data) {
    const renderTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const dataKeys = payload.map((p) => p.dataKey);
            const valueFormatter = (val) => val.toFixed(0);
            const data = payload[0].payload;
            return (
                <div className="custom-tooltip">
                    <p>{data.day}</p>
                    {dataKeys.map((key) => (
                        <p key={key} style={{ color: payload.find((p) => p.dataKey === key).stroke }}>
                            {key === "idealRemainingHuman" ? "Ideal": "Actual"}: {valueFormatter(data[key])}
                        </p>
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <>
            <ModPanelH1>{data !== null && data.length > 0 ? 'Burn Down Chart' : 'No Current Game'}</ModPanelH1>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart
                    data={data}
                    margin={{
                        right: 30,
                        bottom: 10,
                    }}
                >
                    <XAxis
                        dataKey="day"
                        style={{
                            fontSize: '12px',
                        }}
                        tick={{
                            fontSize: '10px',
                        }}
                    />
                    <YAxis
                        style={{
                            fontSize: '12px',
                        }}
                        tick={{
                            fontSize: '10px',
                        }}
                    >
                        <Label
                            angle={270}
                            position="insideLeft"
                            offset={20}
                            style={{
                                textAnchor: 'middle',
                                fontSize: '14px',
                            }}
                        >
                            Humans Count
                        </Label>
                    </YAxis>
                    <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
                    <Tooltip content={renderTooltip} />
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="remainingHumans"
                        dot={false}
                        stroke="#01BF71"
                        name="Actual"
                    />
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="idealRemainingHuman"
                        stroke="#b3af56"
                        dot={false}
                        name="Ideal"
                    />
                    <ReferenceLine y={0} stroke="#666" />
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}


function calculateLinearValues(humanCount, estimatedNumberOfDays) {
    const linearValues = [];
    for (let i = 0; i < estimatedNumberOfDays; i++) {
        const linearValue = humanCount - ((humanCount) / (estimatedNumberOfDays - 1)) * i;
        linearValues.push(Math.ceil(linearValue));
    }
    linearValues[linearValues.length - 1] = 0;
    return linearValues;
}


export default function BurnDownChart({game}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (game) {
            const max_human_count = Math.max(...game.human_alive_snapshot.map(item => item.human_count));
            const linear = calculateLinearValues(max_human_count, game.est_game_length);
            const sortedData = game.human_alive_snapshot.sort((a, b) => new Date(a.time) - new Date(b.time));
            const humanCounts = sortedData.map(item => item.human_count);
            const burndownData = Array.from({ length: game.est_game_length }, (_, i) => {
                const burndown: Burndown = {
                    day: `day ${i}`,
                    remainingHumans: humanCounts[i],
                    idealRemainingHuman: linear[i]
                };
                return burndown;
            });
            setData(burndownData)
        }
    }, [game])


    return (
        <div style={{minWidth: "200px"}}>
            {getModServiceCard(data)}
        </div>
    );
}
