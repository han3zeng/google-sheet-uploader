const _orderBy = require('lodash/orderBy');

const _ = {
  orderBy: _orderBy
};

const TIME = 'time';
const TITLE = 'title';
const TYPE = 'type';
const CONTENT = 'content';
const URL = 'url';
const CAPTION = 'caption';
const WHO = 'who';

const KEYS = [TIME, TYPE, TITLE, CONTENT, URL, CAPTION, WHO];

// Type:
// 1. TEXT
// - strong
// - link
// 2. IMAGE
// - caption
// 3. FURTHERLINK
// 4. EMBEDDEDVIDEO
// 5. EMBEDDEDPOST
// 6. VIDEO
// 7. QUOTE
// 8. TIME

const TYPES = {
  text: 'TEXT',
  image: 'IMAGE',
  furtherLink: 'FURTHERLINK',
  embeddedVideo: 'EMBEDDEDVIDEO',
  embeddedPost: 'EMBEDDEDPOST',
  video: 'VIDEO',
  quote: 'QUOTE',
  time: 'TIME'
};

const createElement = ({
  type,
  content,
  url,
  caption,
  who
}) => {
  if (type === TYPES.text) {
    return {
      type,
      content
    };
  }
  if (type === TYPES.image || type === TYPES.video) {
    return {
      type,
      url,
      caption
    };
  }
  if (type === TYPES.furtherLink) {
    return {
      type,
      content,
      url
    };
  }
  if (type === TYPES.embeddedVideo || type === TYPES.embeddedPost) {
    return {
      type,
      content
    };
  }
  if (type === TYPES.quote) {
    return {
      type,
      url,
      content,
      who
    };
  }
  return null;
};

const createBlock = ({
  time,
  timestamp,
  title
}) => {
  return {
    time,
    timestamp,
    title
  };
};

function processor (rows) {
  const results = [];
  let content = [];
  let blockIndex = null;
  let block = createBlock({
    time: ''
  });
  rows.forEach((row, index) => {
    if (Array.isArray(row) && row.length !== 0) {
      if (index !== 0) {
        if (row[KEYS.indexOf(TYPE)] === TYPES.time && blockIndex && row[KEYS.indexOf(TIME)] !== blockIndex) {
          block.content = [...content];
          results.push(block);
          blockIndex = row[KEYS.indexOf(TIME)];
          block = createBlock({
            time: blockIndex,
            timestamp: (new Date(`${blockIndex} GMT+08:00`)).getTime(),
            title: row[KEYS.indexOf(TITLE)]
          });
          content = [];
        } else if (!blockIndex && row[KEYS.indexOf(TYPE)] === TYPES.time) {
          blockIndex = row[KEYS.indexOf(TIME)];
          block = createBlock({
            time: blockIndex,
            timestamp: (new Date(`${blockIndex} GMT+08:00`)).getTime(),
            title: row[KEYS.indexOf(TITLE)]
          });
        } else if (row[KEYS.indexOf(TYPE)] !== TYPES.time) {
          const elem = createElement({
            type: row[KEYS.indexOf(TYPE)],
            content: row[KEYS.indexOf(CONTENT)],
            url: row[KEYS.indexOf(URL)],
            caption: row[KEYS.indexOf(CAPTION)],
            who: row[KEYS.indexOf(WHO)]
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
  const TEXT = 'text';
  const keys = [TIME, TEXT];
  rows.forEach((row, index) => {
    if (index !== 0) {
      res.push({
        time: row[keys.indexOf(TIME)],
        timestamp: (new Date(`${row[keys.indexOf(TIME)]} GMT+08:00`)).getTime(),
        text: row[keys.indexOf(TEXT)]
      });
    }
  });
  return _.orderBy(res, (block) => block.timestamp, ['desc']);
}

module.exports = {
  processor,
  keyEventsProcessor
};
