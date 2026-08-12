import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper to initialize Gemini safely
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY eksik. Lütfen ortam değişkenlerini kontrol edin.');
    }
    return new GoogleGenAI({ apiKey });
  };

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'CepteModa API' });
  });

  // API Route: AI Product Analysis (Auto title, category, brand, condition, description, suggested price)
  app.post('/api/ai/analyze-product', async (req, res) => {
    try {
      const { title, imageBase64, categoryPrompt } = req.body;
      const ai = getAi();

      const prompt = `Sen Türkiye'nin en popüler ikinci el moda pazaryerinin (Dolap/Gardrops benzeri) yapay zeka ürün uzmanısın.
Kullanıcının eklemek istediği kıyafet/moda ürünü için şu bilgileri Türkçe olarak JSON formatında üret:
1. "suggestedTitle": Ürün için çekici, SEO uyumlu ve öz kısa başlık (örn: "Zara Siyah Hakiki Deri Ceket - S Beden")
2. "suggestedCategory": En uygun kategori ("Kadın", "Erkek", "Çocuk", "Lüks", "Ayakkabı", "Çanta", "Aksesuar")
3. "suggestedBrand": Marka tahmini (Zara, Mango, Nike, Adidas, Gucci, LCW, Stradivarius, Pull&Bear, Massimo Dutti)
4. "suggestedCondition": "Yeni & Etiketli", "Az Kullanılmış" veya "Makul Durumda"
5. "estimatedPrice": İkinci el piyasasına göre uygun önerilen satış fiyatı (TL cinsinden tamsayı, örn: 450)
6. "originalPrice": Tahmini sıfır mağaza fiyatı (TL cinsinden tamsayı, örn: 1250)
7. "autoDescription": Detaylı, ilgi çekici ve satışı kolaylaştıracak açıklama metni.

Kullanıcı Girdisi: "${title || categoryPrompt || 'Şık moda ürünü'}"

Sadece geçerli bir JSON yanıtı döndür:
{
  "suggestedTitle": "...",
  "suggestedCategory": "...",
  "suggestedBrand": "...",
  "suggestedCondition": "...",
  "estimatedPrice": 450,
  "originalPrice": 1250,
  "autoDescription": "..."
}`;

      let contents: any[] = [prompt];

      if (imageBase64 && imageBase64.startsWith('data:image')) {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        contents = [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg',
            },
          },
          prompt,
        ];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'AI analizi yapılırken bir hata oluştu.' 
      });
    }
  });

  // API Route: AI Fashion Advisor & Price Negotiator
  app.post('/api/ai/fashion-assistant', async (req, res) => {
    try {
      const { userMessage, contextProduct } = req.body;
      const ai = getAi();

      const systemPrompt = `Sen CepteModa ikinci el moda platformunun akıllı moda asistanısın.
Adın: "CepteModa AI Asistanı".
Amacın: Kullanıcılara ürün seçimi, kombin önerileri, pazarlık ve teklif verme stratejisi, kargo süreci ve alıcı güvencesi hakkında Türkçe profesyonel ve samimi bilgi vermektir.

İncelenen Ürün Detayı (Varsa):
${contextProduct ? JSON.stringify(contextProduct) : 'Genel Moda Sorusu'}

Kullanıcının Mesajı: "${userMessage}"

Lütfen samimi, moda bilgisi yüksek, kısa ve öz yanıt ver. Ayrıca kullanıcının tıklayabileceği 2 hızlı yanıt önerisi üret.
JSON Formatı:
{
  "reply": "Kullanıcıya vereceğin samimi yanıt...",
  "quickSuggestions": ["Bu fiyata teklif verilmeli mi?", "Nasıl kombinlenir?"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [systemPrompt],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error('Gemini Assistant Error:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'AI Asistan yanıtı alınamadı.' 
      });
    }
  });

  // Serve static files or Vite dev middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CepteModa server listening on http://localhost:${PORT}`);
  });
}

startServer();
