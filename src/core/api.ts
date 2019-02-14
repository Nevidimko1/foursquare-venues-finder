import * as https from 'https'

export class Api {
    public static get = <T>(url: string): Promise<T> => {
        return new Promise((resolve, reject) => {
            let body: string = '';
            https
                .get(url, res => {
                    res.on('data', chunk => body += chunk);
                    res.on('end', () => {
                        try {
                            const d: T = JSON.parse(body);
                            resolve(d)
                        }
                        catch (e) {
                            reject(e)
                        }
                    });
                })
                .on('error', e => reject(e));
        });
    }
}