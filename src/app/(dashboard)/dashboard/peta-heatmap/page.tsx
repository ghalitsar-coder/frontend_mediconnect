"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, AlertTriangle, TrendingUp } from "lucide-react";
import { useState, useMemo, useEffect, useId } from "react";
import { Map, useMap } from "@/components/ui/map";

type PenyakitKey = "DBD" | "ISPA" | "Diare" | "TB";

const wilayahData = [
  { nama: "Kec. Cikutra", lat: 55, left: 58, dbd: 30, ispa: 45, diare: 22, tb: 8 },
  { nama: "Kec. Coblong", lat: 30, left: 40, dbd: 12, ispa: 145, diare: 35, tb: 5 },
  { nama: "Kec. Lengkong", lat: 65, left: 35, dbd: 8, ispa: 60, diare: 68, tb: 3 },
  { nama: "Kec. Cibeunying", lat: 25, left: 65, dbd: 22, ispa: 88, diare: 40, tb: 10 },
  { nama: "Kec. Bandung Wetan", lat: 45, left: 50, dbd: 5, ispa: 32, diare: 15, tb: 2 },
  { nama: "Kec. Sumur Bandung", lat: 75, left: 55, dbd: 15, ispa: 70, diare: 50, tb: 6 },
  { nama: "Kec. Andir", lat: 40, left: 20, dbd: 18, ispa: 95, diare: 28, tb: 4 },
  { nama: "Kec. Cicendo", lat: 20, left: 30, dbd: 10, ispa: 55, diare: 18, tb: 7 },
  { nama: "Kec. Sukajadi", lat: 15, left: 50, dbd: 20, ispa: 110, diare: 45, tb: 9 },
  { nama: "Kec. Batununggal", lat: 80, left: 45, dbd: 6, ispa: 40, diare: 30, tb: 2 },
  { nama: "Kec. Regol", lat: 85, left: 30, dbd: 9, ispa: 50, diare: 42, tb: 3 },
  { nama: "Kec. Astana Anyar", lat: 70, left: 18, dbd: 14, ispa: 65, diare: 38, tb: 5 },
];

const bandungCoords: Record<string, [number, number]> = {
  "Kec. Cikutra": [107.6394, -6.8885],
  "Kec. Coblong": [107.6100, -6.8870],
  "Kec. Lengkong": [107.6256, -6.9328],
  "Kec. Cibeunying": [107.6334, -6.9037],
  "Kec. Bandung Wetan": [107.6163, -6.9068],
  "Kec. Sumur Bandung": [107.6133, -6.9175],
  "Kec. Andir": [107.5855, -6.9126],
  "Kec. Cicendo": [107.5937, -6.9015],
  "Kec. Sukajadi": [107.5947, -6.8790],
  "Kec. Batununggal": [107.6337, -6.9366],
  "Kec. Regol": [107.6087, -6.9388],
  "Kec. Astana Anyar": [107.5997, -6.9348],
};

const penyakitOptions: { value: PenyakitKey; label: string; color: string }[] = [
  { value: "DBD", label: "Demam Berdarah", color: "hsl(262, 60%, 38%)" },
  { value: "ISPA", label: "ISPA", color: "hsl(200, 70%, 55%)" },
  { value: "Diare", label: "Diare", color: "hsl(174, 62%, 47%)" },
  { value: "TB", label: "Tuberkulosis", color: "hsl(262, 50%, 55%)" },
];

const penyakitKeyMap: Record<PenyakitKey, "dbd" | "ispa" | "diare" | "tb"> = {
  DBD: "dbd",
  ISPA: "ispa",
  Diare: "diare",
  TB: "tb",
};

function getIntensity(value: number, max: number) {
  const ratio = Math.min(value / max, 1);
  if (ratio > 0.7) return { level: "Kritis" };
  if (ratio > 0.4) return { level: "Waspada" };
  if (ratio > 0.15) return { level: "Sedang" };
  return { level: "Rendah" };
}

const levelColor: Record<string, string> = {
  Kritis: "bg-rose-100 text-rose-700",
  Waspada: "bg-amber-100 text-amber-700",
  Sedang: "bg-blue-100 text-blue-700",
  Rendah: "bg-emerald-100 text-emerald-700",
};

// Colors from Mapcn component scaled
const HEATMAP_GRADIENT_COLORS = [
  "#fff7bc",
  "#fee391",
  "#fec44f",
  "#fe9929",
  "#d7301f",
];

const HEATMAP_COLOR_STOPS: [number, string][] = [
  [0.15, HEATMAP_GRADIENT_COLORS[0]],
  [0.35, HEATMAP_GRADIENT_COLORS[1]],
  [0.55, HEATMAP_GRADIENT_COLORS[2]],
  [0.75, HEATMAP_GRADIENT_COLORS[3]],
  [1, HEATMAP_GRADIENT_COLORS[4]],
];

function BandungHeatmapLayers({ geoJson, maxVal }: { geoJson: any; maxVal: number }) {
  const { map, isLoaded } = useMap();
  const id = useId();
  const sourceId = `heatmap-source-${id}`;
  const heatLayerId = `heatmap-layer-${id}`;
  const pointLayerId = `heatmap-point-layer-${id}`;

  useEffect(() => {
    if (!map || !isLoaded) return;

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: geoJson,
      });
    } else {
      const src = map.getSource(sourceId) as maplibregl.GeoJSONSource;
      src.setData(geoJson);
    }

    if (!map.getLayer(heatLayerId)) {
      map.addLayer({
        id: heatLayerId,
        type: "heatmap",
        source: sourceId,
        maxzoom: 15,
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            0,
            0,
            Math.max(1, maxVal),
            1,
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10,
            1,
            15,
            3,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(59, 130, 246, 0)",
            ...HEATMAP_COLOR_STOPS.flat() as any[],
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 10, 30, 15, 80],
          "heatmap-opacity": 0.8,
        },
      });
    } else {
      // Update the maxval range
      map.setPaintProperty(heatLayerId, "heatmap-weight", [
        "interpolate",
        ["linear"],
        ["get", "mag"],
        0,
        0,
        Math.max(1, maxVal),
        1,
      ]);
    }

    if (!map.getLayer(pointLayerId)) {
      map.addLayer({
        id: pointLayerId,
        type: "circle",
        source: sourceId,
        minzoom: 12,
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            0,
            5,
            Math.max(1, maxVal),
            15,
          ],
          "circle-color": "white",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#d7301f",
          "circle-opacity": 0.9,
        },
      });
    } else {
      map.setPaintProperty(pointLayerId, "circle-radius", [
        "interpolate",
        ["linear"],
        ["get", "mag"],
        0,
        5,
        Math.max(1, maxVal),
        15,
      ]);
    }

    // Optional: Add labels
    const labelLayerId = `heatmap-labels-${id}`;
    if (!map.getLayer(labelLayerId)) {
      map.addLayer({
        id: labelLayerId,
        type: "symbol",
        source: sourceId,
        minzoom: 12,
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-offset": [0, 1.5],
          "text-anchor": "top"
        },
        paint: {
          "text-color": "#333",
          "text-halo-color": "#fff",
          "text-halo-width": 2
        }
      });
    }

  }, [map, isLoaded, geoJson, maxVal, sourceId, heatLayerId, pointLayerId, id]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      try {
        if (map) {
          if (map.getLayer(`heatmap-labels-${id}`)) map.removeLayer(`heatmap-labels-${id}`);
          if (map.getLayer(pointLayerId)) map.removeLayer(pointLayerId);
          if (map.getLayer(heatLayerId)) map.removeLayer(heatLayerId);
          if (map.getSource(sourceId)) map.removeSource(sourceId);
        }
      } catch {
        // ignore
      }
    };
  }, [map, sourceId, heatLayerId, pointLayerId, id]);

  return null;
}


const PetaHeatmap = () => {
  const [selected, setSelected] = useState<PenyakitKey>("DBD");

  const field = penyakitKeyMap[selected];
  const maxVal = Math.max(...wilayahData.map((w) => w[field]));

  const sorted = [...wilayahData].sort((a, b) => b[field] - a[field]);
  const totalKasus = wilayahData.reduce((sum, w) => sum + w[field], 0);
  const topWilayah = sorted[0];
  const currentColor = penyakitOptions.find(p => p.value === selected)?.color || "";

  // Convert to GeoJSON for MapLibre
  const geoJson = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: wilayahData.map((w) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: bandungCoords[w.nama] || [107.6, -6.9],
        },
        properties: {
          mag: w[field],
          name: w.nama,
        },
      })),
    };
  }, [field]);

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Peta Heatmap Penyakit</h1>
          <p className="text-sm text-muted-foreground">Visualisasi sebaran kasus penyakit per kecamatan (didukung Mapcn)</p>
        </div>
        <Select value={selected} onValueChange={(v) => setSelected(v as PenyakitKey)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {penyakitOptions.map((p) => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Kasus ({selected})</p>
              <p className="text-2xl font-extrabold text-foreground">{totalKasus}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wilayah Tertinggi</p>
              <p className="text-lg font-bold text-foreground">{topWilayah.nama}</p>
              <p className="text-xs text-muted-foreground">{topWilayah[field]} kasus</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wilayah Dipantau</p>
              <p className="text-2xl font-extrabold text-foreground">{wilayahData.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* New Mapcn Heatmap Visual */}
        <Card className="shadow-card xl:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Peta Sebaran — {penyakitOptions.find(p => p.value === selected)!.label}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 pb-6 px-6">
            <div className="relative w-full rounded-xl border border-border overflow-hidden" style={{ minHeight: 500 }}>
              <Map
                center={[107.61, -6.91]} // Center of Bandung
                zoom={11.5}
                projection={{ type: "mercator" }}
                styles={{ light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" }}
              >
                <BandungHeatmapLayers geoJson={geoJson} maxVal={maxVal} />
              </Map>
              
              {/* Legend overlay */}
              <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur border border-border rounded-lg px-3 py-2 space-y-2 z-10 w-40 shadow-sm pointer-events-none">
                <p className="font-semibold text-foreground text-xs">Intensitas {selected}</p>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{
                  background: `linear-gradient(to right, ${HEATMAP_GRADIENT_COLORS.join(", ")})`
                }} />
                <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                  <span>Rendah</span>
                  <span>Kritis</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rankings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Peringkat Wilayah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sorted.map((w, i) => {
              const val = w[field];
              const { level } = getIntensity(val, maxVal);
              const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;

              return (
                <div key={w.nama} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                      <span className="text-sm text-foreground">{w.nama}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{val}</span>
                      <Badge variant="secondary" className={`text-[10px] px-1.5 ${levelColor[level]}`}>{level}</Badge>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: currentColor }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PetaHeatmap;
