
export interface CSSProperty {
  name: string;
  values: string;
  note?: string;
}

export interface CSSSubCategory {
  name: string;
  properties: CSSProperty[];
}

export interface CSSCategory {
  name: string;
  icon: any;
  subCategories: CSSSubCategory[];
}
