
/// <reference path="types/index.d.ts" />

require('dotenv').config()
import { initDatabase } from './config/seed';

const express = require('express');
const app = express();
import { Request, Response } from "express";

const path = require('path')


const port = process.env.PORT || 3000;


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

//confic static files
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



initDatabase();

app.use((req, res) => {

  res.render("status/404.ejs")

})



// getConnection();
// サーバーを起動
app.listen(port, () => {
  console.log(`Server running at 12 http://localhost:${port}`);
});
