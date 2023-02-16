import {category} from './assets';

/**
 * Add suffix to date number, ex 1st 2nd 3rd
 * @param i
 */
export function ordinal_suffix_of(i) {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + 'st';
  }
  if (j === 2 && k !== 12) {
    return i + 'nd';
  }
  if (j === 3 && k !== 13) {
    return i + 'rd';
  }
  return i + 'th';
}

/**
 * Truncate number from 1000 to 1k and 1000000 to 1m
 * @param i
 */
export function numberTruncate(i) {
  if (i < 1000) {
    return i + '';
  } else if (i < 1000000) {
    const truncate = Math.floor(i / 1000);
    return truncate + 'k';
  } else if (i < 1000000000) {
    const truncate = Math.floor(i / 1000000);
    return truncate + 'm';
  }

  return 'N/A';
}

/**
 * Get Category asset based on Category name
 * @param categoryName
 */
export function getCategoryAsset(categoryName) {
  switch (categoryName.toLowerCase()) {
    case 'sports'.toLowerCase():
      return category.sports;
    case 'change'.toLowerCase():
      return category.science;
    case 'culture'.toLowerCase():
      return category.body_soul;
    case 'nightlife'.toLowerCase():
      return category.nightlife;
    case 'future'.toLowerCase():
      return category.music;
    case 'drama'.toLowerCase():
      return category.drama;
    case 'mind'.toLowerCase():
      return category.humanities;
    case 'the arts & music'.toLowerCase():
      return category.art;
    default:
      return null;
  }
}
