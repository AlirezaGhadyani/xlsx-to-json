export default function jsonViewer(
  json: Record<string, any>,
  collapsible = true
) {
  const TEMPLATES: { [key: string]: string } = {
    item: '<div class="json__item"><div class="json__key">%KEY%</div><div class="json__value json__value--%TYPE%">%VALUE%</div></div>',
    itemCollapsible:
      '<label class="json__item json__item--collapsible"><input type="checkbox" class="json__toggle"/><div class="json__key">%KEY%</div><div class="json__value json__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>',
    itemCollapsibleOpen:
      '<label class="json__item json__item--collapsible"><input type="checkbox" checked class="json__toggle"/><div class="json__key">%KEY%</div><div class="json__value json__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>',
  };

  function createItem(key: string, value: any, type: string): string {
    let element = TEMPLATES.item.replace("%KEY%", key);

    if (type === "string") {
      element = element.replace("%VALUE%", '"' + value + '"');
    } else {
      element = element.replace("%VALUE%", value);
    }

    element = element.replace("%TYPE%", type);

    return element;
  }

  function createCollapsibleItem(
    key: string,
    value: any,
    type: string,
    children: string
  ): string {
    let tpl = "itemCollapsible";

    if (collapsible) {
      tpl = "itemCollapsibleOpen";
    }

    let element = TEMPLATES[tpl].replace("%KEY%", key);

    element = element.replace("%VALUE%", type);
    element = element.replace("%TYPE%", type);
    element = element.replace("%CHILDREN%", children);

    return element;
  }

  function handleChildren(key: string, value: any, type: string): string {
    let html = "";

    for (const item in value) {
      const _key = item,
        _val = value[item];

      html += handleItem(_key, _val);
    }

    return createCollapsibleItem(key, value, type, html);
  }

  function handleItem(key: string, value: any): string {
    const type = typeof value;

    if (typeof value === "object") {
      return handleChildren(key, value, type);
    }

    return createItem(key, value, type);
  }

  function parseObject(obj: Record<string, any>): string {
    let _result = '<div class="json">';

    for (const item in obj) {
      let key = item,
        value = obj[item];

      _result += handleItem(key, value);
    }

    _result += "</div>";

    return _result;
  }

  return parseObject(json);
}
