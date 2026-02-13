import { z } from 'zod';

export const productSchema = z.object({
  id : z.string().optional(),
  name: z.string()
    .min(1, "商品名は必須です")
    .max(100, "商品名は100文字以内で入力してください")
    .transform(val => val.trim()), // 前後の空白を除去

  price: z.string() // フォームからは文字列で来るのでstringで受け取る
    .min(1, "価格は必須です")
    .transform(val => {
      const num = Number(val.replace(/[^\d.-]/g, '')); // 数値のみ抽出
      return isNaN(num) ? 0 : num;
    })
    .pipe(
      z.number()
        .min(0, "価格は0以上で入力してください")
        .max(10000000, "価格が大きすぎます")
    ),

  detail_description: z.string()
    .min(10, "詳細説明は10文字以上で入力してください")
    .max(1000, "詳細説明は1000文字以内で入力してください")
    .transform(val => val.trim()),

  short_description: z.string()
    .min(1, "短い説明は必須です")
    .max(200, "短い説明は200文字以内で入力してください")
    .transform(val => val.trim()),

  quantity: z.string() // フォームからは文字列で来るのでstringで受け取る
    .min(1, "数量は必須です")
    .transform(val => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    })
    .pipe(
      z.number()
        .int("数量は整数で入力してください")
        .min(0, "数量は0以上で入力してください")
    ),

  factory: z.enum(["APPLE", "ASUS", "LENOVO", "DELL", "LG", "ACER"], {
    errorMap: () => ({ message: "メーカーを選択してください" })
  }),


  target: z.enum([
    "GAMING",
    "OFFICE",
    "GRAPHIC-DESIGN",
    "LIGHTWEIGHT",
    "BUSINESSMAN"
  ], {
    errorMap: () => ({ message: "ターゲットを選択してください" })
  }),

  image: z.instanceof(File)
    .refine(file => file.size <= 3 * 1024 * 1024, "画像サイズは5MB以下にしてください")
    .refine(file =>
      ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      "JPEGまたはPNG形式の画像を選択してください"
    )
    .optional()
});

export type ProductFormData = z.infer<typeof productSchema>;