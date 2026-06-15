import { CSSCategory } from "../../types-css";
import { List } from "lucide-react";

export const generatedContentCountersCategory: CSSCategory = {
    name: "GENERATED CONTENT & COUNTERS",
    icon: List,
    subCategories: [
      {
        name: "Pseudo-element Content",
        properties: [
          { name: "content", values: "normal | none | [ <string> | <image> | <counter> | attr() | open-quote | close-quote | no-open-quote | no-close-quote ]+ | initial | inherit | revert | revert-layer | unset" }
        ]
      },
      {
        name: "Counter Management",
        properties: [
          { name: "counter-reset", values: "none | [ <custom-ident> <integer>? ]+ | reversed( <custom-ident> ) <integer>? | initial | inherit | revert | revert-layer | unset" },
          { name: "counter-increment", values: "none | [ <custom-ident> <integer>? ]+ | initial | inherit | revert | revert-layer | unset" },
          { name: "counter-set", values: "none | [ <custom-ident> <integer>? ]+ | initial | inherit | revert | revert-layer | unset" }
        ]
      }
    ]
  };
