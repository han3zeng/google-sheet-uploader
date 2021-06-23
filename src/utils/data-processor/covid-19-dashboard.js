const { logger, getLogObject } = require('../create-logger');

// data types
// group1: landing
const TIMESTAMP = 'timestamp';
const STATS = 'stats';
const H1 = 'h1';
// group2: content
const H2 = 'h2';
const PARAGRAPH = 'paragraph';
const IFRAME = 'iframe';
const CAPTION = 'caption';
// group3: more
const MORE = 'more';

// sheet attributes
const TYPE = 'type';
const KEY = 'key';
const LABEL = 'label';
const VALUE = 'value';
const DESKTOP_WIDTH = 'desktopWidth';
const HREF = 'href';
const IMG_URL = 'imgUrl';
const MORE_DATE = 'date';
const MORE_TITLE = 'title';

// group keys
const LANDING = 'landing';
const CONTENT = 'content';
const READ_MORE = 'read_more';

const ATTRIBUTES = [
  TYPE,
  KEY,
  LABEL,
  VALUE,
  DESKTOP_WIDTH,
  HREF,
  IMG_URL,
  MORE_DATE,
  MORE_TITLE
];

const selectGroup = ({ type }) => {
  if (type === TIMESTAMP || type === STATS || type === H1) {
    return LANDING;
  } else if (
    type === H2 ||
    type === PARAGRAPH ||
    type === IFRAME ||
    type === CAPTION
  ) {
    return CONTENT;
  } else {
    return READ_MORE;
  }
};

const getDefaultData = () => {
  return {
    [LANDING]: {},
    [CONTENT]: [],
    [READ_MORE]: []
  };
};

const createElement = ({ row, result }) => {
  const type = row[ATTRIBUTES.indexOf(TYPE)];
  const key = row[ATTRIBUTES.indexOf(KEY)];
  const label = row[ATTRIBUTES.indexOf(LABEL)];
  const value = row[ATTRIBUTES.indexOf(VALUE)];
  const desktopWidth = row[ATTRIBUTES.indexOf(DESKTOP_WIDTH)];
  const href = row[ATTRIBUTES.indexOf(HREF)];
  const imgUrl = row[ATTRIBUTES.indexOf(IMG_URL)];
  const moreDate = row[ATTRIBUTES.indexOf(MORE_DATE)];
  const moreTitle = row[ATTRIBUTES.indexOf(MORE_TITLE)];

  const group = selectGroup({ type });
  if (type === H1) {
    result[group][`${type}`] = value;
  } else if (type === TIMESTAMP) {
    result[group][`${type}_${key}`] = value;
  } else if (type === STATS) {
    result[group][`${type}_${key}`] = {
      value,
      label
    };
  } else if (type === H2 || type === PARAGRAPH || type === CAPTION) {
    result[group].push({
      type,
      value
    });
  } else if (type === IFRAME) {
    result[group].push({
      type,
      value,
      desktopWidth
    });
  } else if (type === MORE) {
    result[group].push({
      type,
      href,
      imgUrl,
      date: moreDate,
      title: moreTitle
    });
  } else {
    logger.log(
      getLogObject({
        filename: 'processor',
        level: 'warning',
        message:
          "undefined content type from google spreadsheet which can't be handle"
      })
    );
  }
  return result;
};

const sheetDataProcessor = ({ rawData = [] }) => {
  if (
    !Array.isArray(rawData) ||
    (Array.isArray(rawData) && rawData.length === 0)
  ) {
    return;
  }
  return rawData.reduce((accumulator, row) => {
    return createElement({ row, result: accumulator });
  }, getDefaultData());
};

module.exports = {
  sheetDataProcessor
};
