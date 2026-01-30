"use client"

import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Cell
} from 'recharts';

export function ScoreChart({ score }: { score: number }) {
    const data = [
        { subject: 'Logic', A: score, fullMark: 100 },
        { subject: 'Risk', A: 100 - (score / 2), fullMark: 100 },
        { subject: 'Emotion', A: 100 - score, fullMark: 100 },
        { subject: 'Clarity', A: score * 0.9, fullMark: 100 },
        { subject: 'History', A: score * 0.8, fullMark: 100 },
    ];

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="#222" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10 }} />
                    <Radar
                        name="Score"
                        dataKey="A"
                        stroke="#fff"
                        fill="#fff"
                        fillOpacity={0.2}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function ScenarioChart({ scenarios }: { scenarios: any }) {
    const data = [
        { name: 'Bull', value: 30, color: '#22c55e' },
        { name: 'Base', value: 50, color: '#64748b' },
        { name: 'Bear', value: 20, color: '#ef4444' },
    ];

    return (
        <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#666', fontSize: 10 }} width={40} />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #222', fontSize: '10px' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
