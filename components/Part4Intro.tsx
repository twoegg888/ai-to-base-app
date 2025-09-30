import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypewriterText } from './TypewriterText';

interface Part4IntroProps {
  onComplete: () => void;
}

export function Part4Intro({ onComplete }: Part4IntroProps) {
  const [showPart4, setShowPart4] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    const part4Timer = setTimeout(() => setShowPart4(true), 300);
    const titleTimer = setTimeout(() => setShowTitle(true), 1000);
    return () => {
      clearTimeout(part4Timer);
      clearTimeout(titleTimer);
    };
  }, []);

  return (
    <div className="bg-white relative size-full">
      {showPart4 && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", damping: 15, stiffness: 300 }}
            className="absolute bg-[#102a71] h-[50px] sm:h-[55px] md:h-[60px] lg:h-[66px] xl:h-[70px] left-1/2 rounded-[15px] sm:rounded-[17px] md:rounded-[18px] lg:rounded-[19px] xl:rounded-[20px] top-[20%] sm:top-[22%] md:top-[24%] lg:top-[26%] xl:top-[28%] w-[150px] sm:w-[160px] md:w-[180px] lg:w-[194px] xl:w-[200px] translate-x-[-50%]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute font-['Pretendard:SemiBold',_sans-serif] leading-[0] left-1/2 not-italic text-[#ffde59] text-lg sm:text-xl md:text-[22px] lg:text-2xl xl:text-[30px] text-center text-nowrap top-[calc(20%+12px)] sm:top-[calc(22%+13px)] md:top-[calc(24%+14px)] lg:top-[calc(26%+15px)] xl:top-[calc(28%+17px)] tracking-[-0.9px] translate-x-[-50%]"
          >
            <motion.p 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="leading-[normal] whitespace-pre"
            >
              part4
            </motion.p>
          </motion.div>
        </>
      )}

      <div className="absolute flex flex-col font-['Pretendard:SemiBold',_sans-serif] justify-center leading-[normal] not-italic text-[#102a71] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center top-1/2 tracking-[-1.5px] translate-x-[-50%] translate-y-[-50%]" style={{ left: "calc(50% + 0.5px)" }}>
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <TypewriterText text="화장품 사용" speed={100} delay={0} className="mb-0 block whitespace-nowrap" />
            <TypewriterText text="경험은?" speed={100} delay={800} className="block whitespace-nowrap" />
          </motion.div>
        )}
      </div>
    </div>
  );
}