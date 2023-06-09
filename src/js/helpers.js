import { TIMEOUT_SEC } from './config';

// export const getJson = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw Error(`${data.message}${res.status}`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
/**
 * ajaxJson(url,method, payload='')
 * @param {String} url - AJAX url  Api-key? required for 'POST' and 'DELETE' method
 * @param {String} method
 * @param {Obj} payload default: ''
 * @returns {Object} data Object
 */
export const ajaxJson = async function (url, method, payload = '') {
  try {
    const fetchPro = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      ...((method === 'POST' && { body: JSON.stringify(payload) }) || ''),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();

    if (!res.ok)
      throw new Error(
        `something go wrong AJAX message: ${data.message}/CODE:${res.status}`
      );
    return data;
  } catch (error) {
    throw error;
  }
};
