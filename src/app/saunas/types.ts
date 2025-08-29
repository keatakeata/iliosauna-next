export interface ModalSection {
  type: string;
  title?: string;
  subtitle?: string;
  text?: string;
  items?: any[];  // Can be array of objects with various properties
  list?: string[];
  points?: string[];
  specs?: string[];
  features?: string[];
  problems?: string[];
  problem?: string[] | {title: string; items: Array<{title: string; text: string}>};  // Support both formats
  solution?: string[] | {title: string; items: Array<{title: string; text: string}>};
  image?: string;
  images?: string[] | Array<{src: string; caption: string}>;  // Support both formats
  caption?: string;
  author?: string;
  appStore?: string;
  googlePlay?: string;
  steps?: Array<{title: string; description: string}> | string[];
  content?: Array<{
    subtitle: string;
    text: string;
    image?: string;
  }>;
  columns?: Array<{
    title: string;
    items: string[];
  }>;
}

export interface ModalContentItem {
  title: string;
  subtitle: string;
  mainImage?: string;
  gallery?: string[];
  award?: string;
  awardText?: string;
  sections: ModalSection[];
}

export interface ModalContentMap {
  structural: ModalContentItem;
  doors: ModalContentItem;
  flooring: ModalContentItem;
  lighting: ModalContentItem;
  heater: ModalContentItem;
  control: ModalContentItem;
  gauge: ModalContentItem;
  timer: ModalContentItem;
  hooks: ModalContentItem;
}