import { readdir, readFile } from 'fs/promises';

export default class Templater {
  constructor() {
    this.components = { };
  }

  async load(dir) {
    const files = await readdir(dir);
    for (const file of files) {
      const component = file
        .slice(0, -'.html'.length)
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
      const code = await readFile(`${dir}/${file}`, { encoding: 'utf8' });
      this.components[component] = code;
    }
  }

  get(component) {
    return this.components[component];
  }
};
