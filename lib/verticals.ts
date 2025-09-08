export interface Vertical {
  id: string;
  name: string;
  icon: string;
  description: string;
  commonDataTypes: string[];
  useCases: string[];
}

export const INDUSTRY_VERTICALS: Vertical[] = [
  {
    id: 'healthcare',
    name: 'Healthcare & Life Sciences',
    icon: '🏥',
    description: 'Medical records, clinical trials, patient outcomes, drug discovery',
    commonDataTypes: ['Patient records', 'Clinical trials', 'Lab results', 'Medical imaging', 'Genomic data'],
    useCases: ['Patient outcome prediction', 'Drug discovery', 'Disease diagnosis', 'Treatment optimization']
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Industrial',
    icon: '🏭',
    description: 'Production data, quality control, supply chain, equipment monitoring',
    commonDataTypes: ['Production metrics', 'Quality control', 'IoT sensor data', 'Supply chain', 'Equipment logs'],
    useCases: ['Predictive maintenance', 'Quality optimization', 'Supply chain efficiency', 'Defect detection']
  },
  {
    id: 'ecommerce',
    name: 'E-commerce & Retail',
    icon: '🛒',
    description: 'Sales data, customer behavior, inventory, product reviews',
    commonDataTypes: ['Sales transactions', 'Customer data', 'Product catalogs', 'Reviews', 'Inventory levels'],
    useCases: ['Demand forecasting', 'Customer segmentation', 'Pricing optimization', 'Recommendation systems']
  },
  {
    id: 'finance',
    name: 'Finance & Banking',
    icon: '💰',
    description: 'Transactions, risk assessment, fraud detection, investment analysis',
    commonDataTypes: ['Transaction records', 'Credit scores', 'Market data', 'Risk metrics', 'Customer profiles'],
    useCases: ['Fraud detection', 'Credit risk assessment', 'Portfolio optimization', 'Customer churn prediction']
  },
  {
    id: 'aerospace',
    name: 'Aerospace & Defense',
    icon: '✈️',
    description: 'Flight data, maintenance records, safety metrics, performance analysis',
    commonDataTypes: ['Flight telemetry', 'Maintenance logs', 'Safety records', 'Performance metrics', 'Weather data'],
    useCases: ['Predictive maintenance', 'Flight optimization', 'Safety analysis', 'Fuel efficiency']
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: '🚗',
    description: 'Vehicle telemetry, maintenance, autonomous driving, manufacturing',
    commonDataTypes: ['Vehicle telemetry', 'Maintenance records', 'Sensor data', 'Production data', 'Customer feedback'],
    useCases: ['Predictive maintenance', 'Autonomous driving', 'Quality control', 'Customer satisfaction']
  },
  {
    id: 'energy',
    name: 'Energy & Utilities',
    icon: '⚡',
    description: 'Consumption patterns, grid data, renewable energy, maintenance',
    commonDataTypes: ['Consumption data', 'Grid metrics', 'Weather data', 'Equipment sensors', 'Pricing data'],
    useCases: ['Demand forecasting', 'Grid optimization', 'Predictive maintenance', 'Renewable integration']
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Food',
    icon: '🌾',
    description: 'Crop yields, weather data, soil analysis, supply chain',
    commonDataTypes: ['Crop data', 'Weather patterns', 'Soil analysis', 'Yield metrics', 'Market prices'],
    useCases: ['Yield prediction', 'Crop optimization', 'Disease detection', 'Supply chain efficiency']
  },
  {
    id: 'logistics',
    name: 'Logistics & Transportation',
    icon: '🚚',
    description: 'Shipping data, route optimization, fleet management, warehousing',
    commonDataTypes: ['Shipping records', 'Route data', 'Fleet metrics', 'Warehouse inventory', 'Delivery times'],
    useCases: ['Route optimization', 'Fleet management', 'Demand prediction', 'Last-mile delivery']
  },
  {
    id: 'telecommunications',
    name: 'Telecommunications',
    icon: '📡',
    description: 'Network performance, customer usage, service quality, infrastructure',
    commonDataTypes: ['Network metrics', 'Usage patterns', 'Customer data', 'Service logs', 'Infrastructure data'],
    useCases: ['Network optimization', 'Churn prediction', 'Service quality', 'Capacity planning']
  },
  {
    id: 'realestate',
    name: 'Real Estate & Construction',
    icon: '🏗️',
    description: 'Property data, market trends, construction metrics, tenant information',
    commonDataTypes: ['Property listings', 'Market data', 'Construction metrics', 'Tenant data', 'Maintenance records'],
    useCases: ['Price prediction', 'Market analysis', 'Construction optimization', 'Tenant screening']
  },
  {
    id: 'education',
    name: 'Education & EdTech',
    icon: '🎓',
    description: 'Student performance, learning analytics, curriculum data',
    commonDataTypes: ['Student records', 'Performance metrics', 'Course data', 'Engagement analytics', 'Assessment results'],
    useCases: ['Performance prediction', 'Personalized learning', 'Dropout prevention', 'Curriculum optimization']
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Tourism',
    icon: '🏨',
    description: 'Booking data, guest preferences, occupancy rates, reviews',
    commonDataTypes: ['Booking records', 'Guest profiles', 'Occupancy data', 'Reviews', 'Revenue metrics'],
    useCases: ['Demand forecasting', 'Price optimization', 'Guest satisfaction', 'Revenue management']
  },
  {
    id: 'media',
    name: 'Media & Entertainment',
    icon: '🎬',
    description: 'Content consumption, user engagement, advertising metrics',
    commonDataTypes: ['Viewing data', 'User profiles', 'Content metadata', 'Engagement metrics', 'Ad performance'],
    useCases: ['Content recommendation', 'Audience analysis', 'Ad optimization', 'Content planning']
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: '🛡️',
    description: 'Claims data, risk assessment, policy information, actuarial data',
    commonDataTypes: ['Claims records', 'Policy data', 'Risk factors', 'Customer profiles', 'Loss data'],
    useCases: ['Risk assessment', 'Fraud detection', 'Claims prediction', 'Premium optimization']
  },
  {
    id: 'government',
    name: 'Government & Public Sector',
    icon: '🏛️',
    description: 'Census data, public services, infrastructure, compliance',
    commonDataTypes: ['Census data', 'Service records', 'Infrastructure data', 'Budget data', 'Compliance metrics'],
    useCases: ['Service optimization', 'Resource allocation', 'Policy analysis', 'Fraud prevention']
  },
  {
    id: 'sports',
    name: 'Sports & Fitness',
    icon: '⚽',
    description: 'Performance metrics, player statistics, fan engagement, health data',
    commonDataTypes: ['Player stats', 'Game data', 'Training metrics', 'Fan data', 'Health records'],
    useCases: ['Performance analysis', 'Injury prediction', 'Fan engagement', 'Strategy optimization']
  },
  {
    id: 'mining',
    name: 'Mining & Resources',
    icon: '⛏️',
    description: 'Exploration data, production metrics, safety records, equipment data',
    commonDataTypes: ['Geological data', 'Production metrics', 'Equipment logs', 'Safety records', 'Environmental data'],
    useCases: ['Resource exploration', 'Production optimization', 'Safety monitoring', 'Equipment maintenance']
  },
  {
    id: 'pharmaceutical',
    name: 'Pharmaceutical',
    icon: '💊',
    description: 'Drug development, clinical trials, regulatory compliance, manufacturing',
    commonDataTypes: ['Clinical trial data', 'R&D metrics', 'Manufacturing data', 'Regulatory docs', 'Sales data'],
    useCases: ['Drug discovery', 'Clinical trial optimization', 'Quality control', 'Market analysis']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: '🔒',
    description: 'Threat intelligence, security logs, vulnerability data, incident response',
    commonDataTypes: ['Security logs', 'Threat data', 'Vulnerability scans', 'Network traffic', 'Incident reports'],
    useCases: ['Threat detection', 'Vulnerability assessment', 'Incident response', 'Risk analysis']
  }
];