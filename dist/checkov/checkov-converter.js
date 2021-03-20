"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CheckovConverter {
    convert(data) {
        const report = JSON.parse(data.toString('utf-8'));
        const sarif = {
            $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
            version: '2.1.0',
            runs: this._convertRuns(report)
        };
        return sarif;
    }
    _convertRuns(report) {
        const run = {
            tool: {
                driver: {
                    name: 'checkov',
                    version: report.summary.checkov_version
                }
            },
            results: this._convertResults(report.results)
        };
        return [run];
    }
    _convertResults(results) {
        return results.failed_checks.map(t => this._convertCheck(t));
    }
    _convertCheck(check) {
        return {
            level: 'error',
            locations: [
                {
                    physicalLocation: {
                        artifactLocation: {
                            uri: check.file_path.replace(/^\//, '')
                        },
                        region: {
                            startLine: check.file_line_range[0],
                            endLine: check.file_line_range.slice(-1)[0]
                        }
                    }
                }
            ],
            message: {
                text: check.check_name
            },
            properties: {
                resource: check.resource
            },
            ruleId: check.check_id
        };
    }
}
exports.default = CheckovConverter;
