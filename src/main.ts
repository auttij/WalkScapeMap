import "leaflet/dist/leaflet.css";
import "./style.css";
import { WSMap } from "./WSMap";
import { Layer } from "./Layer";
import * as Schema from "./JSONSchema";

const iconUrl = (iconName: string) => {
  return `/icons/${iconName}.png`;
};

window.onload = async () => {
  const map = WSMap.create({
    mapSizePixels: 5632,
    tileSize: 128,
    minZoom: 2,
    maxZoom: 4,
  });
  const mapLayer = map.addMapLayer();

  function addJson(categories: Schema.Category[]): void {
    for (const category of categories) {
      mapLayer.addCategory(
        category.name,
        category.layers.map((l) => Layer.fromJson(l, category.name))
      );
    }
  }

  const locations = fetch("markers/locations.json")
    .then((r) => r.json())
    .then(addJson);
  await Promise.allSettled([locations]);
};
