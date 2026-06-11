import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Heart, Droplets, Zap, Shield, Star, Sun, Leaf, 
  FlaskConical, ShieldCheck, Award 
} from 'lucide-react';

const ICONS = {
  CheckCircle, Heart, Droplets, Zap, Shield, Star, Sun, Leaf
};

const getBenefits = (nutrition) => {
  const benefits = [];
  if (!nutrition) return benefits;
  
  if (nutrition.totalSugars !== null && nutrition.totalSugars <= 0.1)
    benefits.push({ label: 'No Added Sugar', icon: 'CheckCircle', color: 'green', tooltip: 'Safe for diabetics' });
  if (nutrition.transFat !== null && nutrition.transFat <= 0.1)
    benefits.push({ label: 'Zero Trans Fat', icon: 'Heart', color: 'green', tooltip: 'Heart healthy choice' });
  if (nutrition.sodium !== null && nutrition.sodium < 10)
    benefits.push({ label: 'Low Sodium', icon: 'Droplets', color: 'blue', tooltip: 'Good for blood pressure' });
  if (nutrition.protein !== null && nutrition.protein >= 8)
    benefits.push({ label: 'High Protein', icon: 'Zap', color: 'orange', tooltip: 'Builds and repairs muscle' });
  if (nutrition.calcium !== null && nutrition.calcium >= 100 && nutrition.calcium < 200)
    benefits.push({ label: 'Calcium Rich', icon: 'Shield', color: 'brown', tooltip: 'Strengthens bones and teeth' });
  if (nutrition.calcium !== null && nutrition.calcium >= 200)
    benefits.push({ label: 'Excellent Calcium Source', icon: 'Star', color: 'brown', tooltip: '19% of your daily calcium need' });
  if (nutrition.vitaminC !== null && nutrition.vitaminC >= 5)
    benefits.push({ label: 'Vitamin C Boost', icon: 'Sun', color: 'yellow', tooltip: 'Supports immunity' });
  if (nutrition.totalFat !== null && nutrition.totalFat <= 5)
    benefits.push({ label: 'Low Fat', icon: 'Leaf', color: 'green', tooltip: 'Weight management friendly' });
    
  return benefits;
};

// Brand-aligned organic color palette
const COLOR_MAP = {
  green: 'bg-[#eaf2eb] text-[#2D5A40] border-[#2D5A40]/20',
  blue: 'bg-[#eaf1f5] text-[#2b5a7a] border-[#2b5a7a]/20',
  orange: 'bg-[#fcf3ea] text-[#e0893b] border-[#e0893b]/20',
  brown: 'bg-[#f9f0e6] text-[#8B5A2B] border-[#8B5A2B]/20',
  yellow: 'bg-[#FDF4D6] text-[#b39a1d] border-[#b39a1d]/20',
};

const ProgressBar = ({ label, value, unit, dv, isGoodWhenHigh }) => {
  if (value === null || value === undefined) return null;
  
  const percentage = Math.min(100, Math.round((value / dv) * 100));
  
  let fillColor = 'bg-[#2D6A2D]'; // Brand Green
  if (isGoodWhenHigh) {
    if (percentage < 30) fillColor = 'bg-[#e0893b]'; // Brand Orange
    else if (percentage < 60) fillColor = 'bg-[#EACD38]'; // Brand Yellow
  } else {
    if (percentage > 60) fillColor = 'bg-[#e0893b]';
    else if (percentage > 30) fillColor = 'bg-[#EACD38]';
  }

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] uppercase tracking-widest text-[#1a3a28]/60 font-bold">
          {label}
        </span>
        <span className="font-bold text-[#1a3a28] text-sm">
          {value}{unit}
        </span>
      </div>
      <div className="h-1.5 w-full bg-[#F2E8D5] rounded-full overflow-hidden shadow-inner">
        <motion.div 
          className={`h-full ${fillColor} rounded-full`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like ease
        />
      </div>
      <div className="text-[10px] text-[#1a3a28]/50 text-right mt-1 font-semibold">
        {percentage}% of daily value
      </div>
    </div>
  );
};

export default function NutritionPanel({ nutritionPer100g, labTested, fssaiCompliant, nablAccredited }) {
  if (!nutritionPer100g) return null;

  const benefits = getBenefits(nutritionPer100g);
  
  const caloriesPerServing = nutritionPer100g.energy ? Math.round(nutritionPer100g.energy * 0.3) : null;
  
  let proteinGrade = "LOW";
  if (nutritionPer100g.protein > 10) proteinGrade = "HIGH";
  else if (nutritionPer100g.protein >= 6) proteinGrade = "GOOD";

  let sugarStatus = nutritionPer100g.totalSugars !== null ? `${nutritionPer100g.totalSugars}g` : 'N/A';
  if (nutritionPer100g.totalSugars <= 0.1) sugarStatus = "<0.1g";

  return (
    <div className="bg-white rounded-[2rem] border border-[#F2E8D5] shadow-lg shadow-[#1a3a28]/5 p-6 sm:p-8 w-full">
      
      {/* SECTION 1 - Health Benefits */}
      {benefits.length > 0 && (
        <div className="flex flex-wrap gap-2.5 mb-8">
          {benefits.map((benefit, idx) => {
            const Icon = ICONS[benefit.icon];
            return (
              <div 
                key={idx}
                title={benefit.tooltip}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border ${COLOR_MAP[benefit.color]} cursor-help transition-all hover:shadow-md hover:-translate-y-0.5`}
              >
                <Icon size={14} strokeWidth={2.5} />
                {benefit.label}
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION 2 - Visual Bars */}
      <div className="mb-8 p-6 bg-white rounded-[1.5rem] border border-[#F2E8D5]">
        <ProgressBar label="Energy" value={nutritionPer100g.energy} unit=" Kcal" dv={2000} isGoodWhenHigh={false} />
        <ProgressBar label="Protein" value={nutritionPer100g.protein} unit="g" dv={50} isGoodWhenHigh={true} />
        <ProgressBar label="Calcium" value={nutritionPer100g.calcium} unit="mg" dv={1300} isGoodWhenHigh={true} />
        <ProgressBar label="Total Fat" value={nutritionPer100g.totalFat} unit="g" dv={67} isGoodWhenHigh={false} />
      </div>

      {/* SECTION 3 - Quick Facts */}
      <div className="grid grid-cols-3 gap-0 mb-8 bg-white border border-[#F2E8D5] rounded-[1.5rem] overflow-hidden shadow-sm items-stretch">
        <div className="text-center p-3 sm:p-4 flex flex-col justify-center items-center h-full">
          <div className="font-serif font-bold text-xl sm:text-2xl text-[#1a3a28] leading-none mb-1">
            {caloriesPerServing !== null ? caloriesPerServing : '--'}
          </div>
          <div className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#2D5A40] mt-1 text-center">
            Kcal / Serving
          </div>
        </div>
        <div className="text-center p-3 sm:p-4 border-l border-[#F2E8D5] flex flex-col justify-center items-center h-full">
          <div className="font-serif font-bold text-xl sm:text-2xl text-[#1a3a28] leading-none mb-1">{proteinGrade}</div>
          <div className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#2D5A40] mt-1 text-center">
            Protein
          </div>
        </div>
        <div className="text-center p-3 sm:p-4 border-l border-[#F2E8D5] flex flex-col justify-center items-center h-full">
          <div className="font-serif font-bold text-xl sm:text-2xl text-[#1a3a28] leading-none mb-1">{sugarStatus}</div>
          <div className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#2D5A40] mt-1 text-center">
            Sugar
          </div>
        </div>
      </div>

      {/* SECTION 4 - Trust Badges */}
      {(labTested || fssaiCompliant || nablAccredited) && (
        <div className="flex flex-col gap-3 mb-6">
          {labTested && (
            <div className="bg-[#eaf2eb] border border-[#2D5A40]/10 rounded-[1.25rem] px-4 py-3 flex items-center gap-3 transition-colors hover:bg-[#2D5A40]/10">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <FlaskConical size={16} className="text-[#2D5A40]" />
              </div>
              <span className="text-sm font-bold text-[#1a3a28]">Lab Tested</span>
            </div>
          )}
          {fssaiCompliant && (
            <div className="bg-[#fcf3ea] border border-[#e0893b]/10 rounded-[1.25rem] px-4 py-3 flex items-center gap-3 transition-colors hover:bg-[#e0893b]/10">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <ShieldCheck size={16} className="text-[#e0893b]" />
              </div>
              <span className="text-sm font-bold text-[#1a3a28]">FSSAI Approved</span>
            </div>
          )}
          {nablAccredited && (
            <div className="bg-[#eaf1f5] border border-[#2b5a7a]/10 rounded-[1.25rem] px-4 py-3 flex items-center gap-3 transition-colors hover:bg-[#2b5a7a]/10">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <Award size={16} className="text-[#2b5a7a]" />
              </div>
              <span className="text-sm font-bold text-[#1a3a28]">NABL Certified</span>
            </div>
          )}
        </div>
      )}

      {/* SECTION 5 - Disclaimer */}
      <div className="text-[10px] text-[#1a3a28]/40 italic leading-relaxed pt-4 border-t border-[#F2E8D5]">
        *Values are per 100g. Standard serving size is 30g. 
        {(labTested || nablAccredited) && " Lab tested at accredited facility."} 
        {fssaiCompliant && " Results meet FSSAI standards."}
      </div>
    </div>
  );
}
