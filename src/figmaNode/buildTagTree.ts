import { isImageNode } from './isImageNode';
type CSSData = {
  [key in string]: string | number | boolean;
};

export type Tag =
  | {
      id?: string;
      name: string;
      isText?: boolean;
      textCharacters?: string | null;
      isImg?: boolean;
      css: CSSData;
      children: Tag[];
      isComponent?: false;
      tokens?: { [key in string]: string };
    }

export async function buildTagTree(
  node: any,
) {
  if (!node.visible) {
    return null;
  }
  const isImg = isImageNode(node);
  const css = await node.getCSSAsync()
  const childTags: Tag[] = [];
  if ('children' in node && !isImg) {
    for (let i = 0; i < node.children.length; i++) {
      const element = node.children[i];
      {
        const childTag = await buildTagTree(element);
        if (childTag) {
          childTags.push(childTag);
          }
        }
      }

  }
  const tag: Tag = {
    id: node.id,
    name: node.name,
    css,
    children: childTags,
  };
  if (node.type === 'TEXT') {
    tag.isText = true;
    tag.textCharacters = node.characters;
  }
  if (isImg) {
    tag.isImg = true;
  }
  return tag;
}