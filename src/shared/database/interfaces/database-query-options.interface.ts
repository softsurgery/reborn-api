export interface IOptionsObject {
  LOOKUP_DELIMITER?: string;
  RELATION_DELIMITER?: string;
  EXACT?: string;
  NOT?: string;
  CONTAINS?: string;
  IS_NULL?: string;
  GT?: string;
  GTE?: string;
  LT?: string;
  LTE?: string;
  STARTS_WITH?: string;
  ENDS_WITH?: string;
  IN?: string;
  BETWEEN?: string;
  OR?: string;
  CONDITION_DELIMITER?: string;
  VALUE_DELIMITER?: string;
  DEFAULT_LIMIT?: string;
}
export interface IQueryTypeOrm {
  select?: string[];
  relations?: string[];
  where?: object;
  order?: object;
  skip?: number;
  take?: number;
  cache?: boolean;
  search?: string;
}
export interface IQueryObject {
  page?: string;
  limit?: string;
  sort?: string;
  filter?: string;
  select?: string;
  join?: string;
  cache?: string;
  search?: string;
}
export interface ILooseObject {
  [key: string]: unknown;
}
