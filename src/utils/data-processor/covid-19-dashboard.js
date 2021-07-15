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
const MORE_CATEGORY = 'moreCategory';

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
const SECTION_ID = 'sectionId';
const SECTION_LABEL = 'sectionLabel';
const MORE_ID = 'moreId';

// group keys
const LANDING = 'landing';
const CONTENT = 'content';
const READ_MORE = 'read_more';
const SECTIONS = 'sections';

const ATTRIBUTES = [
  TYPE,
  KEY,
  LABEL,
  VALUE,
  DESKTOP_WIDTH,
  HREF,
  IMG_URL,
  MORE_DATE,
  MORE_TITLE,
  SECTION_ID,
  SECTION_LABEL,
  MORE_ID
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
  const sectionId = row[ATTRIBUTES.indexOf(SECTION_ID)];
  const sectionLabel = row[ATTRIBUTES.indexOf(SECTION_LABEL)];
  const moreId = row[ATTRIBUTES.indexOf(MORE_ID)];

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
  } else if (type === H2) {
    result[group].push({
      type,
      value,
      sectionId,
      sectionContent: []
    });
    if (!result[SECTIONS]) {
      result[SECTIONS] = { [sectionId]: sectionLabel };
    } else {
      result[SECTIONS][sectionId] = sectionLabel;
    }
  } else if (type === PARAGRAPH || type === CAPTION) {
    const targetSection = result[group].find(element => element.sectionId === sectionId);
    if (targetSection) {
      targetSection.sectionContent.push({
        type,
        value
      });
    }
  } else if (type === IFRAME) {
    const targetSection = result[group].find(element => element.sectionId === sectionId);
    if (targetSection) {
      targetSection.sectionContent.push({
        type,
        value,
        desktopWidth
      });
    }
  } else if (type === MORE_CATEGORY) {
    result[group].push({
      id: moreId,
      header: value,
      content: []
    });
  } else if (type === MORE) {
    const targetMoreCategory = result[group].find(element => element.id === moreId);
    targetMoreCategory.content.push({
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
