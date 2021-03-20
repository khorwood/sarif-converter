export interface Report {
    check_type: string;
    results: Results;
    summary: Summary;
}

export interface Results {
    passed_checks: Check[];
    failed_checks: Check[];
    skipped_checks: Check[];
    parsing_errors: string[];
}

export interface Check {
    check_id: string;
    check_name: string;
    check_result: CheckResult;
    code_block: [[number, string]];
    file_path: string;
    file_line_range: number[];
    resource: string;
    check_class: string;
}

export interface CheckResult {
    result: string;
}

export interface Summary {
    passed: number;
    failed: number;
    skipped: number;
    parsing_errors: number;
    checkov_version: string;
}
