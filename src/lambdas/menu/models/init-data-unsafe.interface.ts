export interface InitDataUnsafe {
  query_id: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    language_code: string;
    allows_write_to_pm: boolean;
  };
  auth_date: string;
  hash: string;
}
