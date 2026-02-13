// src/index.ts
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();

async function main() {
  // Create: ユーザー作成
  const alice = await prisma.user.create({
    data: {
      
      name: 'Alice',
      email: 'alice@example.com',
      address: '123 Main St',
    
    },
    
  });
  console.log('Created user:', alice);

  // Read: 公開済みの投稿一覧
  

  // Update: 下書きを公開に
 
  // Delete: ユーザーとその投稿を削除（cascadeではないため手動削除）

}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });