const _orderBy = require('lodash/orderBy');

const _ = {
  orderBy: _orderBy
};

const TIME = 'time';
const TITLE = 'title';
const TYPE = 'type';
const TEXT = 'text';
const URL = 'url';
const CAPTION = 'caption';

const KEYS = [TIME, TITLE, TYPE, TEXT, URL, CAPTION];


const TYPES = {
  image: 'IMAGE',
  video: 'VIDEO',
  text: 'TEXT',
  title: 'TITLE'
};

const createElement = ({
  type,
  text,
  url,
  caption
}) => {
  if (type === TYPES.image || type === TYPES.video) {
    return {
      type,
      url,
      caption
    };
  }
  if (type === TYPES.text) {
    return {
      type,
      text
    };
  }
  return undefined;
};

const createBlock = ({
  title,
  time,
  timestamp
}) => {
  return {
    title: title,
    time,
    timestamp
  };
};

function processor (rows) {
  const results = [];
  let content = [];
  let blockIndex = null;
  let block = createBlock({
    title: '',
    time: ''
  });
  rows.forEach((row, index) => {
    if (Array.isArray(row) && row.length !== 0) {
      if (index !== 0) {
        if (row[KEYS.indexOf(TYPE)] === TYPES.title && blockIndex && row[KEYS.indexOf(TIME)] !== blockIndex) {
          block.content = [...content];
          results.push(block);
          blockIndex = row[KEYS.indexOf(TIME)];
          block = createBlock({
            title: row[KEYS.indexOf(TITLE)],
            time: blockIndex,
            timestamp: (new Date(`${blockIndex} GMT+08:00`)).getTime()
          });
          content = [];
        }
        if (!blockIndex && row[KEYS.indexOf(TYPE)] === TYPES.title) {
          blockIndex = row[KEYS.indexOf(TIME)];
          block = createBlock({
            title: row[KEYS.indexOf(TITLE)],
            time: blockIndex,
            timestamp: (new Date(`${blockIndex} GMT+08:00`)).getTime()
          });
        }
        if (row[KEYS.indexOf(TYPE)] !== TYPES.title) {
          const elem = createElement({
            type: row[KEYS.indexOf(TYPE)],
            text: row[KEYS.indexOf(TEXT)],
            url: row[KEYS.indexOf(URL)],
            caption: row[KEYS.indexOf(CAPTION)]
          });
          content.push(elem);
        }
      }
    }
  });
  block.content = [...content];
  results.push(block);
  return _.orderBy(results, (block) => block.timestamp, ['desc']);
}

function keyEventsProcessor (rows) {
  const res = [];
  const TIME = 'time';
  const TITLE = 'title';
  const TYPE = 'TYPE';
  const keys = [TIME, TITLE, TYPE];
  rows.forEach((row, index) => {
    if (index !== 0) {
      res.push({
        time: row[keys.indexOf(TIME)],
        timestamp: (new Date(`${row[keys.indexOf(TIME)]} GMT+08:00`)).getTime(),
        title: row[keys.indexOf(TITLE)],
        type: row[keys.indexOf(TYPE)]
      });
    }
  });
  return _.orderBy(res, (block) => block.timestamp, ['desc']);
}

module.exports = {
  processor,
  keyEventsProcessor
};
