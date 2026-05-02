// Note: This needs to be a client component if it uses lucide icons directly or interacts with state
export function StatCard({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-suivlima-blue text-white',
    orange: 'bg-suivlima-orange text-white',
    green: 'bg-emerald-500 text-white',
    red: 'bg-rose-500 text-white',
    gray: 'bg-gray-100 text-gray-600',
  };

  const iconColorClass = colorMap[color] || colorMap.blue;
  const gradientClass = color === 'blue' ? 'gradient-blue' : color === 'orange' ? 'gradient-orange' : iconColorClass;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6 flex items-start space-x-3 sm:space-x-4 hover-lift transition-all cursor-default">
      <div className={`p-2 sm:p-3 rounded-lg shadow-inner shrink-0 ${gradientClass}`}>
        <Icon size={18} className="sm:w-6 sm:h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500">{title}</h3>
        <div className="mt-1 flex items-baseline flex-wrap gap-1">
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <span className={`flex items-baseline text-xs sm:text-sm font-semibold ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? '↑' : '↓'}
              <span className="sr-only"> {trend === 'up' ? 'Augmentation de' : 'Diminution de'} </span>
              {trendValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
