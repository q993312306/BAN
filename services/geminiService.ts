import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, AppSettings } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isFailedPrint: {
      type: Type.BOOLEAN,
      description: "True if the image looks like a failed print or spaghetti mess, False if it looks like a digital model or clean print."
    },
    modelName: {
      type: Type.STRING,
      description: "A short descriptive name of the object identified in Chinese."
    },
    materialSuggestion: {
      type: Type.STRING,
      description: "Suggested filament type (PLA, PETG, ABS, etc.) based on geometry or visible characteristics in Chinese."
    },
    summary: {
      type: Type.STRING,
      description: "A brief executive summary of the analysis and recommendation in Chinese."
    },
    categories: {
      type: Type.ARRAY,
      description: "Grouped Bambu Studio settings.",
      items: {
        type: Type.OBJECT,
        properties: {
          categoryName: {
            type: Type.STRING,
            description: "The tab name in Bambu Studio in Chinese (e.g., 质量, 强度, 支撑, 速度, 冷却)."
          },
          settings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "The specific setting name in Bambu Studio in Chinese." },
                value: { type: Type.STRING, description: "The recommended value in Chinese." },
                reason: { type: Type.STRING, description: "Why this value is recommended in Chinese." }
              },
              required: ["name", "value", "reason"]
            }
          }
        },
        required: ["categoryName", "settings"]
      }
    },
    warnings: {
      type: Type.ARRAY,
      description: "Specific warnings about geometry, overhangs, or bed adhesion in Chinese.",
      items: { type: Type.STRING }
    }
  },
  required: ["isFailedPrint", "modelName", "summary", "categories", "warnings", "materialSuggestion"]
};

export const analyzeImage = async (
  base64Image: string, 
  mimeType: string, 
  filament: string,
  settings?: AppSettings
): Promise<AnalysisResult> => {
  try {
    // Note: Using Gemini 2.5 Flash as the backend engine for all requests to ensure reliability 
    // within the provided SDK environment, but strictly adopting the Qwen persona.
    const modelId = "gemini-2.5-flash"; 

    // Use provided temperature or default to 0.4 for balanced precision
    const temperature = settings?.temperature ?? 0.4;

    const prompt = `
      你是一位精通 Bambu Lab 打印机 (X1C, P1S, A1) 和 Bambu Studio 切片软件的 FDM 3D 打印专家工程师。
      你现在以 Qwen (通义千问) 的专家身份进行回答，风格要专业、严谨且富有洞察力。
      
      用户当前使用的耗材是：**${filament}**。请务必基于 ${filament} 材料的物理特性（如热缩性、层粘合力、冷却需求）来调整你的建议。

      请分析提供的图片：
      1. 识别这是数字 3D 模型截图、成功的打印件还是失败的打印件。
      2. 如果是**失败的打印件**，请诊断原因（如平台附着力差、层移、堵头等）并建议修复设置。
      3. 如果是**模型或预览**，请分析其几何形状（悬垂、薄壁、与热床接触面积）。
      
      请使用 **Bambu Studio 的中文术语** 提供具体的参数建议。
      如果相关，请将建议分为以下类别：
      - 质量 (例如：层高、墙生成器)
      - 强度 (例如：墙层数、填充密度、填充图案)
      - 速度 (例如：外墙速度、移动速度 - 仅在需要调整时)
      - 支撑 (例如：启用、类型、阈值角度)
      - 冷却 (例如：部件冷却风扇、辅助风扇 - 特别注意 ${filament} 的冷却需求)
      
      数值要精确 (例如: "0.20mm 标准", "Gyroid", "Tree(auto)")。
      
      所有输出内容必须使用**简体中文**。
    `;

    // Remove header from base64 string if present (data:image/...)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await genAI.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: temperature, 
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    throw error;
  }
};