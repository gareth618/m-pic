import { readdir, readFile } from 'fs/promises';

export default class Templater {
  constructor() {
    this.components = { };
  }

  async load(dir) {
    const files = await readdir(dir);
    for (const file of files) {
      const code = await readFile(`${dir}/${file}`, { encoding: 'utf8' });
      const matches = code.match(/<component\s+name=".+?">.*?<\/component>/sg) || [];
      for (const match of matches) {
        const { name, content } = match.match(/<component\s+name="(?<name>.+?)">(?<content>.*?)<\/component>/s).groups;
        this.components[name] = content;
      }
    }
  }

  #parseJS(js, _args) {
    return eval(js.replace(/\$(?=[a-zA-Z])/g, '_args.'));
  }

  #parseHTML(html, args) {
    while (true) {
      const exprMatch = html.match(/{{(?<expr>.+?)}}/s);
      const loopMatch = html.match(/<for\s+itr="(?<itr>.+?)"\s+arr="(?<arr>.+?)">(?<content>.*?)<\/for>/s);
      const compMatch = html.match(/<(?<name>[A-Z][a-zA-Z]*)(?<atts>\s+[a-zA-Z]+=".+?")?\s*>/s);

      const exprIndex = exprMatch?.index || 1e9;
      const loopIndex = loopMatch?.index || 1e9;
      const compIndex = compMatch?.index || 1e9;
      const index = Math.min(exprIndex, loopIndex, compIndex);

      if (index === 1e9) return html;
      if (index === exprIndex) {
        const expr = exprMatch.groups.expr;
        html = html.replace(exprMatch[0], this.#parseJS(expr, args));
      }

      if (index === loopIndex) {
        const itr = loopMatch.groups.itr;
        const arr = this.#parseJS(loopMatch.groups.arr, args);
        const content = loopMatch.groups.content;
        let forHTML = '';
        for (const elt of arr) {
          args[itr] = elt;
          forHTML += this.#parseHTML(content, args);
        }
        args[itr] = undefined;
        html = html.replace(loopMatch[0], forHTML);
      }

      if (index === compIndex) {
        const name = compMatch.groups.name;
        const compArgs = { };
        const matches = compMatch.groups.atts?.match(/[a-zA-Z]+=".+?"/sg) || [];
        for (const match of matches) {
          const { att, val } = match.match(/(?<att>[a-zA-Z]+)="(?<val>.+?)"/s).groups;
          compArgs[att] = this.#parseJS(val, args);
        }
        html = html.replace(compMatch[0], this.render(name, compArgs));
      }
    }
  }

  render(component, args) {
    return this.#parseHTML(this.components[component], args);
  }
};
