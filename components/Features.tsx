import React from 'react';
import { Translation } from '../types';
import { Heart, Gamepad2, Users, Globe } from 'lucide-react';

interface FeaturesProps {
  t: Translation['features'];
}

const Features: React.FC<FeaturesProps> = ({ t }) => {
  const features = [
    {
      title: t.socialImpactTitle,
      desc: t.socialImpactDesc,
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      color: "hover:border-pink-500/50"
    },
    {
      title: t.entertainmentTitle,
      desc: t.entertainmentDesc,
      icon: <Gamepad2 className="w-8 h-8 text-purple-500" />,
      color: "hover:border-purple-500/50"
    },
    {
      title: t.communityTitle,
      desc: t.communityDesc,
      icon: <Users className="w-8 h-8 text-blue-500" />,
      color: "hover:border-blue-500/50"
    },
    {
      title: t.economyTitle,
      desc: t.economyDesc,
      icon: <Globe className="w-8 h-8 text-cyan-500" />,
      color: "hover:border-cyan-500/50"
    }
  ];

  return (
    <div id="utility" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 ${feature.color} transition-all duration-300 hover:-translate-y-2 group`}
            >
              <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-base">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;