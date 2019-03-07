import * as https from 'https'

export class Api {
  public static get = <T>(url: string, headers: { [key: string]: string } = {}): Promise<T> => {
    return new Promise((resolve, reject) => {
      let body: string = '';
      https
        .get(url, { headers }, res => {
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try {
              const d: T = JSON.parse(body);
              resolve(d)
            }
            catch (e) {
              console.error('Failed to parse body: ', body);
              reject(e)
            }
          });
        })
        .on('error', e => reject(e));
    });
  }
}