import { CSSSubCategory } from "../../../../types-css";

export const countersGroup: CSSSubCategory = {
  name: "Counters",
  properties: [
    {
      name: "counter-reset",
      values:
        "none | [<custom-ident> <integer>?]+ | reversed(<custom-ident>) <integer>? | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "counter-increment",
      values:
        "none | [<custom-ident> <integer>?]+ | initial | inherit | revert | revert-layer | unset",
    },
    {
      name: "counter-set",
      values:
        "none | [<custom-ident> <integer>?]+ | initial | inherit | revert | revert-layer | unset",
    },
  ],
};
