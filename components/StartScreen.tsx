import { motion } from 'framer-motion';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white relative min-h-full overflow-auto flex flex-col items-center justify-center"
    >
      {/* 메인 로고 */}
      <div className="flex flex-col font-['Pretendard:SemiBold',_sans-serif] justify-center leading-[normal] text-[#102a71] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center tracking-[-0.03em]">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onAnimationComplete={() => {
            // 애니메이션이 완료되면 자동으로 다음 화면으로 전환
            setTimeout(() => {
              onStart();
            }, 200); // 로고 애니메이션 완료 후 0.2초 대기
          }}
        >
          <p className="mb-0">AI</p>
          <p className="mb-0">&nbsp;</p>
          <p className="mb-0">To</p>
          <p className="mb-0">BASE</p>
        </motion.div>
      </div>
    </motion.div>
  );
}