import { TIMEOUT_SEC } from "./config.js";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
export const AJAX = async function (
  url,
  uploadData = undefined,
  contentType = undefined
) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": contentType,
          },
          body: contentType === "application/json"
          ? JSON.stringify(uploadData)
          : new URLSearchParams(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
export const getTotalNutrientAmount = function (ingredientsArr, nutrient) {
  return ingredientsArr
    .map(
      (ing) =>
        ing.nutrition?.nutrients.find(
          (nutr) => nutr.name === nutrient[0].toUpperCase() + nutrient.slice(1)
        )?.amount ?? 0
    )
    .reduce((acc, ingNutr) => acc + ingNutr, 0);
};
