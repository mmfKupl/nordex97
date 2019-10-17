export class Category {
  IDCategory: number;
  Expand: null | number;
  ExpandId: null | number;
  Sub: boolean;
  Title: string;
  Subs?: Category[];
}
