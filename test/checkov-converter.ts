import test from 'ava';
import { Log } from 'sarif';
import CheckovConverter from '../src/checkov/checkov-converter';
import { Report } from '../src/checkov/checkov-report';

const report: Report = {
    check_type: 'terraform',
    results: {
        passed_checks: [],
        failed_checks: [{
            check_id: 'CHECK_ID',
            check_name: 'Check name',
            check_result: {
                result: 'ERROR'
            },
            code_block: [
                [1, 'line of code']
            ],
            file_path: '/src/file.tf',
            file_line_range: [
                1, 1
            ],
            resource: 'resource',
            check_class: 'check.class'
        }],
        skipped_checks: [],
        parsing_errors: []
    },
    summary: {
        checkov_version: '1.0.0',
        passed: 0,
        failed: 1,
        skipped: 0,
        parsing_errors: 0
    }
};

test('converts checkov report to sarif', t => {
    const converter = new CheckovConverter();

    const data = Buffer.from(JSON.stringify(report));

    const sarif = converter.convert(data);

    const log: Log = {
        $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
        version: '2.1.0',
        runs: [{
            results: [{
                level: 'error',
                locations: [{
                    physicalLocation: {
                        artifactLocation: {
                            uri: 'src/file.tf'
                        },
                        region: {
                            startLine: 1,
                            endLine: 1
                        }
                    }
                }],
                message: {
                    text: 'Check name'
                },
                properties: {
                    resource: 'resource'
                },
                ruleId: 'CHECK_ID'
            }],
            tool: {
                driver: {
                    name: 'checkov',
                    version: '1.0.0'
                }
            }
        }]
    };

    t.deepEqual(sarif, log);
});
