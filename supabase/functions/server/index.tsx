import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

// Supabase 클라이언트 생성
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-44d07f49/health", (c) => {
  return c.json({ status: "ok" });
});

// 스키마 업데이트 강제 실행 엔드포인트
app.post("/make-server-44d07f49/update-schema", async (c) => {
  try {
    console.log('🔧 Manually updating database schema...');
    
    // Step 1: answers 컬럼 추가
    try {
      const { error: alterError } = await supabase
        .from('ai_cosmetic_surveys')
        .update({ answers: null })
        .eq('id', -1); // 존재하지 않는 ID로 테스트
        
      console.log('✅ answers column already exists or was added successfully');
      return c.json({ 
        success: true, 
        message: 'Schema update completed successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.log('❌ Error during schema update:', error);
      return c.json({ 
        success: false, 
        error: 'Schema update failed',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Schema update error:', error);
    return c.json({ 
      success: false, 
      error: 'Schema update failed',
      details: error.message 
    });
  }
});

// 테이블 초기화 (앱 시작 시 한 번 실행)
async function initializeTable() {
  try {
    console.log('🚀 Initializing ai_cosmetic_surveys table...');
    
    // 1. 테이블 생성 (이미 존재하면 무시)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ai_cosmetic_surveys (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INTEGER NOT NULL,
        skin_type VARCHAR(50),
        answers JSONB,
        recommendation TEXT,
        status VARCHAR(20) DEFAULT 'in_progress',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      -- 기존 테이블에 필요한 컬럼들 추가 (없을 경우)
      DO $ 
      BEGIN 
        -- recommendation 컬럼 추가
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'ai_cosmetic_surveys' 
          AND column_name = 'recommendation'
        ) THEN
          ALTER TABLE ai_cosmetic_surveys ADD COLUMN recommendation TEXT;
        END IF;
        
        -- answers 컬럼 추가 (JSONB 타입)
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'ai_cosmetic_surveys' 
          AND column_name = 'answers'
        ) THEN
          ALTER TABLE ai_cosmetic_surveys ADD COLUMN answers JSONB;
        END IF;
      END $;
      
      -- 인덱스 생성
      CREATE INDEX IF NOT EXISTS idx_ai_cosmetic_surveys_created_at ON ai_cosmetic_surveys(created_at);
      CREATE INDEX IF NOT EXISTS idx_ai_cosmetic_surveys_status ON ai_cosmetic_surveys(status);
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: createTableQuery
    });
    
    if (createError) {
      console.log('⚠️ Table creation via RPC failed, trying direct query...');
      
      // RPC가 없으면 직접 raw SQL 실행
      const { error: directError } = await supabase
        .from('ai_cosmetic_surveys')
        .select('count')
        .limit(1);
        
      if (directError && directError.message.includes('relation "ai_cosmetic_surveys" does not exist')) {
        console.log('❌ Table does not exist. Manual creation required.');
        console.log('📋 Please run this SQL in Supabase Dashboard > SQL Editor:');
        console.log(createTableQuery);
        return;
      }
    }
    
    // 2. 샘플 데이터 확인 및 삽입
    const { data: existingData, error: selectError } = await supabase
      .from('ai_cosmetic_surveys')
      .select('count')
      .limit(1);
    
    if (!selectError) {
      console.log('✅ Table exists! Checking for sample data...');
      
      const { data: sampleCheck } = await supabase
        .from('ai_cosmetic_surveys')
        .select('id')
        .eq('name', '테스트사용자1')
        .limit(1);
      
      if (!sampleCheck || sampleCheck.length === 0) {
        console.log('📝 Inserting sample data...');
        
        const { error: insertError } = await supabase
          .from('ai_cosmetic_surveys')
          .insert([
            { name: '테스트사용자1', age: 25, skin_type: '건성', status: 'completed' },
            { name: '테스트사용자2', age: 30, skin_type: '지성', status: 'in_progress' },
            { name: '테스트사용자3', age: 28, skin_type: '중성', status: 'completed' }
          ]);
        
        if (insertError) {
          console.log('⚠️ Sample data insertion failed:', insertError);
        } else {
          console.log('✅ Sample data inserted successfully!');
        }
      } else {
        console.log('✅ Sample data already exists');
      }
    }
    
    console.log('🎉 Table initialization completed successfully!');
    
  } catch (error) {
    console.log('❌ Table initialization error:', error);
    console.log('📋 Manual table creation may be required. Please check Supabase Dashboard.');
  }
}

// 앱 시작 시 테이블 초기화
initializeTable();

// 헬스체크 및 테이블 상태 확인 엔드포인트
app.get("/make-server-44d07f49/health", async (c) => {
  try {
    // 1. 서버 상태 확인
    const serverStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'unknown',
      tableExists: false,
      sampleDataCount: 0
    };

    // 2. 데이터베이스 연결 확인
    try {
      const { data, error } = await supabase
        .from('ai_cosmetic_surveys')
        .select('count')
        .limit(1);
      
      if (!error) {
        serverStatus.database = 'connected';
        serverStatus.tableExists = true;
        
        // 3. 데이터 개수 확인
        const { count } = await supabase
          .from('ai_cosmetic_surveys')
          .select('*', { count: 'exact', head: true });
        
        serverStatus.sampleDataCount = count || 0;
      } else {
        serverStatus.database = 'table_not_found';
        if (error.message.includes('relation "ai_cosmetic_surveys" does not exist')) {
          serverStatus.tableExists = false;
        }
      }
    } catch (dbError) {
      serverStatus.database = 'connection_error';
      console.log('Database health check error:', dbError);
    }

    return c.json({
      success: true,
      ...serverStatus,
      instructions: !serverStatus.tableExists ? {
        message: "테이블이 존재하지 않습니다. 수동으로 생성하세요.",
        sql: `
CREATE TABLE IF NOT EXISTS ai_cosmetic_surveys (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  skin_type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO ai_cosmetic_surveys (name, age, skin_type, status) VALUES 
('테스트사용자1', 25, '건성', 'completed'),
('테스트사용자2', 30, '지성', 'in_progress'),
('테스트사용자3', 28, '중성', 'completed');
        `.trim()
      } : null
    });

  } catch (error) {
    console.log("Health check error:", error);
    return c.json({
      success: false,
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// 설문 데이터 저장 엔드포인트
app.post("/make-server-44d07f49/survey", async (c) => {
  try {
    const body = await c.req.json();
    console.log("Received survey data:", body);

    // 데이터 검증
    if (!body.name || !body.age) {
      console.log("Missing required fields: name or age");
      return c.json({ 
        success: false, 
        error: "이름과 나이는 필수 입력 항목입니다." 
      }, 400);
    }

    // PostgreSQL 테이블에 데이터 삽입
    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .insert({
        name: body.name,
        age: parseInt(body.age),
        skin_type: body.skinType || null,
        status: 'in_progress',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.log("Database error:", error);
      return c.json({ 
        success: false, 
        error: "데이터베이스 오류가 발생했습니다: " + error.message 
      }, 500);
    }
    
    console.log("Survey data saved successfully:", data.id);
    
    return c.json({ 
      success: true, 
      surveyId: data.id.toString(),
      message: "설문 데이터가 성공적으로 저장되었습니다."
    });

  } catch (error) {
    console.log("Error saving survey data:", error);
    return c.json({ 
      success: false, 
      error: "서버 오류가 발생했습니다. 다시 시도해주세요." 
    }, 500);
  }
});

// 설문 데이터 업데이트 엔드포인트 (피부 타입 등 추가 정보)
app.put("/make-server-44d07f49/survey/:surveyId", async (c) => {
  try {
    const surveyIdParam = c.req.param("surveyId");
    const body = await c.req.json();
    
    console.log(`🔄 Updating survey data for surveyId: "${surveyIdParam}"`, body);

    // surveyId 검증 및 변환
    const surveyId = parseInt(surveyIdParam);
    if (isNaN(surveyId) || surveyId <= 0) {
      console.log(`❌ Invalid surveyId format: "${surveyIdParam}"`);
      return c.json({ 
        success: false, 
        error: "잘못된 설문 ID 형식입니다." 
      }, 400);
    }

    // PostgreSQL 테이블 업데이트
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    // 개별 필드 업데이트
    if (body.skinType) updateData.skin_type = body.skinType;
    if (body.status) updateData.status = body.status;
    if (body.answers) updateData.answers = body.answers;

    console.log(`📊 Updating database for surveyId: ${surveyId}`);

    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .update(updateData)
      .eq('id', surveyId)
      .select()
      .single();

    if (error) {
      console.log(`❌ Database update error for surveyId ${surveyId}:`, error);
      return c.json({ 
        success: false, 
        error: `설문 데이터 업데이트 실패: ${error.message}` 
      }, 404);
    }
    
    if (!data) {
      console.log(`❌ No data found for surveyId: ${surveyId}`);
      return c.json({ 
        success: false, 
        error: "설문 데이터를 찾을 수 없습니다." 
      }, 404);
    }
    
    console.log(`✅ Survey data updated successfully for surveyId: ${surveyId}`);
    
    return c.json({ 
      success: true, 
      data: data,
      message: "설문 데이터가 성공적으로 업데이트되었습니다."
    });

  } catch (error) {
    console.log("❌ Error updating survey data:", error);
    return c.json({ 
      success: false, 
      error: "서버 오류가 발생했습니다: " + error.message 
    }, 500);
  }
});

// 설문 데이터 조회 엔드포인트
app.get("/make-server-44d07f49/survey/:surveyId", async (c) => {
  try {
    const surveyIdParam = c.req.param("surveyId");
    console.log(`🔍 Retrieving survey for surveyId: "${surveyIdParam}"`);
    
    // surveyId 검증 및 변환
    const surveyId = parseInt(surveyIdParam);
    if (isNaN(surveyId) || surveyId <= 0) {
      console.log(`❌ Invalid surveyId format: "${surveyIdParam}"`);
      return c.json({ 
        success: false, 
        error: "잘못된 설문 ID 형식입니다." 
      }, 400);
    }
    
    console.log(`📊 Querying database for surveyId: ${surveyId}`);
    
    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .select('*')
      .eq('id', surveyId)
      .single();

    if (error) {
      console.log(`❌ Database query error for surveyId ${surveyId}:`, error);
      return c.json({ 
        success: false, 
        error: `설문 데이터 조회 실패: ${error.message}` 
      }, 404);
    }
    
    if (!data) {
      console.log(`❌ No data found for surveyId: ${surveyId}`);
      return c.json({ 
        success: false, 
        error: "설문 데이터를 찾을 수 없습니다." 
      }, 404);
    }

    console.log(`✅ Survey data found for surveyId ${surveyId}`);

    return c.json({ 
      success: true, 
      data: data 
    });

  } catch (error) {
    console.log("❌ Error retrieving survey data:", error);
    return c.json({ 
      success: false, 
      error: "서버 오류가 발생했습니다: " + error.message 
    }, 500);
  }
});

// 모든 설문 데이터 조회 엔드포인트 (관리자용)
app.get("/make-server-44d07f49/surveys", async (c) => {
  try {
    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.log("Database error:", error);
      return c.json({ 
        success: false, 
        error: "데이터베이스 오류가 발생했습니다: " + error.message 
      }, 500);
    }
    
    return c.json({ 
      success: true, 
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.log("Error retrieving surveys:", error);
    return c.json({ 
      success: false, 
      error: "서버 오류가 발생했습니다." 
    }, 500);
  }
});

// Make.com에서 AI 추천 결과를 받을 엔드포인트
app.post("/make-server-44d07f49/ai-recommendation", async (c) => {
  try {
    console.log("🤖 AI recommendation endpoint called");
    console.log("🔍 Request headers:", c.req.header());
    
    let body;
    try {
      body = await c.req.json();
      console.log("🤖 Received AI cosmetic recipe from Make.com:", body);
    } catch (jsonError) {
      console.log("❌ JSON parsing error:", jsonError);
      return c.json({ 
        success: false, 
        error: "잘못된 JSON 형식입니다: " + jsonError.message 
      }, 400);
    }

    // Make.com에서 보낼 데이터 구조:
    // {
    //   surveyId: "123",
    //   recommendation: JSON.stringify({
    //     recipe: [{ name: "알로에 젤", percentage: 86.5 }, ...],
    //     descriptions: { "알로에 젤": "설명...", ... },
    //     tools: ["플라스틱 비커", ...],
    //     steps: ["단계 1...", ...],
    //     summary: "총평 텍스트...",
    //     storage: "보관 안내..."
    //   })
    // }

    if (!body.surveyId || !body.recommendation) {
      console.log("❌ Missing required fields: surveyId or recommendation");
      return c.json({ 
        success: false, 
        error: "surveyId와 recommendation은 필수 항목입니다." 
      }, 400);
    }

    // 레시피 데이터 검증
    try {
      const recipeData = JSON.parse(body.recommendation);
      
      // 필수 필드 검증
      if (!recipeData.recipe || !Array.isArray(recipeData.recipe)) {
        throw new Error("recipe 배열이 필요합니다");
      }
      
      if (!recipeData.descriptions || typeof recipeData.descriptions !== 'object') {
        throw new Error("descriptions 객체가 필요합니다");
      }
      
      // 레시피 총 퍼센트 검증
      const totalPercentage = recipeData.recipe.reduce((sum: number, item: any) => sum + (item.percentage || 0), 0);
      if (Math.abs(totalPercentage - 100) > 0.1) {
        console.warn(`⚠️ 레시피 총 퍼센트가 100%가 아님: ${totalPercentage}%`);
      }
      
      console.log("✅ Recipe validation passed:", {
        ingredientCount: recipeData.recipe.length,
        totalPercentage: totalPercentage,
        hasSteps: !!recipeData.steps,
        hasSummary: !!recipeData.summary
      });
      
    } catch (validationError) {
      console.log("❌ Recipe validation error:", validationError);
      return c.json({ 
        success: false, 
        error: "잘못된 레시피 데이터 형식입니다: " + validationError.message 
      }, 400);
    }

    // surveyId 검증 및 변환
    const surveyId = parseInt(body.surveyId);
    if (isNaN(surveyId) || surveyId <= 0) {
      console.log(`❌ Invalid surveyId format: "${body.surveyId}"`);
      return c.json({ 
        success: false, 
        error: "잘못된 설문 ID 형식입니다." 
      }, 400);
    }

    // 해당 설문 데이터에 추천 결과 업데이트
    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .update({
        recommendation: body.recommendation,
        status: 'completed_ai',
        updated_at: new Date().toISOString()
      })
      .eq('id', surveyId)
      .select()
      .single();

    if (error) {
      console.log("❌ Database error:", error);
      return c.json({ 
        success: false, 
        error: "설문 데이터를 찾을 수 없습니다: " + error.message 
      }, 404);
    }
    
    console.log("✅ AI cosmetic recipe saved successfully for survey:", body.surveyId);
    
    return c.json({ 
      success: true, 
      data: data,
      message: "맞춤 화장품 레시피가 성공적으로 저장되었습니다."
    });

  } catch (error) {
    console.log("❌ Error saving AI recipe:", error);
    return c.json({ 
      success: false, 
      error: "서버 오류가 발생했습니다. 다시 시도해주세요." 
    }, 500);
  }
});

// 특정 설문의 AI 추천 결과 조회 엔드포인트
app.get("/make-server-44d07f49/recommendation/:surveyId", async (c) => {
  try {
    const surveyIdParam = c.req.param("surveyId");
    console.log(`🔍 Retrieving recommendation for surveyId: "${surveyIdParam}"`);
    
    // surveyId 검증 및 변환
    const surveyId = parseInt(surveyIdParam);
    if (isNaN(surveyId) || surveyId <= 0) {
      console.log(`❌ Invalid surveyId format: "${surveyIdParam}"`);
      return c.json({ 
        success: false, 
        error: "잘못된 설문 ID 형식입니다." 
      }, 400);
    }
    
    console.log(`📊 Querying database for surveyId: ${surveyId}`);
    
    const { data, error } = await supabase
      .from('ai_cosmetic_surveys')
      .select('id, name, age, skin_type, recommendation, status, created_at, updated_at')
      .eq('id', surveyId)
      .single();

    if (error) {
      console.log(`❌ Database query error for surveyId ${surveyId}:`, error);
      return c.json({ 
        success: false, 
        error: `설문 데이터 조회 실패: ${error.message}` 
      }, 404);
    }
    
    if (!data) {
      console.log(`❌ No data found for surveyId: ${surveyId}`);
      return c.json({ 
        success: false, 
        error: "설문 데이터를 찾을 수 없습니다." 
      }, 404);
    }

    console.log(`✅ Survey data found for surveyId ${surveyId}. Has recommendation: ${!!data.recommendation}`);
    
    return c.json({ 
      success: true, 
      data: data,
      hasRecommendation: !!data.recommendation
    });

  } catch (error) {
    console.log("❌ Error retrieving recommendation:", error);
    return c.json({ 
      success: false, 
      error: "서버 오류가 발생했습니다: " + error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);