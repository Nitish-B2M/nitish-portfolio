type Experience = {
  company: string;
  title: string;
  start: string;
  end: string;
  description: string;
};

export default function ExperienceTimeline({ items }: { items: Experience[] }) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-primary-800/50 transform -translate-x-1/2" />

      {/* Timeline items */}
      <div className="space-y-12">
        {items.map((item, index) => (
          <div key={index} className={`relative flex flex-col md:flex-row gap-8 ${
            index % 2 === 0 ? 'md:flex-row-reverse' : ''
          }`}>
            {/* Date */}
            <div className={`flex-1 order-2 md:order-none pl-5 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
              <div className="bg-primary-900/30 inline-block px-4 py-2 rounded-lg border border-primary-800/50">
                <time className="text-primary-200 font-medium">
                  {item.start} — {item.end}
                </time>
              </div>
            </div>

            {/* Dot */}
            <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-primary-600 rounded-full transform -translate-x-1/2 mt-2">
              <div className="absolute w-8 h-8 bg-primary-600/20 rounded-full -left-2 -top-2 animate-ping" />
            </div>

            {/* Content */}
            <div className={`flex-1 ml-6 md:ml-0 order-1 md:order-none ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="text-primary-900 mb-2">{item.company}</p>
              <p className="text-primary-700">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 