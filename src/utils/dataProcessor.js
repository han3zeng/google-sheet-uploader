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

const KEYS = [TIME, TITLE, TYPE, CONTENT, URL, CAPTION];


const TYPES = {
  image: 'IMAGE',
  video: 'VIDEO',
  text: 'TEXT',
  title: 'TITLE'
};

const createElement = ({
  type,
  content,
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
      content
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

/**
 *
 * @param {Object[]} results - The block of blocklists.
 * @param {} results[].dateTime -
 * @param {Object[]} block - the block
 * @param {string} block.dateTime - dateTime of block
 * @param {string} employees[].department - The employee's department.
 */
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
            timestamp: (new Date(blockIndex)).getTime()
          });
          content = [];
        }
        if (!blockIndex && row[KEYS.indexOf(TYPE)] === TYPES.title) {
          blockIndex = row[KEYS.indexOf(TIME)];
          block = createBlock({
            title: row[KEYS.indexOf(TITLE)],
            time: blockIndex,
            timestamp: (new Date(blockIndex)).getTime()
          });
        }
        if (row[KEYS.indexOf(TYPE)] !== TYPES.title) {
          const elem = createElement({
            type: row[KEYS.indexOf(TYPE)],
            content: row[KEYS.indexOf(CONTENT)],
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

module.exports = {
  processor
};
