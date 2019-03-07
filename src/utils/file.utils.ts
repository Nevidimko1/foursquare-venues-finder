import * as fs from 'fs';

export class FileUtils {

  private static recursivelyCreteFoldersSync = (url: string) => {
    if (!url) {
      return;
    }

    const path = url.slice(url.indexOf('/'), url.lastIndexOf('/')),
      folders = path.split('/').filter(item => item);

    folders.reduce((acc, folder) => {
      const f = acc + folder;
      if (!fs.existsSync(f)) {
        fs.mkdirSync(f);
      }
      return f + '/';
    }, '');
  }

  public static readJsonSync = <T>(url: string): T => {
    let data: T = null;
    try {
      data = JSON.parse(fs.readFileSync(url).toString());
    }
    catch (e) { }

    return data;
  }

  public static readOrCreateSync = <T>(url: string, def?: any): T => {
    FileUtils.recursivelyCreteFoldersSync(url);

    if (!fs.existsSync(url)) {
      fs.writeFileSync(url, typeof def === 'object' ? JSON.stringify(def, null, 4) : def);
    }

    return FileUtils.readJsonSync(url) || def;
  }
}