/**
 * 0埋めした値に変換
 * @param {Number} val
 * @returns {String} 00埋め
 */
export const toDigit = (val) => {
  if (val === null || val === undefined) {
    return ''
  }
  return val.toString().padStart(2, '0')
}
