import { CSSSubCategory } from "../../../../types-css";

export const rubyQuotesGroup: CSSSubCategory = {
  name: "Ruby & Quotes",
  properties: [
    {
      name: "ruby-position",
      values:
        "over | under | inter-character | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "ruby-align",
      values:
        "start | center | space-between | space-around | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "quotes",
      values:
        "none | auto | [ <string> <string> ]+ | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
