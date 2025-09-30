import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, CheckCircle2, User, Sparkles, Share2, Zap, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card } from './ui/card';

interface ReportPreviewProps {
  onBack: () => void;
}

export function ReportPreview({ onBack }: ReportPreviewProps) {
  const [progressValues, setProgressValues] = useState<number[]>([0, 0, 0, 0, 0]);

  // 프로그레스 바 애니메이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValues([32.4, 23.6, 19.0, 14.6, 10.4]);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // 더 자연스럽지만 시각적으로 풍부한 데이터
  const reportData = {
    user: {
      name: "마무리",
      skinType: "자극 민감 타입"
    },
    recipe: {
      name: "마무리님만의 진정 케어 크림",
      totalAmount: "50g",
      ingredients: [
        { name: "센텔라 아시아티카 추출물", grams: "16.2g", percentage: 32.4, color: "#102A71" },
        { name: "히알루론산 나트륨", grams: "11.8g", percentage: 23.6, color: "slate-500" },
        { name: "알로에 베라잎추출물", grams: "9.5g", percentage: 19.0, color: "#102A71" },
        { name: "판테놀(프로비타민B5)", grams: "7.3g", percentage: 14.6, color: "slate-500" },
        { name: "베타글루칸", grams: "5.2g", percentage: 10.4, color: "#102A71" }
      ]
    },
    personalMessage: "마무리님의 민감한 피부를 위해 특별히 조합된 레시피입니다",
    skinAnalysis: "자극에 민감하고 수분이 부족한 피부 타입으로 분석되었습니다",
    ingredientDescriptions: [
      "센텔라 아시아티카 추출물 • 예민한 피부를 달래주는 자연의 진정제로, 염증을 빠르게 완화시킵니다",
      "히알루론산 나트륨 • 자체 무게의 1000배 수분을 보유할 수 있는 강력한 보습 성분입니다", 
      "알로에 베라잎추출물 • 시원한 쿨링감과 함께 피부를 부드럽게 진정시키는 자연 성분입니다",
      "판테놀(프로비타민B5) • 피부 장벽을 강화하고 수분 손실을 방지하는 필수 비타민입니다",
      "베타글루칸 • 면역력을 높이고 외부 자극으로부터 피부를 보호하는 천연 방어막입니다"
    ],
    mixingInstructions: [
      "먼저 센텔라 아시아티카 추출물과 히알루론산을 균일하게 섞어주세요.",
      "알로에 베라 젤을 천천히 추가하며 덩어리가 생기지 않도록 부드럽게 저어주세요.",
      "판테놀과 베타글루칸을 순서대로 첨가하여 최종 혼합을 완료합니다.",
      "모든 성분이 완전히 섞일 때까지 약 3-5분간 일정한 방향으로 저어주세요."
    ],
    usage: {
      frequency: "하루 2회 (아침, 저녁)",
      amount: "완두콩 크기 정도",
      method: "깨끗한 피부에 부드럽게 발라 흡수시키기",
      tips: [
        "세안 후 3분 이내에 발라주면 수분 흡수가 더욱 효과적입니다",
        "저녁에는 조금 더 두껍게 발라 수면팩으로 활용해보세요",
        "냉장보관하면 진정 효과가 한층 더 좋아집니다"
      ]
    },
    review: {
      title: "자극 민감 타입인 마무리님을 위해 순하면서도 효과적인 성분들로 구성된 맞춤 레시피입니다.",
      benefits: [
        "외부 자극으로부터 피부 보호",
        "깊은 수분 공급으로 촉촉함 지속",
        "자연친화적 원료로 안심 사용",
        "매일 사용할수록 건강하고 안정된 피부"
      ],
      effectiveness: 94,
      satisfaction: 98
    },
    storage: {
      period: "제조 후 3개월",
      location: "냉장고 보관 권장",
      cautions: [
        "직사광선을 피해 서늘한 곳에 보관하세요",
        "사용 전 반드시 패치 테스트를 실시하세요",
        "알레르기 반응 시 즉시 사용을 중단하세요"
      ]
    }
  };

  return (
    <div className="h-screen bg-slate-50 overflow-auto">
      {/* 헤더 */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 h-auto text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full">
            <ArrowLeft className="size-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Award className="size-4 text-[#102A71]" />
            <span className="text-sm font-semibold text-slate-900">맞춤 분석 리포트</span>
          </div>
          
          <Button variant="ghost" size="sm" className="p-2 h-auto text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full">
            <Share2 className="size-5" />
          </Button>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="px-6 py-8 max-w-md mx-auto">
        {/* 사용자 정보 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-[#102A71]/8 border border-[#102A71]/20 px-4 py-2 rounded-full mb-5">
              <Sparkles className="size-4 text-[#102A71]" />
              <span className="text-sm text-[#102A71] font-medium">피부 타입 분석 완료</span>
            </div>
            
            <h1 className="text-xl leading-relaxed mb-6 text-slate-800">
              <span className="text-[#102A71] font-semibold">{reportData.user.name}</span>님은<br/>
              <span className="text-[#102A71] font-bold text-2xl">'{reportData.user.skinType}'</span><br/>
              <span className="text-slate-600">입니다</span>
            </h1>
            
            <p className="text-sm text-slate-600 leading-relaxed">{reportData.personalMessage}</p>
          </div>
        </motion.div>

        {/* 1. 맞춤 화장품 레시피 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <PieChart className="size-5 text-[#102A71]" />
            맞춤 화장품 레시피
          </h2>
          
          <Card className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/60 border border-slate-100">
            {/* 헤더 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#102A71] rounded-2xl flex items-center justify-center shadow-lg shadow-[#102A71]/20">
                <Award className="size-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{reportData.recipe.name}</h3>
                <p className="text-sm text-slate-600 font-medium">총 함량: {reportData.recipe.totalAmount}</p>
              </div>
            </div>
            
            {/* 성분별 시각화 */}
            <div className="space-y-4 mb-6">
              {reportData.recipe.ingredients.map((ingredient, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-slate-900">{ingredient.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#102A71] bg-[#102A71]/5 px-2 py-1 rounded-lg">{ingredient.grams}</span>
                      <span className={`text-xs px-2 py-1 rounded-lg ${ingredient.color === '#102A71' ? 'bg-[#102A71] shadow-md shadow-[#102A71]/30' : 'bg-slate-500 shadow-md shadow-slate-500/30'} text-white font-medium`}>
                        {ingredient.percentage}%
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={progressValues[index]} 
                    className="h-2"
                  />
                </motion.div>
              ))}
            </div>
            
            {/* 원료 표 */}
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">원료명</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">함량</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-900">비율</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.recipe.ingredients.map((ingredient, index) => (
                    <motion.tr 
                      key={index} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 + (0.05 * index) }}
                      className="border-t border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-4 text-slate-900 font-medium">{ingredient.name}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 bg-[#102A71]/10 text-[#102A71] text-sm font-medium rounded-lg">
                          {ingredient.grams}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg shadow-sm">
                          {ingredient.percentage}%
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.section>

        {/* 2. 원료 설명 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="size-5 text-[#102A71]" />
            성분 상세 안내
          </h2>
          
          <Card className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
            <div className="space-y-4">
              {reportData.ingredientDescriptions.map((description, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (0.1 * index) }}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md ${reportData.recipe.ingredients[index]?.color === '#102A71' ? 'bg-[#102A71] shadow-[#102A71]/30' : 'bg-slate-500 shadow-slate-500/30'}`}>
                    <CheckCircle2 className="size-4 text-white" />
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{description}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.section>

        {/* 3. 사용법 및 팁 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Zap className="size-5 text-[#102A71]" />
            사용법 & 꿀팁
          </h2>
          
          <Card className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
            <div className="grid gap-4 mb-6">
              <div className="bg-[#102A71]/5 rounded-2xl p-4 border border-[#102A71]/20 shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#102A71] rounded-full shadow-sm"></span>
                  사용 빈도
                </h4>
                <p className="text-slate-700 text-sm font-medium">{reportData.usage.frequency}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-500 rounded-full shadow-sm"></span>
                  사용량
                </h4>
                <p className="text-slate-700 text-sm font-medium">{reportData.usage.amount}</p>
              </div>
              <div className="bg-[#102A71]/5 rounded-2xl p-4 border border-[#102A71]/20 shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#102A71] rounded-full shadow-sm"></span>
                  사용 방법
                </h4>
                <p className="text-slate-700 text-sm font-medium">{reportData.usage.method}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 mb-3">전문가 꿀팁</h4>
              {reportData.usage.tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (0.1 * index) }}
                  className="bg-[#102A71]/5 border border-[#102A71]/20 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-[#102A71] text-sm leading-relaxed font-medium">{tip}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.section>

        {/* 4. 효과 예측 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="size-5 text-[#102A71]" />
            기대 효과
          </h2>
          
          <Card className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
            {/* 배경 데코레이션 */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#102A71]/10 rounded-full transform translate-x-12 -translate-y-12"></div>
            
            <div className="relative">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-[#102A71] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#102A71]/20">
                  <User className="size-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 text-sm leading-relaxed italic font-medium bg-slate-50 p-3 rounded-xl">"{reportData.review.title}"</p>
                </div>
              </div>
              
              {/* 효과 지표 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#102A71]/5 rounded-2xl p-4 border border-[#102A71]/20 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900">효과성</span>
                    <span className="text-[#102A71] font-bold bg-white px-2 py-1 rounded-lg shadow-sm">{reportData.review.effectiveness}%</span>
                  </div>
                  <Progress value={reportData.review.effectiveness} className="h-2" />
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900">만족도</span>
                    <span className="text-slate-600 font-bold bg-slate-50 px-2 py-1 rounded-lg shadow-sm">{reportData.review.satisfaction}%</span>
                  </div>
                  <Progress value={reportData.review.satisfaction} className="h-2" />
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-5">
                <div className="space-y-3">
                  {reportData.review.benefits.map((benefit, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (0.1 * index) }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-5 h-5 bg-[#102A71] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="size-3 text-white" />
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* 5. 보관 안내 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">보관 가이드</h2>
          
          <Card className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-[#102A71] rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <h4 className="font-semibold text-slate-900">사용 기한</h4>
                </div>
                <p className="text-slate-700 text-sm">{reportData.storage.period}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-slate-500 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">📍</span>
                  </div>
                  <h4 className="font-semibold text-slate-900">보관 장소</h4>
                </div>
                <p className="text-slate-700 text-sm font-medium">{reportData.storage.location}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">⚠️ 주의사항</h4>
              {reportData.storage.cautions.map((caution, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-4 h-4 bg-slate-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{caution}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>

        {/* 브랜드 푸터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 bg-[#102A71] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#102A71]/30">
            <Sparkles className="size-8 text-white" />
          </div>
          <div className="text-sm font-semibold text-[#102A71] mb-2">
            AI TO BASE
          </div>
          <div className="text-xs text-slate-500">
            당신만의 맞춤 화장품 레시피
          </div>
        </motion.div>
      </div>
    </div>
  );
}