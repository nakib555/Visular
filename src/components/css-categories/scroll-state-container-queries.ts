import { CSSCategory } from "../../types-css";
import { ZoomIn } from "lucide-react";

export const scrollStateContainerQueriesCategory: CSSCategory = {
    name: "SCROLL-STATE CONTAINER QUERIES",
    icon: ZoomIn,
    subCategories: [
      {
        name: "Container Query & Name",
        properties: [
          { name: "container-type", values: "normal | size | inline-size | initial | inherit | revert | revert-layer | unset" },
          { name: "container-name", values: "none | <custom-ident>+ | initial | inherit | revert | revert-layer | unset" },
          { name: "container", values: "<container-name> [ / <container-type> ]? | initial | inherit | revert | revert-layer | unset" }
        ]
      }
    ]
  };
