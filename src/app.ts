
/// <reference path="types/index.d.ts" />
// .envファイルの内容を process.env に読み込む
require('dotenv').config()
import { initDatabase } from './config/seed';
// Express本体を読み込み
const express = require('express');
const app = express();
import { Request, Response } from "express";
// pathモジュール（ファイルパスを扱うため）
const path = require('path')

// import { getConnection } from './config/database';
// .envにPORTがあれば使用し、なければ3000番
const port = process.env.PORT || 3000;

// ★注意★
// 下記は ES Modules（import）構文。
// しかしファイル拡張子が .js で CommonJS(require) を使っているため、
// Node.js では通常使えません。
// → TypeScript または "type":"module" の環境を前提にする必要がある。
import apiRouter from 'route/api';
import webRoute from 'route/web';
import passport from "passport";
import ConfigPassportLocal from 'middleware/passport.local';
import session from 'express-session';
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
// EJS をテンプレートエンジンとして設定
app.set('view engine', 'ejs');

// EJS のテンプレートフォルダを指定
app.set('views', __dirname + '/views');

// JSON形式のリクエストボディを解析するミドルウェア
app.use(express.json());

// form から送信される application/x-www-form-urlencoded を処理
app.use(express.urlencoded({ extended: true }));

app.use(session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000 // ms
  },
  secret: 'a santa at nasa',
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(
    new PrismaClient(),
    {
      checkPeriod: 1 * 24 * 60 * 60 * 1000,  //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  )
  // cookie: { secure: true }
}));


app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.authenticate('session'));

ConfigPassportLocal();

app.use((req, res, next) => {
  res.locals.user = req.user || null; // Pass user object to all views
  next();
});


// ルーティングを設定（web.js 内で app.get などを設定する想定）
webRoute(app);

apiRouter(app);
// 静的ファイル（画像・CSS・JS）を提供する設定
// "./src/public"フォルダ内のファイルをURLから直接アクセス可能にする


initDatabase();

app.use((req, res) => {

  res.render("status/404.ejs")

})



// getConnection();
// サーバーを起動
app.listen(port, () => {
  console.log(`Server running at 12 http://localhost:${port}`);
});
