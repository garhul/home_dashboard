module.exports = [
  {
    name: 'Living lights at night',
    rule: '0 17 * * *',
    topics: ['living/lamp/', 'living/desk/'],
    payload: [
      '{"cmd":"fx", payload:"3"}',
      '{"cmd":"fx", payload:"2"}',
    ],
  },
  {
    name: 'Phone alarm 10 am in the morning',
    rule: '0 10 * * 1-5',
    topics: ['living/phone'],
    payload: ['{"cmd": "ring"}'],
  },
];
