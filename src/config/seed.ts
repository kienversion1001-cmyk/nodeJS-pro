import { prisma } from 'config/client';
import e from 'express';
import { hashPassword } from 'service/user.service';

const initDatabase = async () => {
    // Database initialization logic here
    const count = await prisma.user.count();
    const countRole = await prisma.role.count();
    const password = await hashPassword('123456');
    const countProduct = await prisma.product.count();

    if (countRole === 0) {
        await prisma.role.createMany({
            data: [
                {
                    name: "ADMIN",
                    description: "Administrator with full access"

                },

                {
                    name: "USER",
                    description: "Regular user with limited access"
                }
            ],
        });

    }


    const adminRole = await prisma.role.findFirst({
        where: { name: "ADMIN" },
    });

    if (count === 0) {
        await prisma.user.createMany({
            data: [
                {
                    username: "tanaka@gmail.com",
                    password: password,
                    fullName: "田中 太郎",
                    address: "Tokyo",
                    phone: "09011110000",
                    accountType: "ADMIN",
                    avatar: null,
                    roleId: adminRole.id
                },
                {
                    username: "suzuki@gmail.com",
                    password: password,
                    fullName: "鈴木 次郎",
                    address: "Osaka",
                    phone: "09022220000",
                    accountType: "ADMIN",
                    avatar: null,
                    roleId: adminRole.id
                },
                {
                    username: "yamada@gmail.com",
                    password: password,
                    fullName: "山田 花子",
                    address: "Nagoya",
                    phone: "09033330000",
                    
                    accountType: "ADMIN",
                    avatar: null,
                    roleId: adminRole.id
                }
            ],
        });

    }


    if (countProduct === 0) {
        const products = [
            {
                name: "Laptop Asus TUF Gaming",
                price: 17490000,
                detailDesc: "ASUS TUF Gaming F15 FX506HF HN017W は、低価格ながら非常に強力なゲーミングノートPCです。第11世代 Intel プロセッサー、RTX 20 シリーズのグラフィックスカードに加え、16GB RAM を標準搭載しており、アップグレードせずとも優れたパフォーマンスを発揮します。",
                shortDesc: " Intel, Core i5, 11400H",
                quantity: 100,
                factory: "ASUS",
                target: "GAMING",
                image: "1711078092373-asus-01.png"
            },
            {
                name: "Laptop Dell Inspiron 15",
                price: 15490000,
                detailDesc: "Dell Inspiron 15 N3520 は、最新の Intel Core i5 1235U プロセッサーと 16GB RAM を搭載した高性能ノートPCです。複数の作業を同時に行う際でもスムーズに動作し、仕事の効率を大幅に向上させることができます。",
                shortDesc: "i5 1235U/16GB/512GB/15.6\"FHD",
                quantity: 200,
                factory: "DELL",
                target: "OFFICE",
                image: "1711078452562-dell-01.png"
            },
            {
                name: "Lenovo IdeaPad Gaming 3",
                price: 19500000,
                detailDesc: "Lenovo は、シンプルでスタイリッシュなデザインと強力なパフォーマンスを兼ね備えた新世代のゲーミングノートを発売しました。デュアルファン搭載の冷却システムにより、ゲーム中でも温度をしっかり管理し安定した動作を維持します。",
                shortDesc: " i5-10300H, RAM 8G",
                quantity: 150,
                factory: "LENOVO",
                target: "GAMING",
                image: "1711079073759-lenovo-01.png"
            },
            {
                name: "Asus K501UX",
                price: 11900000,
                detailDesc: "金属デザインによる高級感と冷却性を楽しめるモデル。日常のコンピューティングニーズを満たすために設計された ASUS K シリーズは、ミニマルかつ軽量、そして非常に薄型で、スタイリッシュなメタル調の仕上げが特徴です。",
                shortDesc: "VGA NVIDIA GTX 950M- 4G",
                quantity: 99,
                factory: "ASUS",
                target: "GRAPHIC-DESIGN",
                image: "1711079496409-asus-02.png"
            },
            {
                name: "MacBook Air 13",
                price: 17690000,
                detailDesc: "過去最高クラスの性能を持つ MacBook Air が登場。新しい Apple M1 チップにより、従来を大幅に超えるパフォーマンスを発揮します。重い作業もこなせるパワーと、驚異的なバッテリー持続時間を実現しています。",
                shortDesc: "Apple M1 GPU 7 コア",
                quantity: 99,
                factory: "APPLE",
                target: "GAMING",
                image: "1711079954090-apple-01.png"
            },
            {
                name: "Laptop LG Gram Style",
                price: 31490000,
                detailDesc: "14.0インチ、2880 x 1800 ピクセル、OLED、90Hz の美しいディスプレイを搭載した LG Gram Style。鮮明で豊かな色彩表現と軽量デザインで、ビジネスからクリエイティブ作業まで幅広く活躍します。",
                shortDesc: "Intel Iris Plus Graphics",
                quantity: 99,
                factory: "LG",
                target: "BUSINESSMAN",
                image: "1711080386941-lg-01.png"
            },
            {
                name: "MacBook Air 13",
                price: 24990000,
                detailDesc: "革新的なデザインだけでなく、MacBook Air M2 2022 は M2 チップにより圧倒的な性能を実現しています。最大 18 時間のバッテリー、Liquid Retina ディスプレイ、進化したカメラとオーディオシステムを備えています。",
                shortDesc: "Apple M2 GPU 8 コア",
                quantity: 99,
                factory: "APPLE",
                target: "LIGHTWEIGHT",
                image: "1711080787179-apple-02.png"
            },
            {
                name: "Laptop Acer Nitro",
                price: 23490000,
                detailDesc: "Acer Nitro Gaming AN515-58-769J は、Nitro 5 シリーズで高評価を得てきた前モデルをさらに進化させたゲーミングノートPCです。Intel Core i7 12700H と RTX 3050 を搭載し、高負荷ゲームも快適にプレイできます。",
                shortDesc: "AN515-58-769J i7 12700H",
                quantity: 99,
                factory: "ACER",
                target: "OFFICE",
                image: "1711080948771-acer-01.png"
            },
            {
                name: "Laptop Acer Nitro V",
                price: 26999000,
                detailDesc: "15.6インチ FHD IPS、144Hz の滑らかなディスプレイを搭載。Acer ComfyView LED バックライトで目に優しく、ゲームや動画視聴に最適です。",
                shortDesc: "NVIDIA GeForce RTX 4050",
                quantity: 99,
                factory: "ASUS",
                target: "LIGHTWEIGHT",
                image: "1711081080930-asus-03.png"
            },
            {
                name: "Laptop Dell Latitude 3420",
                price: 21399000,
                detailDesc: "Dell Inspiron N3520 は、日常の仕事に最適なノートPCです。Intel Core i5 第12世代プロセッサー、15.6インチ Full HD 120Hz の大画面、耐久性のあるデザインにより、場所を問わず快適に作業できます。",
                shortDesc: "Intel Iris Xe Graphics",
                quantity: 99,
                factory: "DELL",
                target: "BUSINESSMAN",
                image: "1711081278418-dell-02.png"
            }
        ];

        await prisma.product.createMany({
            data: products
        });
    }


    if (countRole !== 0 && count !== 0) {
        {
            console.log("Database already initialized.");
        }
    }

}

export { initDatabase };