import * as Schema from "./JSONSchema";
import { Marker, LatLngExpression, DivIcon, LatLngBounds } from "leaflet";
import { Layer } from "./Layer";

export class WSMarker extends Marker {
  public id: string;
  public name: string;
  public layer: Layer;

  private constructor(
    json: Schema.Marker,
    coords: LatLngExpression,
    layer: Layer
  ) {
    const name = json.name ?? layer.name;
    let icon;
    if (json.icon) {
      icon = new DivIcon({
        className: "marker-div-icon",
        iconSize: undefined,
        html:
          `<img class="marker-div-image" src="icons/${json.icon.url}" width="${
            json.icon.width ?? 32
          }" height="${json.icon.height ?? 32}">` +
          `<span class="marker-div-span">${name}</span>`,
      });
    } else {
      icon = layer.icon;
    }

    super(coords, {
      title: json.name ?? layer.name,
      icon,
    });

    this.id = json.id;
    this.layer = layer;
    this.name = name;
  }

  public show(): void {
    if (this.layer) {
      this.addTo(this.layer);
    }
  }

  public hide(): void {
    if (this.layer) {
      this.layer.removeLayer(this);
    }
  }

  public isInBounds(bounds: LatLngBounds): boolean {
    return bounds.contains(this.getLatLng());
  }

  public updateVisibility(bounds: LatLngBounds): void {
    if (this.isInBounds(bounds)) this.show();
    else this.hide();
  }

  public static fromJson(json: Schema.Marker, layer: Layer): WSMarker {
    const marker = new WSMarker(json, json.coords, layer);
    return marker;
  }
}
