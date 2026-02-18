"use client";

import { CSSProperties } from "react";
import { FashionItem, Category, GenderExpression, OutfitCombination } from "@/types/fashion";

const ZONE_CATEGORY_MAP: Record<string, Category[]> = {
  "zone-head":   [Category.HAT],
  "zone-eyes":   [Category.SUNGLASSES],
  "zone-ears":   [Category.JEWELRY],
  "zone-neck":   [Category.SCARF, Category.JEWELRY],
  "zone-torso":  [Category.TOP, Category.DRESS, Category.OUTERWEAR],
  "zone-waist":  [Category.BELT],
  "zone-wrist":  [Category.WATCH, Category.JEWELRY],
  "zone-hand":   [Category.BAG],
  "zone-legs":   [Category.BOTTOM, Category.DRESS],
  "zone-feet":   [Category.SHOES, Category.SOCKS],
};

const ZONE_LABELS: Record<string, string> = {
  "zone-head":  "Hat",
  "zone-eyes":  "Sunglasses",
  "zone-ears":  "Earrings",
  "zone-neck":  "Scarf / Necklace",
  "zone-torso": "Top / Outerwear",
  "zone-waist": "Belt",
  "zone-wrist": "Watch",
  "zone-hand":  "Bag",
  "zone-legs":  "Bottoms",
  "zone-feet":  "Shoes",
};

function getItem(zone: string, items: FashionItem[]): FashionItem | null {
  const cats = ZONE_CATEGORY_MAP[zone];
  return cats ? (items.find(i => cats.includes(i.category)) ?? null) : null;
}

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 255) + amt));
  const b = Math.min(255, Math.max(0, (n & 255) + amt));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function clothStyle(color: string, extra?: CSSProperties): CSSProperties {
  return {
    backgroundColor: color,
    backgroundImage: `linear-gradient(105deg, ${shade(color, -55)} 0%, ${shade(color, 50)} 38%, ${shade(color, -15)} 65%, ${shade(color, -55)} 100%)`,
    boxShadow: `inset -4px 0 8px ${shade(color, -70)}44, inset 4px 0 6px ${shade(color, 60)}33, 0 2px 6px #00000030`,
    ...extra,
  };
}

function skinStyle(extra?: CSSProperties): CSSProperties {
  return {
    backgroundColor: "#C68642",
    backgroundImage: "radial-gradient(ellipse at 38% 30%, #E8A86A 0%, #C68642 55%, #8B5E3C 100%)",
    boxShadow: "inset -3px 0 8px #8B5E3C44, 0 2px 6px #00000025",
    ...extra,
  };
}

interface ZoneButtonProps {
  label: string;
  item: FashionItem | null;
  active: boolean;
  onClick: () => void;
  style: CSSProperties;
  children?: React.ReactNode;
  className?: string;
}

function ZoneButton({ label, item, active, onClick, style, children, className = "" }: ZoneButtonProps) {
  return (
    <div
      role="button"
      aria-label={`${label}${item ? `: ${item.name}` : " (empty — click to add)"}`}
      onClick={onClick}
      title={item ? `${label}: ${item.name} — click to swap` : `${label} — click to add`}
      className={`cursor-pointer transition-all duration-200 ${active ? "brightness-110 scale-105" : "hover:brightness-105 hover:scale-102"} ${className}`}
      style={{
        ...style,
        outline: active ? "2.5px solid #7c3aed" : undefined,
        outlineOffset: active ? "2px" : undefined,
      }}
    >
      {children}
    </div>
  );
}

interface Props {
  outfit: Pick<OutfitCombination, "items">;
  gender: GenderExpression;
  activeZone: string | null;
  onZoneClick: (zone: string, category: Category) => void;
}

export function FashionFigure({ outfit, gender, activeZone, onZoneClick }: Props) {
  const fem = gender === GenderExpression.FEMININE;
  const items = outfit.items;

  function click(zoneId: string) {
    const cats = ZONE_CATEGORY_MAP[zoneId];
    if (cats?.length) onZoneClick(zoneId, cats[0]);
  }

  function z(zoneId: string) {
    const item = getItem(zoneId, items);
    return { item, active: activeZone === zoneId, label: ZONE_LABELS[zoneId], onClick: () => click(zoneId) };
  }

  // skin colours
  const skin = "#C68642";
  const skinDark = "#8B5E3C";
  const skinHi = "#E8A86A";
  const hair = fem ? "#2B1608" : "#1A0E05";
  const hairHi = shade(hair, 55);

  // Zone data
  const torsoZ = z("zone-torso");
  const legsZ = z("zone-legs");
  const feetZ = z("zone-feet");
  const beltZ = z("zone-waist");
  const hatZ = z("zone-head");
  const glassZ = z("zone-eyes");
  const neckZ = z("zone-neck");
  const watchZ = z("zone-wrist");
  const bagZ = z("zone-hand");
  const earZ = z("zone-ears");

  const torsoColor = torsoZ.item?.dominantColor ?? (fem ? "#D4B8A0" : "#B8A898");
  const legsColor = legsZ.item?.dominantColor ?? "#6B6B80";
  const feetColor = feetZ.item?.dominantColor ?? "#2a2a3a";
  const sleeveColor = torsoColor;

  // Figure width adapts to gender
  const figW = fem ? 130 : 150;

  return (
    <div className="flex flex-col items-center w-full select-none">
      <p className="text-xs text-muted-foreground mb-3">Click a zone to swap items</p>

      {/* ── Outer container ── */}
      <div className="relative flex flex-col items-center" style={{ width: figW, fontFamily: "sans-serif" }}>

        {/* ══════════════ HEAD + HAIR ══════════════ */}
        <div className="relative flex justify-center" style={{ marginBottom: 0 }}>

          {/* Hair */}
          <div className="absolute" style={{
            width: fem ? 82 : 76,
            height: fem ? 64 : 54,
            top: -6,
            borderRadius: fem ? "50% 50% 30% 30% / 60% 60% 40% 40%" : "50% 50% 20% 20% / 55% 55% 30% 30%",
            backgroundColor: hair,
            backgroundImage: `radial-gradient(ellipse at 35% 28%, ${hairHi} 0%, ${hair} 55%)`,
            boxShadow: `0 2px 8px #00000040`,
            zIndex: 0,
          }}/>

          {/* Face */}
          <div style={{
            ...skinStyle(),
            width: fem ? 74 : 72,
            height: fem ? 88 : 84,
            borderRadius: fem ? "50% 50% 46% 46% / 54% 54% 46% 46%" : "48% 48% 44% 44% / 52% 52% 44% 44%",
            position: "relative",
            zIndex: 1,
            marginTop: 10,
          }}>
            {/* Ears */}
            <div style={{ ...skinStyle(), position:"absolute", width:12, height:18, borderRadius:"50%", top:24, left:-6, zIndex:0 }}/>
            <div style={{ ...skinStyle(), position:"absolute", width:12, height:18, borderRadius:"50%", top:24, right:-6, zIndex:0 }}/>

            {/* Eyebrows */}
            <div style={{ position:"absolute", top:22, left:10, width:20, height:4, borderRadius:4, backgroundColor:hair, transform: fem ? "rotate(-4deg)" : "rotate(-2deg)" }}/>
            <div style={{ position:"absolute", top:22, right:10, width:20, height:4, borderRadius:4, backgroundColor:hair, transform: fem ? "rotate(4deg)" : "rotate(2deg)" }}/>

            {/* Eyes */}
            {glassZ.item ? (
              /* Sunglasses */
              <div onClick={glassZ.onClick} style={{ position:"absolute", top:30, left:6, right:6, display:"flex", gap:4, cursor:"pointer",
                outline: glassZ.active ? "2px solid #7c3aed" : undefined, borderRadius:4, padding:1 }}>
                {[0,1].map(i => (
                  <div key={i} style={{
                    flex:1, height:16, borderRadius:8,
                    backgroundColor: glassZ.item!.dominantColor,
                    backgroundImage: `linear-gradient(135deg, ${shade(glassZ.item!.dominantColor,40)}55 0%, ${glassZ.item!.dominantColor}cc 100%)`,
                    boxShadow: `0 1px 4px #00000060, inset 0 1px 2px ${shade(glassZ.item!.dominantColor,60)}44`,
                    border: `1.5px solid ${shade(glassZ.item!.dominantColor,-50)}`,
                  }}/>
                ))}
              </div>
            ) : (
              /* Normal eyes */
              <div style={{ position:"absolute", top:32, left:8, right:8, display:"flex", justifyContent:"space-between" }}>
                {[0,1].map(i => (
                  <div key={i} style={{ width:20, height:14, borderRadius:"50%", backgroundColor:"white", boxShadow:"0 1px 3px #00000030", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:11, height:11, borderRadius:"50%", backgroundColor:"#3D2314", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <div style={{ width:5, height:5, borderRadius:"50%", backgroundColor:"#0d0806" }}>
                        <div style={{ width:2, height:2, borderRadius:"50%", backgroundColor:"white", margin:"1px 0 0 1px" }}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Nose */}
            <div style={{ position:"absolute", top:50, left:"50%", transform:"translateX(-50%)", width:10, height:10, borderRadius:"50%", backgroundColor:skinDark, opacity:0.28 }}/>
            {/* Nostrils */}
            <div style={{ position:"absolute", top:57, left:"50%", transform:"translateX(-50%)", display:"flex", gap:6 }}>
              <div style={{ width:6, height:5, borderRadius:"50%", backgroundColor:skinDark, opacity:0.35 }}/>
              <div style={{ width:6, height:5, borderRadius:"50%", backgroundColor:skinDark, opacity:0.35 }}/>
            </div>

            {/* Lips */}
            <div style={{ position:"absolute", bottom: fem?10:12, left:"50%", transform:"translateX(-50%)", width: fem?28:26, height: fem?10:8, borderRadius:"0 0 50% 50% / 0 0 100% 100%", backgroundColor: fem?"#C47A7A":"#A06060", boxShadow:"inset 0 2px 3px #00000020" }}/>
            {fem && <div style={{ position:"absolute", bottom:18, left:"50%", transform:"translateX(-50%)", width:16, height:5, borderRadius:"50% 50% 0 0 / 100% 100% 0 0", backgroundColor:"#C47A7A" }}/>}

            {/* Cheek blush (fem) */}
            {fem && <>
              <div style={{ position:"absolute", top:40, left:6, width:14, height:10, borderRadius:"50%", backgroundColor:"#FF9090", opacity:0.2 }}/>
              <div style={{ position:"absolute", top:40, right:6, width:14, height:10, borderRadius:"50%", backgroundColor:"#FF9090", opacity:0.2 }}/>
            </>}
          </div>

          {/* Earrings */}
          {earZ.item && earZ.item.category === Category.JEWELRY && (
            <>
              {[-1,1].map((side, idx) => (
                <div key={idx} onClick={earZ.onClick} style={{
                  position:"absolute", cursor:"pointer",
                  top: fem?42:40,
                  [side === -1 ? "left" : "right"]: fem ? -4 : -2,
                  display:"flex", flexDirection:"column", alignItems:"center", gap:2,
                  outline: earZ.active ? "2px solid #7c3aed" : undefined, borderRadius:4, padding:2,
                }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", backgroundColor:earZ.item!.dominantColor, boxShadow:`0 1px 4px #00000040, inset 0 -1px 2px ${shade(earZ.item!.dominantColor,-40)}` }}/>
                  {fem && <>
                    <div style={{ width:2, height:12, backgroundColor:earZ.item!.dominantColor }}/>
                    <div style={{ width:8, height:8, borderRadius:"50%", backgroundColor:earZ.item!.dominantColor, boxShadow:`0 1px 4px #00000040` }}/>
                  </>}
                </div>
              ))}
            </>
          )}
        </div>

        {/* ══════════════ NECK ══════════════ */}
        <div style={{ ...skinStyle(), width: fem?20:24, height:20, borderRadius:"0 0 6px 6px", zIndex:2, position:"relative" }}>
          {/* Necklace */}
          {neckZ.item && neckZ.item.category === Category.JEWELRY && (
            <div onClick={neckZ.onClick} style={{
              position:"absolute", bottom:-6, left:"50%", transform:"translateX(-50%)",
              width:40, height:8, borderRadius:"0 0 50% 50%",
              border: `3px solid ${neckZ.item.dominantColor}`,
              borderTop:"none", cursor:"pointer",
              outline: neckZ.active ? "2px solid #7c3aed" : undefined,
            }}/>
          )}
        </div>

        {/* ══════════════ TORSO + ARMS ══════════════ */}
        <div className="relative flex items-start justify-center" style={{ width: "100%", height: fem ? 148 : 162, marginTop:-2 }}>

          {/* LEFT ARM */}
          <div className="absolute flex flex-col items-center" style={{ left: fem?-6:2, top: fem?6:8 }}>
            {/* Upper arm */}
            <ZoneButton {...torsoZ} onClick={() => click("zone-torso")}
              style={{ ...clothStyle(sleeveColor), width: fem?20:24, height: fem?72:80, borderRadius:12, marginBottom:-1 }}/>
            {/* Elbow joint */}
            <div style={{ ...skinStyle(), width: fem?16:20, height:16, borderRadius:"50%", zIndex:2, margin:"0 auto" }}/>
            {/* Forearm */}
            <div style={{ ...skinStyle(), width: fem?14:18, height: fem?56:60, borderRadius:10, marginTop:-2 }}/>
            {/* Hand */}
            <div style={{ ...skinStyle(), width: fem?16:20, height: fem?22:24, borderRadius:8, marginTop:-2 }}/>
          </div>

          {/* TORSO */}
          <ZoneButton {...torsoZ}
            style={{
              ...clothStyle(torsoColor),
              width: fem ? 80 : 100,
              height: fem ? 148 : 162,
              borderRadius: fem
                ? "38% 38% 30% 30% / 12% 12% 8% 8%"
                : "28% 28% 20% 20% / 8% 8% 6% 6%",
              position:"relative",
              zIndex:1,
            }}>
            {/* Collar */}
            <div style={{
              position:"absolute", top: 0, left:"50%", transform:"translateX(-50%)",
              width: fem?24:30, height: fem?14:18,
              backgroundColor: shade(torsoColor,-30),
              borderRadius:"0 0 50% 50%",
              backgroundImage:`linear-gradient(180deg, ${shade(torsoColor,-50)} 0%, ${shade(torsoColor,-20)} 100%)`,
            }}/>
            {/* Waist nip (fem) */}
            {fem && <div style={{ position:"absolute", bottom:20, left:0, right:0, height:16, borderRadius:"0 0 50% 50%",
              backgroundImage:`linear-gradient(180deg, transparent, ${shade(torsoColor,-40)}33)` }}/>}
            {/* Scarf overlay */}
            {neckZ.item && neckZ.item.category === Category.SCARF && (
              <div onClick={neckZ.onClick} style={{
                position:"absolute", top:-4, left:"50%", transform:"translateX(-50%)",
                width: fem?48:58, height:32, borderRadius:8,
                backgroundColor: neckZ.item.dominantColor,
                backgroundImage:`linear-gradient(120deg,${shade(neckZ.item.dominantColor,-40)},${shade(neckZ.item.dominantColor,40)})`,
                boxShadow:`0 2px 8px #00000030`,
                cursor:"pointer",
                outline: neckZ.active ? "2px solid #7c3aed" : undefined,
                zIndex:10,
              }}/>
            )}
          </ZoneButton>

          {/* RIGHT ARM */}
          <div className="absolute flex flex-col items-center" style={{ right: fem?-6:2, top: fem?6:8 }}>
            <ZoneButton {...torsoZ} onClick={() => click("zone-torso")}
              style={{ ...clothStyle(sleeveColor), width: fem?20:24, height: fem?72:80, borderRadius:12, marginBottom:-1 }}/>
            <div style={{ ...skinStyle(), width: fem?16:20, height:16, borderRadius:"50%", zIndex:2 }}/>
            <div style={{ ...skinStyle(), width: fem?14:18, height: fem?56:60, borderRadius:10, marginTop:-2 }}/>
            <div style={{ ...skinStyle(), width: fem?16:20, height: fem?22:24, borderRadius:8, marginTop:-2 }}>
              {/* Watch on right wrist */}
              {watchZ.item && (
                <div onClick={watchZ.onClick} style={{
                  position:"absolute", top:-6, left:"50%", transform:"translateX(-50%)",
                  width: fem?24:28, height:12, borderRadius:6,
                  backgroundColor: watchZ.item.dominantColor,
                  backgroundImage:`linear-gradient(90deg,${shade(watchZ.item.dominantColor,-50)},${shade(watchZ.item.dominantColor,40)},${shade(watchZ.item.dominantColor,-50)})`,
                  boxShadow:`0 1px 4px #00000050`,
                  cursor:"pointer",
                  outline: watchZ.active ? "2px solid #7c3aed" : undefined,
                  zIndex:5,
                }}>
                  <div style={{ position:"absolute", top:2, left:"50%", transform:"translateX(-50%)", width:10, height:8, borderRadius:2, backgroundColor:shade(watchZ.item.dominantColor,55), border:`1px solid ${shade(watchZ.item.dominantColor,-40)}` }}/>
                </div>
              )}
            </div>

            {/* Bag hanging from right hand */}
            {bagZ.item && (
              <div onClick={bagZ.onClick} style={{ marginTop:4, cursor:"pointer", outline: bagZ.active ? "2px solid #7c3aed" : undefined, borderRadius:8 }}>
                {/* Handle */}
                <div style={{ width:24, height:10, borderRadius:"50% 50% 0 0", border:`2px solid ${shade(bagZ.item.dominantColor,-50)}`, borderBottom:"none", margin:"0 auto 0" }}/>
                {/* Bag body */}
                <div style={{
                  width: fem?46:52, height: fem?44:50, borderRadius:8,
                  backgroundColor: bagZ.item.dominantColor,
                  backgroundImage:`linear-gradient(120deg,${shade(bagZ.item.dominantColor,-55)},${shade(bagZ.item.dominantColor,45)} 45%,${shade(bagZ.item.dominantColor,-40)})`,
                  boxShadow:`0 3px 10px #00000040, inset -3px 0 8px ${shade(bagZ.item.dominantColor,-60)}44`,
                  border:`1.5px solid ${shade(bagZ.item.dominantColor,-50)}`,
                  position:"relative",
                }}>
                  <div style={{ position:"absolute", top:8, left:6, right:6, height:16, borderRadius:5, backgroundColor:shade(bagZ.item.dominantColor,-25), border:`1px solid ${shade(bagZ.item.dominantColor,-50)}` }}/>
                  <div style={{ position:"absolute", top:4, left:6, width:14, height:6, borderRadius:4, backgroundColor:shade(bagZ.item.dominantColor,55), opacity:0.4 }}/>
                  {/* Clasp */}
                  <div style={{ position:"absolute", top:6, left:"50%", transform:"translateX(-50%)", width:10, height:10, borderRadius:"50%", backgroundColor:shade(bagZ.item.dominantColor,50), border:`1px solid ${shade(bagZ.item.dominantColor,-40)}` }}/>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════ BELT ══════════════ */}
        {beltZ.item ? (
          <ZoneButton {...beltZ} style={{
            width: fem?84:106, height:14, borderRadius:4,
            backgroundColor: beltZ.item.dominantColor,
            backgroundImage:`linear-gradient(90deg,${shade(beltZ.item.dominantColor,-50)},${shade(beltZ.item.dominantColor,40)},${shade(beltZ.item.dominantColor,-50)})`,
            boxShadow:`0 1px 4px #00000040`,
            display:"flex", alignItems:"center", justifyContent:"center",
            position:"relative", zIndex:3, marginTop:-2,
          }}>
            {/* Buckle */}
            <div style={{ width:18, height:12, borderRadius:3, backgroundColor:shade(beltZ.item.dominantColor,60), border:`1.5px solid ${shade(beltZ.item.dominantColor,-50)}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:10, height:6, border:`1px solid ${shade(beltZ.item.dominantColor,-40)}`, borderRadius:1 }}/>
            </div>
          </ZoneButton>
        ) : (
          <div style={{ height:6, marginTop:-2 }}/>
        )}

        {/* ══════════════ LEGS ══════════════ */}
        <div className="flex justify-center gap-1.5" style={{ marginTop: 2 }}>
          {[0,1].map(side => (
            <ZoneButton key={side} {...legsZ}
              style={{
                ...clothStyle(legsColor),
                width: fem ? 36 : 44,
                height: fem ? 180 : 196,
                borderRadius: fem
                  ? "8px 8px 14px 14px"
                  : "6px 6px 12px 12px",
                position:"relative",
              }}>
              {/* Knee highlight */}
              <div style={{ position:"absolute", top:"48%", left:"20%", width:"60%", height:16, borderRadius:"50%", backgroundColor:shade(legsColor,45), opacity:0.25 }}/>
              {/* Thigh seam */}
              <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:1, height:"100%", backgroundColor:shade(legsColor,-45), opacity:0.2 }}/>
            </ZoneButton>
          ))}
        </div>

        {/* ══════════════ SHOES ══════════════ */}
        <div className="flex justify-center" style={{ gap: fem?4:6, marginTop:2 }}>
          {[0,1].map(side => (
            <ZoneButton key={side} {...feetZ}
              style={{
                width: fem ? 36 : 46,
                height: fem ? 22 : 20,
                borderRadius: fem ? "6px 6px 14px 14px" : "4px 4px 10px 10px",
                backgroundColor: feetColor,
                backgroundImage:`linear-gradient(105deg,${shade(feetColor,-55)},${shade(feetColor,35)} 40%,${shade(feetColor,-40)})`,
                boxShadow:`0 3px 8px #00000050, inset 0 -3px 6px ${shade(feetColor,-60)}55`,
                position:"relative",
              }}>
              {/* Shoe shine */}
              <div style={{ position:"absolute", top:3, left:4, width:"45%", height:6, borderRadius:"50%", backgroundColor:shade(feetColor,60), opacity:0.3 }}/>
              {/* Sole */}
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:5, borderRadius:"0 0 10px 10px", backgroundColor:shade(feetColor,-40) }}/>
            </ZoneButton>
          ))}
        </div>

        {/* ══════════════ HAT (absolute over head) ══════════════ */}
        {hatZ.item && (
          <div style={{ position:"absolute", top: fem?-16:-14, left:"50%", transform:"translateX(-50%)", zIndex:10, width: fem?120:110 }}>
            <ZoneButton {...hatZ} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
              {/* Crown */}
              <div style={{
                width: fem?78:72, height:38,
                borderRadius:"50% 50% 0 0 / 100% 100% 0 0",
                backgroundColor: hatZ.item.dominantColor,
                backgroundImage:`linear-gradient(105deg,${shade(hatZ.item.dominantColor,-55)},${shade(hatZ.item.dominantColor,50)} 42%,${shade(hatZ.item.dominantColor,-40)})`,
                boxShadow:`0 -2px 8px #00000030`,
                position:"relative",
              }}>
                <div style={{ position:"absolute", bottom:6, left:"20%", width:"60%", height:5, borderRadius:4, backgroundColor:shade(hatZ.item.dominantColor,-35), opacity:0.6 }}/>
              </div>
              {/* Brim */}
              <div style={{
                width: fem?116:106, height:12, marginTop:-2,
                borderRadius:8,
                backgroundColor: shade(hatZ.item.dominantColor,-30),
                backgroundImage:`linear-gradient(90deg,${shade(hatZ.item.dominantColor,-60)},${shade(hatZ.item.dominantColor,20)} 50%,${shade(hatZ.item.dominantColor,-60)})`,
                boxShadow:`0 3px 6px #00000040`,
              }}/>
            </ZoneButton>
          </div>
        )}

      </div>

      {/* ── Item legend ── */}
      <div className="mt-4 flex flex-wrap gap-1.5 justify-center max-w-[220px]">
        {outfit.items.map(item => (
          <div key={item.id} className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.dominantColor }}/>
            <span>{item.subcategory || item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
