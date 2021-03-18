import { Log } from 'sarif';

export interface Converter {
    convert(data: Buffer): Log;
}
