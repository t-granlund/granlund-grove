import { describe, it, expect } from "vitest";

// Minimal reproduction of the latLngToVector3 math for unit testing
function latLngToVector3(lat: number, lng: number, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

describe("globe coordinate math", () => {
  it("converts Chicago lat/lng to expected position", () => {
    const pos = latLngToVector3(41.8781, -87.6298);
    // Chicago: northern hemisphere (positive Y), near -90° longitude
    expect(pos.y).toBeGreaterThan(0);
    // On unit sphere
    const dist = Math.sqrt(pos.x ** 2 + pos.y ** 2 + pos.z ** 2);
    expect(dist).toBeCloseTo(1, 5);
  });

  it("converts São Paulo lat/lng to southern hemisphere", () => {
    const pos = latLngToVector3(-23.5505, -46.6333);
    expect(pos.y).toBeLessThan(0); // southern hemisphere = negative Y
    const dist = Math.sqrt(pos.x ** 2 + pos.y ** 2 + pos.z ** 2);
    expect(dist).toBeCloseTo(1, 5);
  });

  it("converts Taichung lat/lng to eastern hemisphere", () => {
    const pos = latLngToVector3(24.1477, 120.6736);
    expect(pos.x).toBeLessThan(0); // eastern hemisphere
    expect(pos.y).toBeGreaterThan(0); // northern
    const dist = Math.sqrt(pos.x ** 2 + pos.y ** 2 + pos.z ** 2);
    expect(dist).toBeCloseTo(1, 5);
  });

  it("North pole sits at +Y", () => {
    const pos = latLngToVector3(90, 0);
    expect(pos.x).toBeCloseTo(0, 5);
    expect(pos.y).toBeCloseTo(1, 5);
    expect(pos.z).toBeCloseTo(0, 5);
  });

  it("South pole sits at -Y", () => {
    const pos = latLngToVector3(-90, 0);
    expect(pos.x).toBeCloseTo(0, 5);
    expect(pos.y).toBeCloseTo(-1, 5);
    expect(pos.z).toBeCloseTo(0, 5);
  });

  it("radius scaling works", () => {
    const pos1 = latLngToVector3(0, 0, 1);
    const pos2 = latLngToVector3(0, 0, 2);
    const dist1 = Math.sqrt(pos1.x ** 2 + pos1.y ** 2 + pos1.z ** 2);
    const dist2 = Math.sqrt(pos2.x ** 2 + pos2.y ** 2 + pos2.z ** 2);
    expect(dist1).toBeCloseTo(1, 5);
    expect(dist2).toBeCloseTo(2, 5);
  });

  it("all 24 locations are on the unit sphere", () => {
    const locations = [
      [41.8781, -87.6298], // Chicago
      [41.8775, -88.067], // Glen Ellyn
      [43.0389, -87.9065], // Milwaukee
      [36.3729, -94.2088], // Bentonville
      [31.2304, 121.4737], // Shanghai
      [23.8103, 90.4125], // Dhaka
      [32.7767, -96.797], // Dallas
      [34.1064, -117.5931], // Rancho Cucamonga
      [39.9403, -82.0132], // Zanesville
      [-23.5505, -46.6333], // São Paulo
      [-22.9068, -43.1729], // Rio
      [-33.4489, -70.6693], // Santiago
      [-12.0464, -77.0428], // Lima
      [-25.2637, -57.5759], // Asunción
      [40.4168, -3.7038], // Madrid
      [38.7223, -9.1393], // Lisbon
      [53.3014, -6.1783], // Blackrock (Ireland)
      [24.1477, 120.6736], // Taichung
      [-33.8688, 151.2093], // Sydney
      [-31.9505, 115.8605], // Perth
      [-33.9249, 18.4241], // Cape Town
      [47.5053, -111.3008], // Great Falls
      [44.8714, -85.989], // Glen Arbor
      [32.9412, -97.1331], // South Lake
    ];
    for (const [lat, lng] of locations) {
      const pos = latLngToVector3(lat, lng);
      const dist = Math.sqrt(pos.x ** 2 + pos.y ** 2 + pos.z ** 2);
      expect(dist).toBeCloseTo(1, 5);
    }
  });
});
