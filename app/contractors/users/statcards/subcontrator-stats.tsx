
import React from 'react';
import { Building2, Star, Users, CheckCircle, TrendingUp } from 'lucide-react';

const SubcontractorStats = ({subcontractorData}: {subcontractorData: any}) => {
  const totalSubcontractors = subcontractorData.length;
  const activeSubcontractors = subcontractorData.filter((sub: any) => sub.isActive).length;
  const companySubcontractors = subcontractorData.filter((sub: any) => sub.isCompany).length;
  const averageRating = subcontractorData.reduce((acc: any, sub: any) => acc + sub.rating, 0) / subcontractorData.length;
  const activePercentage = Math.round((activeSubcontractors / totalSubcontractors) * 100);

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, gradient, textColor }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    trend?: { value: string; isPositive: boolean };
    gradient: string;
    textColor: string;
  }) => {
    return (
      <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* Floating orbs for visual interest */}
        <div className={`absolute -top-4 -right-4 w-24 h-24 ${gradient} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity duration-500`} />
        <div className={`absolute -bottom-4 -left-4 w-16 h-16 ${gradient} opacity-5 rounded-full blur-lg group-hover:opacity-15 transition-opacity duration-500`} />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {title}
              </p>
              <div className="flex items-end space-x-3">
                <h3 className={`text-4xl font-bold ${textColor} leading-none`}>
                  {value}
                </h3>
                {trend && (
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                    trend.isPositive 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${trend.isPositive ? '' : 'rotate-180'}`} />
                    <span>{trend.value}</span>
                  </div>
                )}
              </div>
              {subtitle && (
                <p className="text-sm text-gray-600 font-medium mt-2">
                  {subtitle}
                </p>
              )}
            </div>
            
            {/* Icon container with enhanced styling */}
            <div className={`relative p-4 rounded-2xl ${gradient} bg-opacity-15 group-hover:bg-opacity-25 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              <Icon className={`h-8 w-8 ${textColor}`} />
              {/* Icon glow effect */}
              <div className={`absolute inset-0 ${gradient} opacity-20 rounded-2xl blur-md group-hover:opacity-40 transition-opacity duration-300`} />
            </div>
          </div>
          
          {/* Progress bar for visual enhancement */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full ${gradient} rounded-full transition-all duration-1000 delay-300`}
              style={{ 
                width: title.includes('Total') ? '90%' : 
                       title.includes('Active') ? `${activePercentage}%` : 
                       title.includes('Company') ? '85%' : '75%'
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Subcontractors"
            value={totalSubcontractors}
            subtitle="Registered partners"
            icon={Users}
            trend={{
              value: "8%",
              isPositive: true
            }}
            gradient="bg-gradient-to-br from-violet-500 to-purple-500"
            textColor="text-violet-700"
          />

          <StatCard
            title="Active Partners"
            value={`${activePercentage}%`}
            subtitle={`${activeSubcontractors} of ${totalSubcontractors} active`}
            icon={CheckCircle}
            trend={{
              value: "3%",
              isPositive: true
            }}
            gradient="bg-gradient-to-br from-emerald-500 to-teal-500"
            textColor="text-emerald-700"
          />

          <StatCard
            title="Company Partners"
            value={companySubcontractors}
            subtitle="Registered companies"
            icon={Building2}
            trend={{
              value: "2",
              isPositive: true
            }}
            gradient="bg-gradient-to-br from-blue-500 to-indigo-500"
            textColor="text-blue-700"
          />
        </div>
  );
};

export default SubcontractorStats;