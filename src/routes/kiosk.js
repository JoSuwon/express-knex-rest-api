import { Router } from 'express';

const db = require('knex')(require('../../knexfile')['development']);
const router = new Router();

// 로그인(유저 검증)
router.get('/:companyId/user', (req, res) => {
  const { companyId } = req.params;
  const { phone } = req.query;
  db
    .select('id', 'phone', 'point', 'hasPassword')
    .from('users')
    .where('phone', phone)
    .where('companyId', companyId)
    .then(([result,]) => {
      if(result) {
        result = Object.assign(result, { hasPassword: result.hasPassword ? true : false });
        res.status(200).json(result);
      } else {
        res.status(400).json({ result: 'not exist' });
      }
    });
});

// 로그인(비밀번호 검증)
router.post('/:id/user/login', (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  db
    .count('id as count')
    .from('users')
    .where('id', id)
    .where('password', password)
    .then(([result,]) => {
      const { count } = result;
      if(count === 1) {
        res.status(200).json({ status: true });
      } else if(count === 0) {
        res.status(400).json({ status: false, error: '비밀번호가 다릅니다' });
      }
    });
});

// 임시비밀번호 설정 및 변경
router.put('/:id/password', (req, res) => {
  const { id } = req.params;
  const { mode, password } = req.body;
  if(mode === 'update') {
    db('users')
      .where('id', id)
      .update('password', password)
      .then((result) => {
        if(result) res.status(200).json({ status: true });
        else res.status(400).json({ error: '회원 조회 실패' });
      });
  } else if(mode === 'forgot') {
    let newPassword = '';
    for(let i=0; i<4; i++) {
      newPassword += Math.floor(Math.random() * 10);
    }
    db('users')
      .where('id', id)
      .update('password', newPassword)
      .then((result) => {
        if(result) res.status(200).json({ status: true, tempPassword: newPassword });
        else res.status(400).json({ error: '회원 조회 실패' });
      });
  }
});

// 회원가입
router.post('/:companyId/user/signup', (req, res) => {
  const { companyId } = req.params;
  const { phone, password } = req.body;
  const hasPassword = password ? true : false;
  db('users')
    .count('id as count')
    .where('phone', phone)
    .then(([{ count }, ]) => {
      if(!count) {
        db('users')
          .insert({ phone, password, companyId, hasPassword })
          .then(([result, ]) => {
            if(result > 0) res.status(200).json({ userId: result });
            else res.status(400).json({ error: '회원가입 실패' });
          });
      }
      else res.status(400).json({ error: '이미 존재하는 회원' });
    });
});

// 모든유저 조회
router.get('/:companyId/allUser', (req, res) => {
  const { companyId } = req.params;
  db('users')
    .select('*')
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    });
});


// 충전 및 사용
router.post('/pay', (req, res) => {
  const { params } = req.body;
  const { request, type, payMethod, companyId, userId, machineId, inputAmount, usePoint, realAmount, appendPoint, eventRate, totalPoint } = params;
  db('history')
    .insert({ request, type, payMethod, companyId, userId, machineId, inputAmount, usePoint, realAmount, appendPoint, eventRate, totalPoint })
    .then(([result, ]) => {
      db('users').select('point').where('id', userId).then(([{ point }, ]) => {
        console.log(point);
        console.log(totalPoint);
        console.log(userId);
        let nowPoint = point;
        db('users').update('point', nowPoint + totalPoint).where('id', userId).then((result) => {
          console.log('result', result);
        });
      });
      db('history').select('*').where('id', result).then(([result, ]) => {
        res.status(200).json(result);
      });
    });
});

// 이용 목록 가져오기
router.get('/user/:userId/list', async (req, res) => {
  const { userId } = req.params;
  const { offset = 0, limit = 20 } = req.query;
  const totalCount = await getTotalCount('history');
  db('history')
    .where('userId', userId)
    .select('type', 'payMethod', 'machineId', 'inputAmount', 'realAmount', 'appendPoint', 'usePoint', 'totalPoint', 'createdAt')
    .then((result) => {
      res.status(200).json({ totalCount, offset, limit, data: result });
    });
});

const getTotalCount = (tableName) => {
  return new Promise((resolve, reject) => {
    db(tableName)
    .count('* as count').then(([{ count }, ]) => {
      resolve(count);
    });
  });
};


export default router;