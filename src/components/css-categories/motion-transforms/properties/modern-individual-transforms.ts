import { CSSSubCategory } from "../../../../types-css";

export const modernIndividualTransformsGroup: CSSSubCategory = {
  name: "Modern Individual Transforms",
  properties: [
    {
      name: "translate",
      values:
        "none | <length> | <percentage> | <length-percentage> <length-percentage> [<length>] (e.g. 10px 20px)",
    },
    {
      name: "rotate",
      values:
        "none | <angle> (e.g. 45deg, 1.5rad) | x <angle> | y <angle> | z <angle> | <number> <number> <number> <angle>",
    },
    {
      name: "scale",
      values:
        "none | <number> | <percentage> | <number-percentage> <number-percentage> [<number>] (e.g. 1.5, 120% 80%)",
    },
  ],
};
