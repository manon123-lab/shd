import { MapPin } from "lucide-react";

interface MapEmbedProps {
  lat: number;
  lng: number;
  address: string;
  className?: string;
}

const MapEmbed = ({ lat, lng, address, className = "" }: MapEmbedProps) => (
  <div className={`relative overflow-hidden rounded-xl border bg-muted ${className}`}>
    <iframe
      title="Location"
      width="100%"
      height="100%"
      style={{ border: 0, minHeight: 200 }}
      loading="lazy"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02},${lat - 0.015},${lng + 0.02},${lat + 0.015}&layer=mapnik&marker=${lat},${lng}`}
    />
    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg bg-card/90 px-2 py-1 text-xs font-medium shadow-card backdrop-blur-sm">
      <MapPin className="h-3 w-3 text-primary" />
      {address}
    </div>
  </div>
);

export default MapEmbed;

interface RouteMapProps {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  fromLabel: string;
  toLabel: string;
  className?: string;
}

export const RouteMap = ({ fromLat, fromLng, toLat, toLng, fromLabel, toLabel, className = "" }: RouteMapProps) => {
  const minLat = Math.min(fromLat, toLat);
  const maxLat = Math.max(fromLat, toLat);
  const minLng = Math.min(fromLng, toLng);
  const maxLng = Math.max(fromLng, toLng);
  const padLat = (maxLat - minLat) * 0.3 + 0.01;
  const padLng = (maxLng - minLng) * 0.3 + 0.01;

  return (
    <div className={`relative overflow-hidden rounded-xl border bg-muted ${className}`}>
      <iframe
        title="Route"
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: 250 }}
        loading="lazy"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${minLng - padLng},${minLat - padLat},${maxLng + padLng},${maxLat + padLat}&layer=mapnik&marker=${fromLat},${fromLng}`}
      />
      <div className="absolute top-2 left-2 right-2 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 rounded-lg bg-primary/90 px-2.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-card backdrop-blur-sm">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground/20 text-[10px]">A</span>
          {fromLabel}
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-secondary/90 px-2.5 py-1.5 text-xs font-semibold text-secondary-foreground shadow-card backdrop-blur-sm">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary-foreground/20 text-[10px]">B</span>
          {toLabel}
        </div>
      </div>
      <div className="absolute bottom-2 right-2 rounded-lg bg-card/90 px-2 py-1 text-[10px] font-medium text-muted-foreground shadow-card backdrop-blur-sm">
        📍 Route from A → B
      </div>
    </div>
  );
};
