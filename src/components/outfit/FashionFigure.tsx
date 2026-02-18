"use client";

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
  "zone-ears":  "Earrings / Jewelry",
  "zone-neck":  "Scarf / Necklace",
  "zone-torso": "Top / Outerwear",
  "zone-waist": "Belt",
  "zone-wrist": "Watch / Bracelet",
  "zone-hand":  "Bag",
  "zone-legs":  "Bottoms",
  "zone-feet":  "Shoes / Socks",
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

function gid(itemId: string) {
  return "cg_" + itemId.replace(/[^a-z0-9]/gi, "");
}

interface Props {
  outfit: Pick<OutfitCombination, "items">;
  gender: GenderExpression;
  activeZone: string | null;
  onZoneClick: (zone: string, category: Category) => void;
}

export function FashionFigure({ outfit, gender, activeZone, onZoneClick }: Props) {
  const fem = gender === GenderExpression.FEMININE;

  function handleClick(zoneId: string) {
    const cats = ZONE_CATEGORY_MAP[zoneId];
    if (cats?.length) onZoneClick(zoneId, cats[0]);
  }

  function zone(zoneId: string) {
    const item = getItem(zoneId, outfit.items);
    return {
      item,
      active: activeZone === zoneId,
      label: ZONE_LABELS[zoneId],
      onClick: () => handleClick(zoneId),
      fill: item ? `url(#${gid(item.id)})` : undefined,
      stroke: item ? shade(item.dominantColor, -60) : "#888",
    };
  }

  const items = outfit.items;

  // Skin palette
  const S = { base: "#C68642", hi: "#E8A86A", lo: "#8B5E3C", lip: "#B5706A", hair: fem ? "#2B1608" : "#1A0E05" };

  return (
    <div className="flex flex-col items-center w-full select-none">
      <p className="text-xs text-muted-foreground mb-3">Click a zone to swap items</p>

      <svg viewBox="0 0 280 620" width="190" height="421" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Skin */}
          <radialGradient id="rFace" cx="38%" cy="35%" r="62%">
            <stop offset="0%" stopColor={S.hi}/>
            <stop offset="55%" stopColor={S.base}/>
            <stop offset="100%" stopColor={S.lo}/>
          </radialGradient>
          <linearGradient id="lNeck" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={S.lo}/>
            <stop offset="40%" stopColor={S.base}/>
            <stop offset="65%" stopColor={S.hi}/>
            <stop offset="100%" stopColor={S.lo}/>
          </linearGradient>
          <linearGradient id="lArm" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={S.lo}/>
            <stop offset="30%" stopColor={S.hi}/>
            <stop offset="70%" stopColor={S.base}/>
            <stop offset="100%" stopColor={S.lo}/>
          </linearGradient>

          {/* Per-item cloth gradients */}
          {items.map(item => {
            const c = item.dominantColor;
            return (
              <linearGradient key={gid(item.id)} id={gid(item.id)} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor={shade(c, -60)}/>
                <stop offset="20%"  stopColor={shade(c, -20)}/>
                <stop offset="48%"  stopColor={shade(c, +65)}/>
                <stop offset="78%"  stopColor={shade(c, -20)}/>
                <stop offset="100%" stopColor={shade(c, -60)}/>
              </linearGradient>
            );
          })}
          {/* Vertical leg gradient */}
          {items.filter(i => [Category.BOTTOM, Category.DRESS].includes(i.category)).map(item => {
            const c = item.dominantColor;
            return (
              <linearGradient key={gid(item.id)+"v"} id={gid(item.id)+"v"} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor={shade(c, -55)}/>
                <stop offset="28%"  stopColor={shade(c, +40)}/>
                <stop offset="58%"  stopColor={shade(c, -10)}/>
                <stop offset="100%" stopColor={shade(c, -55)}/>
              </linearGradient>
            );
          })}

          {/* Shadow */}
          <filter id="ds">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000025"/>
          </filter>
          {/* Active glow */}
          <filter id="glow">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#7c3aed60"/>
          </filter>
        </defs>

        {/* ─────────── HAIR ─────────── */}
        {fem ? (
          <g>
            {/* Main hair mass behind face */}
            <ellipse cx="140" cy="75" rx="52" ry="58" fill={S.hair}/>
            {/* Side strands */}
            <path d="M88 90 Q70 130 72 185 Q78 198 84 188 Q84 155 92 115Z" fill={S.hair}/>
            <path d="M192 90 Q210 130 208 185 Q202 198 196 188 Q196 155 188 115Z" fill={S.hair}/>
            {/* Hair sheen */}
            <path d="M115 34 Q140 26 165 34" stroke={shade(S.hair,55)} strokeWidth="3" fill="none" opacity="0.45" strokeLinecap="round"/>
          </g>
        ) : (
          <g>
            <ellipse cx="140" cy="64" rx="44" ry="36" fill={S.hair}/>
            <rect x="96" y="38" width="88" height="28" rx="8" fill={S.hair}/>
            <ellipse cx="96" cy="76" rx="10" ry="18" fill={S.hair} opacity="0.55"/>
            <ellipse cx="184" cy="76" rx="10" ry="18" fill={S.hair} opacity="0.55"/>
          </g>
        )}

        {/* ─────────── HEAD ─────────── */}
        {fem
          ? <ellipse cx="140" cy="78" rx="44" ry="50" fill="url(#rFace)" filter="url(#ds)"/>
          : <ellipse cx="140" cy="74" rx="42" ry="46" fill="url(#rFace)" filter="url(#ds)"/>
        }

        {/* Ear lobes */}
        <ellipse cx={fem?97:99} cy={fem?88:84} rx="6" ry="8" fill={S.base} stroke={S.lo} strokeWidth="0.6"/>
        <ellipse cx={fem?183:181} cy={fem?88:84} rx="6" ry="8" fill={S.base} stroke={S.lo} strokeWidth="0.6"/>

        {/* ─────────── EYES / SUNGLASSES ─────────── */}
        {(() => {
          const z = zone("zone-eyes");
          const ey = fem ? 76 : 72;
          if (z.item) {
            const c = z.item.dominantColor;
            return (
              <g onClick={z.onClick} style={{cursor:"pointer"}} role="button" aria-label={`${z.label}: ${z.item.name}`} filter={z.active?"url(#glow)":undefined}>
                <rect x="108" y={ey-9} width="24" height="16" rx="7" fill={c} opacity="0.85" stroke={shade(c,-60)} strokeWidth={z.active?2.5:1.5}/>
                <rect x="136" y={ey-9} width="24" height="16" rx="7" fill={c} opacity="0.85" stroke={shade(c,-60)} strokeWidth={z.active?2.5:1.5}/>
                <line x1="132" y1={ey} x2="136" y2={ey} stroke={shade(c,-60)} strokeWidth="2"/>
                <line x1="108" y1={ey} x2="102" y2={ey+1} stroke={shade(c,-60)} strokeWidth="2"/>
                <line x1="160" y1={ey} x2="166" y2={ey+1} stroke={shade(c,-60)} strokeWidth="2"/>
                <ellipse cx="116" cy={ey-2} rx="4" ry="2.5" fill="white" opacity="0.28"/>
                <ellipse cx="144" cy={ey-2} rx="4" ry="2.5" fill="white" opacity="0.28"/>
              </g>
            );
          }
          return (
            <g>
              {/* Brows */}
              <path d={fem?`M118 ${ey-11}Q130 ${ey-15}142 ${ey-11}`:`M116 ${ey-10}Q129 ${ey-14}142 ${ey-10}`} stroke={S.hair} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d={fem?`M138 ${ey-11}Q150 ${ey-15}162 ${ey-11}`:`M138 ${ey-10}Q151 ${ey-14}164 ${ey-10}`} stroke={S.hair} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {/* Whites */}
              <ellipse cx="129" cy={ey} rx="9" ry={fem?7:6} fill="white"/>
              <ellipse cx="151" cy={ey} rx="9" ry={fem?7:6} fill="white"/>
              {/* Iris */}
              <circle cx="129" cy={ey} r={fem?5.5:5} fill="#4B3220"/>
              <circle cx="151" cy={ey} r={fem?5.5:5} fill="#4B3220"/>
              {/* Pupil */}
              <circle cx="129" cy={ey} r="2.8" fill="#1A0E05"/>
              <circle cx="151" cy={ey} r="2.8" fill="#1A0E05"/>
              {/* Catch light */}
              <circle cx="127" cy={ey-2} r="1.8" fill="white"/>
              <circle cx="149" cy={ey-2} r="1.8" fill="white"/>
              {/* Lash line */}
              <path d={`M120 ${ey-5}Q129 ${ey-9}138 ${ey-5}`} fill="none" stroke="#1A0E05" strokeWidth="1.2"/>
              <path d={`M142 ${ey-5}Q151 ${ey-9}160 ${ey-5}`} fill="none" stroke="#1A0E05" strokeWidth="1.2"/>
            </g>
          );
        })()}

        {/* ─────────── NOSE ─────────── */}
        <g opacity="0.55">
          {fem
            ? <><path d="M140 85 Q136 96 134 103 Q140 108 146 103 Q144 96 140 85" fill={S.lo} opacity="0.3"/><ellipse cx="135" cy="104" rx="4" ry="3" fill={S.lo} opacity="0.35"/><ellipse cx="145" cy="104" rx="4" ry="3" fill={S.lo} opacity="0.35"/></>
            : <><path d="M140 82 Q136 94 133 102 Q140 108 147 102 Q144 94 140 82" fill={S.lo} opacity="0.3"/><ellipse cx="133" cy="103" rx="4.5" ry="3" fill={S.lo} opacity="0.38"/><ellipse cx="147" cy="103" rx="4.5" ry="3" fill={S.lo} opacity="0.38"/></>
          }
        </g>

        {/* ─────────── LIPS ─────────── */}
        {fem
          ? <g><path d="M128 113 Q140 119 152 113 Q148 122 140 124 Q132 122 128 113Z" fill={S.lip}/><path d="M128 113 Q140 110 152 113" fill="none" stroke={shade(S.lip,-30)} strokeWidth="0.8"/><path d="M133 113 Q140 117 147 113" fill={shade(S.lip,25)} opacity="0.45"/></g>
          : <g><path d="M130 108 Q140 114 150 108 Q148 116 140 118 Q132 116 130 108Z" fill={S.lip} opacity="0.85"/><path d="M130 108 Q140 106 150 108" fill="none" stroke={shade(S.lip,-30)} strokeWidth="0.7"/></g>
        }

        {/* Cheek blush (fem) */}
        {fem && <><ellipse cx="110" cy="96" rx="12" ry="8" fill="#FF8888" opacity="0.14"/><ellipse cx="170" cy="96" rx="12" ry="8" fill="#FF8888" opacity="0.14"/></>}

        {/* ─────────── NECK ─────────── */}
        <rect x={fem?124:122} y={fem?125:118} width="32" height="32" rx="8" fill="url(#lNeck)"/>

        {/* ─────────── NECK ACCESSORY ─────────── */}
        {(() => {
          const z = zone("zone-neck");
          if (!z.item) return null;
          const c = z.item.dominantColor;
          const y0 = fem ? 131 : 124;
          return (
            <g onClick={z.onClick} style={{cursor:"pointer"}} role="button" aria-label={`${z.label}: ${z.item.name}`} filter={z.active?"url(#glow)":undefined}>
              {z.item.category === Category.SCARF ? (
                <>
                  <path d={`M112 ${y0} Q140 ${y0+18} 168 ${y0} Q168 ${y0+20} 140 ${y0+26} Q112 ${y0+20} 112 ${y0}Z`}
                    fill={c} stroke={shade(c,-50)} strokeWidth={z.active?2.5:1}/>
                  <path d={`M132 ${y0+22} Q128 ${y0+50} 126 ${y0+76}`} stroke={c} strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.9"/>
                </>
              ) : (
                <path d={`M118 ${y0+8} Q140 ${y0+22} 162 ${y0+8}`} fill="none" stroke={c} strokeWidth={z.active?5:3.5} strokeLinecap="round"/>
              )}
            </g>
          );
        })()}

        {/* ─────────── TORSO ─────────── */}
        {(() => {
          const z = zone("zone-torso");
          const c = z.item?.dominantColor;
          const fill = z.fill ?? (fem?"#D4B8A0":"#B8A898");
          const sk = c ? shade(c,-65) : "#7a6a60";

          /* Feminine: smooth hourglass. Masculine: broad inverted-trapezoid */
          const path = fem
            ? "M100 152 Q72 166 66 202 L68 260 Q76 278 106 288 Q122 294 140 294 Q158 294 174 288 Q204 278 212 260 L214 202 Q208 166 180 152 Q162 142 140 142 Q118 142 100 152Z"
            : "M88 148 Q58 164 50 200 L52 266 Q62 284 96 292 Q116 298 140 298 Q164 298 184 292 Q218 284 228 266 L230 200 Q222 164 192 148 Q168 138 140 138 Q112 138 88 148Z";

          return (
            <g onClick={z.onClick} style={{cursor:"pointer"}} role="button" aria-label={`${z.label}${z.item?`: ${z.item.name}`:" (empty)"}`}
              filter={z.active?"url(#glow)":"url(#ds)"}>
              <path d={path} fill={fill} stroke={sk} strokeWidth={z.active?3:1.5}/>
              {/* Neckline */}
              <path d={fem?"M118 148 Q140 164 162 148":"M116 144 Q140 158 164 144"} fill="none" stroke={sk} strokeWidth="1.5"/>
              {/* Waist suggestion (fem) */}
              {fem && <path d="M70 238 Q106 250 140 252 Q174 250 210 238" fill="none" stroke={sk} strokeWidth="0.8" opacity="0.4"/>}
              {/* Center seam */}
              {c && <path d={fem?"M140 148 L140 292":"M140 144 L140 296"} stroke={shade(c,-45)} strokeWidth="0.7" opacity="0.25" fill="none"/>}
            </g>
          );
        })()}

        {/* ─────────── ARMS ─────────── */}
        {(() => {
          const torso = getItem("zone-torso", items);
          const af = torso ? `url(#${gid(torso.id)})` : "url(#lArm)";
          const as_ = torso ? shade(torso.dominantColor,-65) : S.lo;

          if (fem) return (
            <>
              {/* Left upper arm */}
              <path d="M66 168 Q42 184 38 232 Q38 256 48 268 Q58 274 66 268 Q76 256 76 232 L78 172Z"
                fill={af} stroke={as_} strokeWidth="1.2" filter="url(#ds)"/>
              {/* Left forearm */}
              <path d="M48 268 Q38 288 40 314 Q44 330 56 332 Q68 332 70 318 Q72 300 66 268Z"
                fill="url(#lArm)" stroke={S.lo} strokeWidth="1"/>
              {/* Left hand */}
              <ellipse cx="54" cy="340" rx="13" ry="16" fill="url(#rFace)" stroke={S.lo} strokeWidth="0.8"/>

              {/* Right upper arm */}
              <path d="M214 168 Q238 184 242 232 Q242 256 232 268 Q222 274 214 268 Q204 256 202 232 L200 172Z"
                fill={af} stroke={as_} strokeWidth="1.2" filter="url(#ds)"/>
              {/* Right forearm */}
              <path d="M232 268 Q242 288 240 314 Q236 330 224 332 Q212 332 210 318 Q208 300 214 268Z"
                fill="url(#lArm)" stroke={S.lo} strokeWidth="1"/>
              {/* Right hand */}
              <ellipse cx="226" cy="340" rx="13" ry="16" fill="url(#rFace)" stroke={S.lo} strokeWidth="0.8"/>
            </>
          );

          return (
            <>
              {/* Left upper arm */}
              <path d="M50 168 Q24 186 20 238 Q20 264 32 278 Q44 284 52 278 Q64 264 64 238 L68 172Z"
                fill={af} stroke={as_} strokeWidth="1.2" filter="url(#ds)"/>
              {/* Left forearm */}
              <path d="M32 278 Q20 300 22 328 Q26 346 40 348 Q54 348 56 332 Q58 312 52 278Z"
                fill="url(#lArm)" stroke={S.lo} strokeWidth="1"/>
              <ellipse cx="38" cy="356" rx="15" ry="18" fill="url(#rFace)" stroke={S.lo} strokeWidth="0.8"/>

              {/* Right upper arm */}
              <path d="M230 168 Q256 186 260 238 Q260 264 248 278 Q236 284 228 278 Q216 264 216 238 L212 172Z"
                fill={af} stroke={as_} strokeWidth="1.2" filter="url(#ds)"/>
              {/* Right forearm */}
              <path d="M248 278 Q260 300 258 328 Q254 346 240 348 Q226 348 224 332 Q222 312 228 278Z"
                fill="url(#lArm)" stroke={S.lo} strokeWidth="1"/>
              <ellipse cx="242" cy="356" rx="15" ry="18" fill="url(#rFace)" stroke={S.lo} strokeWidth="0.8"/>
            </>
          );
        })()}

        {/* ─────────── BELT ─────────── */}
        {(() => {
          const z = zone("zone-waist");
          if (!z.item) return null;
          const c = z.item.dominantColor;
          const y = fem ? 284 : 290;
          const x = fem ? 72 : 58;
          const w = fem ? 136 : 164;
          return (
            <g onClick={z.onClick} style={{cursor:"pointer"}} role="button" aria-label={`${z.label}: ${z.item.name}`} filter={z.active?"url(#glow)":undefined}>
              <rect x={x} y={y} width={w} height="18" rx="5" fill={c} stroke={shade(c,-55)} strokeWidth={z.active?3:1.5}/>
              {/* Buckle */}
              <rect x="130" y={y+1} width="20" height="16" rx="4" fill={shade(c,50)} stroke={shade(c,-45)} strokeWidth="1.2"/>
              <rect x="133" y={y+4} width="14" height="10" rx="2" fill="none" stroke={shade(c,-45)} strokeWidth="1"/>
              <line x1="140" y1={y+1} x2="140" y2={y+17} stroke={shade(c,-45)} strokeWidth="1"/>
            </g>
          );
        })()}

        {/* ─────────── LEGS ─────────── */}
        {(() => {
          const z = zone("zone-legs");
          const legsItem = z.item;
          const fill = legsItem ? `url(#${gid(legsItem.id)}v)` : "#787888";
          const sk = legsItem ? shade(legsItem.dominantColor,-60) : "#505060";
          const baseY = fem ? 298 : 304;

          return (
            <g onClick={z.onClick} style={{cursor:"pointer"}} role="button" aria-label={`${z.label}${legsItem?`: ${legsItem.name}`:" (empty)"}`}
              filter={z.active?"url(#glow)":"url(#ds)"}>
              {fem ? (
                <>
                  <path d={`M72 ${baseY} Q64 356 62 424 L66 536 L120 536 L130 454 L140 ${baseY+4}Z`}
                    fill={fill} stroke={sk} strokeWidth={z.active?3:1.5}/>
                  <path d={`M208 ${baseY} Q216 356 218 424 L214 536 L160 536 L150 454 L140 ${baseY+4}Z`}
                    fill={fill} stroke={sk} strokeWidth={z.active?3:1.5}/>
                  {/* Crotch */}
                  {legsItem && <path d={`M94 ${baseY+6} Q140 ${baseY+28} 186 ${baseY+6}`} fill="none" stroke={shade(legsItem.dominantColor,-55)} strokeWidth="1.5" opacity="0.5"/>}
                </>
              ) : (
                <>
                  <path d={`M58 ${baseY} Q48 360 46 428 L50 536 L108 536 L120 458 L136 ${baseY+6}Z`}
                    fill={fill} stroke={sk} strokeWidth={z.active?3:1.5}/>
                  <path d={`M222 ${baseY} Q232 360 234 428 L230 536 L172 536 L160 458 L144 ${baseY+6}Z`}
                    fill={fill} stroke={sk} strokeWidth={z.active?3:1.5}/>
                  {legsItem && <path d={`M82 ${baseY+6} Q140 ${baseY+32} 198 ${baseY+6}`} fill="none" stroke={shade(legsItem.dominantColor,-55)} strokeWidth="1.5" opacity="0.5"/>}
                </>
              )}
              {/* Knee highlights */}
              {legsItem && (
                <>
                  <ellipse cx={fem?82:68} cy="432" rx="12" ry="9" fill={shade(legsItem.dominantColor,40)} opacity="0.22"/>
                  <ellipse cx={fem?198:212} cy="432" rx="12" ry="9" fill={shade(legsItem.dominantColor,40)} opacity="0.22"/>
                </>
              )}
            </g>
          );
        })()}

        {/* ─────────── SHOES ─────────── */}
        {(() => {
          const z = zone("zone-feet");
          const fill = z.fill ?? "#2a2a3a";
          const sk = z.item ? shade(z.item.dominantColor,-65) : "#111";
          const sw = z.active ? 3 : 1.5;

          if (fem) return (
            <g onClick={z.onClick} style={{cursor:"pointer"}} role="button" aria-label={`${z.label}${z.item?`: ${z.item.name}`:" (empty)"}`}
              filter={z.active?"url(#glow)":"url(#ds)"}>
              {/* Left pump-style */}
              <path d="M62 536 Q52 552 50 570 Q52 586 72 588 Q94 588 96 572 L96 536Z"
                fill={fill} stroke={sk} strokeWidth={sw}/>
              <path d="M48 586 Q52 592 74 594 Q96 594 98 586" fill="none" stroke={sk} strokeWidth="2.5"/>
              {z.item && <ellipse cx="72" cy="546" rx="10" ry="5" fill={shade(z.item.dominantColor,60)} opacity="0.3"/>}
              {/* Right pump-style */}
              <path d="M218 536 Q228 552 230 570 Q228 586 208 588 Q186 588 184 572 L184 536Z"
                fill={fill} stroke={sk} strokeWidth={sw}/>
              <path d="M232 586 Q228 592 206 594 Q184 594 182 586" fill="none" stroke={sk} strokeWidth="2.5"/>
              {z.item && <ellipse cx="208" cy="546" rx="10" ry="5" fill={shade(z.item.dominantColor,60)} opacity="0.3"/>}
            </g>
          );

          return (
            <g onClick={z.onClick} style={{cursor:"pointer"}} role="button" aria-label={`${z.label}${z.item?`: ${z.item.name}`:" (empty)"}`}
              filter={z.active?"url(#glow)":"url(#ds)"}>
              {/* Left sneaker */}
              <path d="M46 536 Q34 552 32 572 Q34 588 60 590 Q84 590 86 572 L86 536Z"
                fill={fill} stroke={sk} strokeWidth={sw}/>
              <path d="M30 588 Q34 596 62 596 Q88 596 88 588" fill="none" stroke={sk} strokeWidth="3"/>
              {z.item && <ellipse cx="58" cy="548" rx="13" ry="6" fill={shade(z.item.dominantColor,60)} opacity="0.28"/>}
              {/* Right sneaker */}
              <path d="M234 536 Q246 552 248 572 Q246 588 220 590 Q196 590 194 572 L194 536Z"
                fill={fill} stroke={sk} strokeWidth={sw}/>
              <path d="M250 588 Q246 596 218 596 Q192 596 192 588" fill="none" stroke={sk} strokeWidth="3"/>
              {z.item && <ellipse cx="222" cy="548" rx="13" ry="6" fill={shade(z.item.dominantColor,60)} opacity="0.28"/>}
            </g>
          );
        })()}

        {/* ─────────── WRIST / WATCH ─────────── */}
        {(() => {
          const z = zone("zone-wrist");
          if (!z.item) return null;
          const c = z.item.dominantColor;
          const x = fem ? 26 : 14;
          const y = fem ? 316 : 326;
          return (
            <g onClick={z.onClick} style={{cursor:"pointer"}} role="button" aria-label={`${z.label}: ${z.item.name}`} filter={z.active?"url(#glow)":undefined}>
              <rect x={x} y={y} width="26" height="18" rx="6" fill={c} stroke={shade(c,-55)} strokeWidth={z.active?2.5:1.2}/>
              <rect x={x+5} y={y+3} width="16" height="12" rx="3.5" fill={shade(c,55)} stroke={shade(c,-40)} strokeWidth="0.8"/>
              {/* Clock hands */}
              <line x1={x+13} y1={y+9} x2={x+13} y2={y+5} stroke={shade(c,-65)} strokeWidth="1.2"/>
              <line x1={x+13} y1={y+9} x2={x+17} y2={y+9} stroke={shade(c,-65)} strokeWidth="1.2"/>
            </g>
          );
        })()}

        {/* ─────────── BAG ─────────── */}
        {(() => {
          const z = zone("zone-hand");
          if (!z.item) return null;
          const c = z.item.dominantColor;
          const bx = fem ? 220 : 228;
          const by = fem ? 342 : 360;
          return (
            <g onClick={z.onClick} style={{cursor:"pointer"}} role="button" aria-label={`${z.label}: ${z.item.name}`} filter={z.active?"url(#glow)":"url(#ds)"}>
              {/* Handle */}
              <path d={`M${bx+8} ${by} Q${bx+12} ${by-22} ${bx+28} ${by-22} Q${bx+44} ${by-22} ${bx+48} ${by}`}
                fill="none" stroke={shade(c,-50)} strokeWidth="3.5" strokeLinecap="round"/>
              {/* Body */}
              <rect x={bx} y={by} width="58" height="48" rx="10" fill={c} stroke={shade(c,-55)} strokeWidth={z.active?3:1.5}/>
              {/* Front pocket */}
              <rect x={bx+7} y={by+18} width="44" height="22" rx="6" fill={shade(c,-25)} stroke={shade(c,-55)} strokeWidth="1"/>
              {/* Clasp */}
              <circle cx={bx+29} cy={by+12} r="5" fill={shade(c,55)} stroke={shade(c,-45)} strokeWidth="1.2"/>
              <circle cx={bx+29} cy={by+12} r="2.5" fill="none" stroke={shade(c,-45)} strokeWidth="0.8"/>
              {/* Top shine */}
              <rect x={bx+5} y={by+3} width="18" height="7" rx="3.5" fill={shade(c,55)} opacity="0.38"/>
            </g>
          );
        })()}

        {/* ─────────── HAT ─────────── */}
        {(() => {
          const z = zone("zone-head");
          if (!z.item) return null;
          const c = z.item.dominantColor;
          const top = fem ? 30 : 26;
          return (
            <g onClick={z.onClick} style={{cursor:"pointer"}} role="button" aria-label={`${z.label}: ${z.item.name}`} filter={z.active?"url(#glow)":"url(#ds)"}>
              {/* Brim */}
              <ellipse cx="140" cy={top+28} rx="62" ry="13" fill={shade(c,-50)} stroke={shade(c,-60)} strokeWidth="1"/>
              {/* Crown */}
              <path d={`M92 ${top+28} Q88 ${top+4} 140 ${top-10} Q192 ${top+4} 188 ${top+28}Z`}
                fill={c} stroke={shade(c,-55)} strokeWidth={z.active?3:1.5}/>
              {/* Highlight */}
              <path d={`M112 ${top+20} Q140 ${top+8} 168 ${top+20}`} fill="none" stroke={shade(c,60)} strokeWidth="2.5" opacity="0.5" strokeLinecap="round"/>
              {/* Band */}
              <rect x="94" y={top+24} width="92" height="7" rx="2" fill={shade(c,-35)} stroke={shade(c,-55)} strokeWidth="0.6"/>
            </g>
          );
        })()}

        {/* ─────────── EARRINGS ─────────── */}
        {(() => {
          const z = zone("zone-ears");
          if (!z.item || z.item.category !== Category.JEWELRY) return null;
          const c = z.item.dominantColor;
          const ey = fem ? 95 : 91;
          return (
            <g onClick={z.onClick} style={{cursor:"pointer"}} role="button" aria-label={`${z.label}: ${z.item.name}`} filter={z.active?"url(#glow)":undefined}>
              <circle cx={fem?97:99} cy={ey} r="7" fill={c} stroke={shade(c,-50)} strokeWidth={z.active?2.5:1.2}/>
              <circle cx={fem?96:98} cy={ey-2} r="2.5" fill="white" opacity="0.38"/>
              {fem && <>
                <line x1="97" y1={ey+7} x2="97" y2={ey+20} stroke={c} strokeWidth="2.5"/>
                <circle cx="97" cy={ey+25} r="5" fill={c} stroke={shade(c,-50)} strokeWidth="1"/>
                <circle cx="96" cy={ey+23} r="2" fill="white" opacity="0.35"/>
              </>}
              <circle cx={fem?183:181} cy={ey} r="7" fill={c} stroke={shade(c,-50)} strokeWidth={z.active?2.5:1.2}/>
              <circle cx={fem?182:180} cy={ey-2} r="2.5" fill="white" opacity="0.38"/>
              {fem && <>
                <line x1="183" y1={ey+7} x2="183" y2={ey+20} stroke={c} strokeWidth="2.5"/>
                <circle cx="183" cy={ey+25} r="5" fill={c} stroke={shade(c,-50)} strokeWidth="1"/>
                <circle cx="182" cy={ey+23} r="2" fill="white" opacity="0.35"/>
              </>}
            </g>
          );
        })()}

      </svg>

      {/* Item legend */}
      <div className="mt-2 flex flex-wrap gap-1.5 justify-center max-w-[220px]">
        {outfit.items.map(item => (
          <div key={item.id} className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor: item.dominantColor}}/>
            <span>{item.subcategory || item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
