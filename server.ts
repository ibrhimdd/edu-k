import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization for Google GenAI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Programming Tutor Endpoint
app.post("/api/ai/tutor", async (req, res) => {
  const { 
    mode = "hint", // 'hint' | 'debug' | 'rubric' | 'explain'
    projectTitle = "", 
    problemStatement = "", 
    code = "", 
    userQuestion = "",
    studentRole = "مبرمج",
    experimentalGroup = "individual" 
  } = req.body;

  const ai = getGeminiClient();

  if (!ai) {
    // Intelligent pedagogical fallback when API key is not yet configured
    let fallbackResponse = "";
    if (mode === "hint") {
      fallbackResponse = `💡 **توجيه سقراطي لمشروع بايثون (${projectTitle || 'المشروع الحالي'}):**\n\n1. ابدأ بالتأكد من تعريف المتغيرات بأسماء واضحة ومباشرة (مثل: total, average).\n2. تأكد من شروط الجمل الشرطية (if, elif, else) وصحة المسافات البادئة (Indentation).\n3. في الحلقات التكرارية، استخدم دالة range() أو حلقة for-in للمرور على القوائم.\n\n*جرّب الآن طباعة مخرجات وسيطة عبر دالة print() لمتابعة تدفق القيم خطوة بخطوة.*`;
    } else if (mode === "debug") {
      fallbackResponse = `🔍 **فحص الأخطاء والمنطق البرمجي في بايثون:**\n\n- تأكد من وجود النقطتين الرأسيتين \`:\` في نهاية أسطر الدوال (def) والجمل الشرطية (if/elif/else) وحلقات التكرار (for/while).\n- راجع المسافات البادئة (4 مسافات) لكل كتلة برمجية (IndentationError).\n- تأكد من صحة أسماء المتغيرات والدوال ومطابقتها لحساسية الأحرف في بايثون.`;
    } else if (mode === "rubric") {
      fallbackResponse = `📐 **تقييم المعايير السبعة لمشروع بايثون (Rubric Check):**\n\n- **تحليل المشكلة**: هل حددت بدقة مدخلات ومخرجات دالة بايثون؟\n- **صحة الكود (Correctness)**: هل يجتاز البرنامج جميع حالات الاختبار بنجاح؟\n- **جودة التوثيق**: احرص على كتابة تعليقات توضيحية وتوثيق Docstrings أعلى دوال بايثون توضح وظيفتها ومدخلاتها ومخرجاتها.`;
    } else {
      fallbackResponse = `⚡ **تفسير الخوارزمية وتسلسل الخطوات في بايثون:**\n\nالخوارزمية تسير وفق الخطوات التالية:\n1. استقبال المدخلات والتحقق من صحتها.\n2. معالجة البيانات عبر الجمل الشرطية والدوال المدمجة في بايثون.\n3. صياغة المخرجات وإرجاعها كـ dict أو طباعتها منسقة عبر print و f-strings.`;
    }

    return res.json({
      success: true,
      mode,
      response: fallbackResponse,
      source: "pedagogical_engine"
    });
  }

  try {
    const systemInstruction = `أنت "المعلم والموجه الذكي لتعليم لغة بايثون" (AI Python Tutor) في بيئة تعليمية إلكترونية قائمة على المشروعات (PBL).
هدفك مساعدة الطالب على التعلم الذاتي وحل المشكلات البرمجية بلغة بايثون 3 (Python 3.x) باتباع المنهج السقراطي (Socratic Method).
القواعد البيداغوجية الصارمة:
1. لا تعطِ الحل الكامل النهائي بشكل مباشر إلا إذا كان السؤال عن صيغة دالة محددة. بدلاً من ذلك، قدم تلميحات وتساؤلات توجه تفكير الطالب خطوة بخطوة في لغة بايثون.
2. وجه الطالب وفق معايير التقييم السبعة (Rubric): تحليل المشكلة، تصميم الخوارزمية، سلامة البناء البرمجي ومحاذاة بايثون (Indentation & Syntax)، صحة النتائج (Correctness)، كفاءة الكود ونظافته (PEP 8)، تغطية حالات الاختبار، والتوثيق والتعليقات (Docstrings).
3. التزم باللغة العربية الواضحة والمشجعة تعليمياً.
4. إذا كان الطالب في المجموعة التشاركية ودوره "${studentRole}"، وجهه وفق مسؤوليات هذا الدور (تحليل، تصميم، كود، اختبار).`;

    let prompt = `معلومات المشروع:
العنوان: ${projectTitle}
وصف المشكلة: ${problemStatement}
لغة البرمجة: Python 3
دور الطالب: ${studentRole}
نمط التعلم: ${experimentalGroup === 'collaborative' ? 'مجموعة تشاركية' : 'تعلم فردي'}

الكود الحالي للطالب:
\`\`\`python
${code || '# لم يتم كتابة كود بايثون بعد'}
\`\`\`

الطلب المطلوب من الطالب (${mode}):
${userQuestion || 'قدم لي توجيهاً مناسباً للخطوة التالية في هذا المشروع.'}

نوع الإرشاد المطلوب: ${mode === 'hint' ? 'تلميح سقراطي وتوجيه خطوي' : mode === 'debug' ? 'تحليل الأخطاء واقتراح معالجتها' : mode === 'rubric' ? 'مراجعة الكود وفق معايير الـ Rubric' : 'شرح وتبسيط الخوارزمية'}`;

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const outputText = geminiResponse.text || "عذراً، لم أتمكن من معالجة الطلب حالياً. يرجى المحاولة مرة أخرى.";

    res.json({
      success: true,
      mode,
      response: outputText,
      source: "gemini"
    });
  } catch (error: any) {
    console.error("Gemini Tutor Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "حدث خطأ أثناء معالجة استشارة المساعد الذكي.",
      fallback: "تأكد من شروط التحقق من صحة المدخلات واختبر البرنامج مع قيم متنوعة للتأكد من خلوه من الأخطاء."
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduCode PBL Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
