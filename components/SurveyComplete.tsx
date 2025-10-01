import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TypewriterText } from './TypewriterText';
import { SurveyAnswers } from '../data/surveyQuestions';
import { ReportPreview } from './ReportPreview';
import { waitForAIRecommendation } from '../utils/supabase/survey';

interface SurveyCompleteProps {
  userName: string;
  answers: SurveyAnswers;
  onRestart: () => void;
  surveyId?: string;
}

export function SurveyComplete({ userName, answers, onRestart, surveyId }: SurveyCompleteProps) {
  const [showInitialMessage, setShowInitialMessage] = useState(true);
  const [showProcessing, setShowProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const steps = [
    { text: '설문 데이터를 분석하고 있어요', duration: 3000 },
    { text: '피부 타입과 선호도를 검토하고 있어요', duration: 3500 },
    { text: '맞춤형 레시피를 생성하고 있어요', duration: 4000 },
    { text: '최적의 원료 조합을 계산하고 있어요', duration: 3500 },
    { text: '거의 완성되었어요', duration: 2000 }
  ];

  useEffect(() => {
    // 초기 완료 메시지 표시 (2초)
    const timer1 = setTimeout(() => {
      setShowInitialMessage(false);
      setShowProcessing(true);
      startProcessing();
    }, 2000);

    return () => clearTimeout(timer1);
  }, []);

  const startProcessing = async () => {
    let totalProgress = 0;
    const progressPerStep = 80 / steps.length; // 80%까지는 단계별 진행

    // 단계별 진행
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      
      // 프로그레스 바 증가
      const targetProgress = (i + 1) * progressPerStep;
      const startProgress = totalProgress;
      const duration = steps[i].duration;
      const increment = (targetProgress - startProgress) / (duration / 50);
      
      const progressInterval = setInterval(() => {
        totalProgress += increment;
        if (totalProgress >= targetProgress) {
          totalProgress = targetProgress;
          clearInterval(progressInterval);
        }
        setLoadingProgress(Math.min(totalProgress, 80));
      }, 50);

      await new Promise(resolve => setTimeout(resolve, duration));
      clearInterval(progressInterval);
    }

    // 실제 AI 결과 대기
    try {
      if (surveyId) {
        const result = await waitForAIRecommendation(surveyId, 15);
        
        // 마지막 20% 진행
        setLoadingProgress(100);
        
        if (result.success && result.data?.recommendation) {
          try {
            // JSON 형식인지 먼저 확인
            let recommendation;
            const rawData = result.data.recommendation;
            
            if (typeof rawData === 'string' && rawData.trim().startsWith('{')) {
              // JSON 형식으로 파싱 시도
              recommendation = JSON.parse(rawData);
            } else if (typeof rawData === 'string') {
              // 마크다운 형식일 경우 텍스트 그대로 처리
              console.log('📝 마크다운 형식의 AI 결과 감지:', rawData.substring(0, 100) + '...');
              recommendation = {
                isMarkdown: true,
                content: rawData,
                summary: '맞춤형 화장품 레시피가 생성되었습니다.'
              };
            } else {
              // 이미 객체 형태인 경우
              recommendation = rawData;
            }
            
            setAiResult(recommendation);
          } catch (parseError) {
            console.error('AI 추천 데이터 파싱 오류:', parseError);
            console.log('문제가 된 데이터:', result.data.recommendation);
            
            // 파싱 실패 시에도 원본 텍스트로 처리
            setAiResult({
              isMarkdown: true,
              content: result.data.recommendation,
              summary: '레시피가 생성되었지만 형식 처리 중 문제가 발생했습니다.',
              error: false // 에러가 아닌 대안 처리
            });
          }
        } else {
          setAiResult({
            error: true,
            message: '레시피 생성에 실패했습니다. 다시 시도해주세요.'
          });
        }
      } else {
        setAiResult({
          error: true,
          message: '설문 ID를 찾을 수 없습니다.'
        });
      }
    } catch (error) {
      console.error('AI 결과 대기 중 오류:', error);
      setAiResult({
        error: true,
        message: '처리 중 오류가 발생했습니다.'
      });
    }
  };
// AI 결과가 있으면 보고서 화면 표시
if (aiResult) {
  return <ReportPreview onBack={onRestart} />;
}

  // 초기 완료 메시지 (토스 스타일)
  if (showInitialMessage) {
    return (
      <div className="bg-white relative size-full flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center max-w-sm"
        >
          {/* 토스 스타일 체크 아이콘 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="w-12 h-12 bg-[#102A71] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M6 10l3 3 5-6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <h2 className="text-xl text-gray-900 mb-3">
              설문이 완료되었어요
            </h2>
            
            <p className="text-gray-600">
              {userName}님의 답변을 바탕으로<br />
              맞춤 레시피를 준비하고 있어요
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // 처리 중 화면 (토스 스타일)
  return (
    <div className="bg-white relative size-full flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-sm w-full"
      >
        {/* 토스 스타일 심플 로딩 */}
        <div className="w-10 h-10 mx-auto mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-full h-full border-2 border-gray-200 border-t-[#102A71] rounded-full"
          />
        </div>
        
        {/* 현재 단계 메시지 */}
        <motion.h2
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-lg text-gray-900 mb-2"
        >
          {steps[currentStep]?.text || '처리 중이에요'}
        </motion.h2>
        
        <p className="text-sm text-gray-500 mb-8">
          잠시만 기다려주세요
        </p>

        {/* 토스 스타일 심플 프로그레스 바 */}
        <div className="w-full bg-gray-100 rounded-full h-1 mb-3">
          <motion.div 
            className="bg-[#102A71] h-1 rounded-full"
            style={{ width: `${loadingProgress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>
        
        {/* 프로그레스 퍼센트 */}
        <p className="text-xs text-gray-400">
          {Math.round(loadingProgress)}%
        </p>
      </motion.div>
    </div>
  );
}