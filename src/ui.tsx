import { render } from "@create-figma-plugin/ui";
import { h } from "preact";
import { useEffect } from "react";
import {
  appendJsonDataToPageFlly,
  convertJsonToPageFly,
  jsonData,
} from "./figmaNode/convertJsonToPageFly";
import { PluginToUiMessage } from "./main";
import { buildTagTree } from "./figmaNode/buildTagTree";
import { getSelectedNodesOrAllNodes } from "@create-figma-plugin/utilities";
import { removeUnnecessaryPropsFromTagTree } from "./figmaNode/removeUnnecessaryPropsFromTagTree";

function Plugin() {
  const generateFile = async () => {
    const selectedNode = getSelectedNodesOrAllNodes()[0];
    const thisTagTree = await buildTagTree(selectedNode);
    const msg: PluginToUiMessage = {
      type: "sendSelectedNode",
      nodeId: selectedNode.id,
      nodeJSON: removeUnnecessaryPropsFromTagTree(thisTagTree as any),
    };
    figma.ui.postMessage(msg);
  };
  useEffect(() => {
    onmessage = async (event: {
      data: {
        pluginMessage: any;
      };
    }) => {
      const pluginMessage = event.data.pluginMessage;
      console.log(pluginMessage);

      if (!pluginMessage) return;

      if (pluginMessage.type === "sendSelectedNode") {
        convertJsonToPageFly(event.data.pluginMessage.nodeJSON, 1);
        console.log("testData", jsonData);
        console.log("event.data.pluginMessage", event.data.pluginMessage);
        appendJsonDataToPageFlly();
      }
    };
  }, []);

  return <button onClick={generateFile}>Generate</button>;
}

export default render(Plugin);
