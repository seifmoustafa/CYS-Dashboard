import React, { useState } from 'react';
import { Shield, AlertTriangle, TrendingUp, FileText, Calendar, Users, CheckCircle, XCircle, BarChart3, PieChart, Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data for the dashboard
const mockData = {
  controlSafeguard: {
    total: 247,
    active: 189,
    inactive: 58,
    critical: 12,
    trends: [65, 78, 82, 91, 89, 95, 88, 92],
    monthlyData: [
      { month: 'Jan', activeControls: 165, criticalIssues: 18 },
      { month: 'Feb', activeControls: 172, criticalIssues: 15 },
      { month: 'Mar', activeControls: 178, criticalIssues: 12 },
      { month: 'Apr', activeControls: 185, criticalIssues: 14 },
      { month: 'May', activeControls: 182, criticalIssues: 16 },
      { month: 'Jun', activeControls: 189, criticalIssues: 12 },
      { month: 'Jul', activeControls: 186, criticalIssues: 15 },
      { month: 'Aug', activeControls: 189, criticalIssues: 12 }
    ]
  },
  siteAssessment: {
    total: 156,
    completed: 142,
    pending: 14,
    overdue: 3,
    averageScore: 8.7,
    scoreDistribution: [
      { name: 'Excellent (9-10)', value: 45, color: '#10B981' },
      { name: 'Good (7-8)', value: 67, color: '#3B82F6' },
      { name: 'Fair (5-6)', value: 28, color: '#F59E0B' },
      { name: 'Poor (3-4)', value: 12, color: '#EF4444' },
      { name: 'Critical (0-2)', value: 4, color: '#7C2D12' }
    ],
    monthlyProgress: [
      { month: 'Jan', completed: 22 },
      { month: 'Feb', completed: 28 },
      { month: 'Mar', completed: 25 },
      { month: 'Apr', completed: 32 },
      { month: 'May', completed: 29 },
      { month: 'Jun', completed: 35 }
    ]
  },
  siteRiskForAUnit: [
    { date: '2024-01-01', riskLevel: 4.2 },
    { date: '2024-01-15', riskLevel: 3.8 },
    { date: '2024-02-01', riskLevel: 5.1 },
    { date: '2024-02-15', riskLevel: 4.7 },
    { date: '2024-03-01', riskLevel: 3.9 },
    { date: '2024-03-15', riskLevel: 4.4 },
    { date: '2024-04-01', riskLevel: 3.2 },
    { date: '2024-04-15', riskLevel: 2.8 }
  ],
  lastRiskAssessmentForSites: [
    { site: 'Site Alpha', lastAssessment: '2024-03-15', riskLevel: 'Medium', score: 6.2, color: '#F59E0B' },
    { site: 'Site Beta', lastAssessment: '2024-03-20', riskLevel: 'Low', score: 3.4, color: '#10B981' },
    { site: 'Site Gamma', lastAssessment: '2024-03-10', riskLevel: 'High', score: 8.1, color: '#EF4444' },
    { site: 'Site Delta', lastAssessment: '2024-03-25', riskLevel: 'Low', score: 2.9, color: '#10B981' },
    { site: 'Site Epsilon', lastAssessment: '2024-03-18', riskLevel: 'Medium', score: 5.7, color: '#F59E0B' },
    { site: 'Site Zeta', lastAssessment: '2024-03-22', riskLevel: 'High', score: 7.8, color: '#EF4444' },
    { site: 'Site Eta', lastAssessment: '2024-03-12', riskLevel: 'Low', score: 2.1, color: '#10B981' }
  ]
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p style={{ color: payload[0].color }} className="text-sm">
            {`Count: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const MiniChart = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="flex items-end space-x-1 h-12">
        {data.map((value, index) => (
          <div
            key={index}
            className={`${color} rounded-sm transition-all duration-300 hover:opacity-80`}
            style={{
              height: `${((value - min) / range) * 100}%`,
              minHeight: '8px',
              width: '6px'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Risk Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">Real-time monitoring and insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Control Safeguard Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <MiniChart data={mockData.controlSafeguard.trends} color="bg-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Control Safeguard</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">{mockData.controlSafeguard.total}</span>
                <span className="text-sm text-green-600 font-medium">+12% ↗</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active: {mockData.controlSafeguard.active}</span>
                <span className="text-red-600">Critical: {mockData.controlSafeguard.critical}</span>
              </div>
            </div>
          </div>

          {/* Site Assessment Card */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">Avg Score</span>
                <div className="text-xl font-bold text-blue-600">{mockData.siteAssessment.averageScore}</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Site Assessment</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-900">{mockData.siteAssessment.total}</span>
                <span className="text-sm text-blue-600 font-medium">91% ↗</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Completed: {mockData.siteAssessment.completed}</span>
                <span className="text-orange-600">Pending: {mockData.siteAssessment.pending}</span>
              </div>
            </div>
          </div>

          {/* Risk Trend Summary */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">Current Risk</span>
                <div className="text-xl font-bold text-purple-600">2.8</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Trend</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600 font-medium">↓ 15% decrease</span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            </div>
          </div>

          {/* Sites Overview */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">Total Sites</span>
                <div className="text-xl font-bold text-orange-600">{mockData.lastRiskAssessmentForSites.length}</div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Sites</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Low: 3</span>
                <span className="text-yellow-600">Medium: 2</span>
                <span className="text-red-600">High: 2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Control Safeguard Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">Control Safeguard Trends</h3>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.controlSafeguard.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="activeControls" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
                    name="Active Controls"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="criticalIssues" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#EF4444', strokeWidth: 2 }}
                    name="Critical Issues"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Site Assessment Score Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <PieChart className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Assessment Score Distribution</h3>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsPieChart
                    data={mockData.siteAssessment.scoreDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockData.siteAssessment.scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Second Row of Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Site Risk For A Unit Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Site Risk Over Time</h3>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData.siteRiskForAUnit}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="riskLevel" 
                    stroke="#8B5CF6" 
                    fill="url(#colorRisk)"
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
                    name="Risk Level"
                  />
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Last Risk Assessment Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <h3 className="text-xl font-semibold text-gray-900">Latest Risk Assessment by Site</h3>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.lastRiskAssessmentForSites}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="site" 
                    stroke="#6B7280"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="score" 
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                    name="Risk Score"
                  >
                    {mockData.lastRiskAssessmentForSites.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Site Assessment Progress Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Monthly Assessment Progress</h3>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.siteAssessment.monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="completed" 
                    fill="#3B82F6"
                    radius={[8, 8, 0, 0]}
                    name="Assessments Completed"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Assessment Table */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Latest Risk Assessments</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {mockData.lastRiskAssessmentForSites.map((site, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {site.site.split(' ')[1].charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{site.site}</div>
                      <div className="text-sm text-gray-500">{formatDate(site.lastAssessment)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-900">{site.score}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(site.riskLevel)}`}>
                      {site.riskLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">System Health Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-gray-600">System Uptime</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">247</div>
              <div className="text-sm text-gray-600">Active Monitors</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">Critical Alerts</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;