export interface DataTablesResponse {
    all: number,
    call_false: number,
    call_true:number,

    current_page: number,
    data: any[],
    first_page_url: string,
    from: number,
    last_page: number,
    per_page: number,
    to: number,
    total: number
}
