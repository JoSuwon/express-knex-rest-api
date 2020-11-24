import express, { urlencoded } from 'express';
// const express = require('express');
// const { urlencoded } = require('express');


import UserRoute from '@/routes/user';
import AdminRoute from '@/routes/admin';
import KioskRoute from '@/routes/kiosk';
import knex from 'knex';
// const knex = require('knex');


const app = express();

// express middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//   req.user = 2;
//   next();
// });

// app.use(
//   '/user',
//   (req, res, next) => {
//     req.user = 'tester';
//     next();
//   },
//   UserRoute
// );

// app.use('/admin', AdminRoute);

app.use('/kiosk', KioskRoute);

app.listen(process.env.PORT, () => {
  console.log('server is running');
});
