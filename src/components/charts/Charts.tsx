import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const COLORS = ['#0B4F6C', '#0ea5e9', '#f59e0b', '#ef4444', '#10b981', '#64748b']
const PRIMARY = '#0B4F6C'
const ACCENT = '#0ea5e9'

function chartTheme() {
  const isDark =
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  return {
    isDark,
    gridColor: isDark ? '#334155' : '#e2e8f0',
    textColor: isDark ? '#94a3b8' : '#64748b',
    tooltipBg: isDark ? '#1e293b' : '#fff',
  }
}

interface ChartProps {
  data: Array<Record<string, string | number>>
  height?: number
}

export function FraudTrendChart({ data, height = 250 }: ChartProps) {
  const { gridColor, textColor, tooltipBg } = chartTheme()

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.3} />
            <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
        <YAxis tick={{ fill: textColor, fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: tooltipBg,
            border: `1px solid ${gridColor}`,
            borderRadius: 8,
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={PRIMARY}
          fill="url(#fraudGrad)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="detected"
          stroke={ACCENT}
          fill="none"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function CategoryPieChart({ data, height = 250 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function MonthlyBarChart({ data, height = 250 }: ChartProps) {
  const { gridColor, textColor, tooltipBg } = chartTheme()

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
        <YAxis tick={{ fill: textColor, fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: tooltipBg,
            border: `1px solid ${gridColor}`,
            borderRadius: 8,
          }}
        />
        <Bar dataKey="approved" fill={PRIMARY} radius={[4, 4, 0, 0]} />
        <Bar dataKey="denied" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function LineTrendChart({
  data,
  dataKey = 'value',
  height = 200,
  color = PRIMARY,
}: ChartProps & { dataKey?: string; color?: string }) {
  const { gridColor, textColor, tooltipBg } = chartTheme()

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 12 }} />
        <YAxis tick={{ fill: textColor, fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: tooltipBg,
            border: `1px solid ${gridColor}`,
            borderRadius: 8,
          }}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
