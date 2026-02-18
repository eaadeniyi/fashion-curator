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

function getItemForZone(zone: string, items: FashionItem[]): FashionItem | null {
  const cats = ZONE_CATEGORY_MAP[zone];
  if (!cats) return null;
  return items.find((i) => cats.includes(i.category)) ?? null;
}

function hex2rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function shade(hex: string, pct: number): string {
  const [r, g, b] = hex2rgb(hex);
  const f = 1 + pct / 100;
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v * f)));
  return `rgb(${clamp(r)},${clamp(g)},${clamp(b)})`;
}

// Build a 3-stop radial gradient id for a color (dark → mid → highlight)
function gradId(id: string) { return `g_${id.replace(/[^a-z0-9]/gi, "_")}`; }

interface Props {
  outfit: Pick<OutfitCombination, "items">;
  gender: GenderExpression;
  activeZone: string | null;
  onZoneClick: (zone: string, category: Category) => void;
}

export function FashionFigure({ outfit, gender, activeZone, onZoneClick }: Props) {
  const fem = gender === GenderExpression.FEMININE;

  function click(zoneId: string) {
    const cats = ZONE_CATEGORY_MAP[zoneId];
    if (cats?.length) onZoneClick(zoneId, cats[0]);
  }

  function zoneProps(zoneId: string) {
    const item = getItemForZone(zoneId, outfit.items);
    const active = activeZone === zoneId;
    return { item, active, label: ZONE_LABELS[zoneId], onClick: () => click(zoneId) };
  }

  // Collect unique item colors for gradient defs
  const uniqueItems = [...new Map(outfit.items.map(i => [i.id, i])).values()];

  // Skin tones
  const skin = "#D4956A";
  const skinHi = "#EDBA8E";
  const skinSh = "#A06840";
  const hair = fem ? "#2C1A0A" : "#1A0F06";

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-xs text-muted-foreground mb-3">
        Click a zone on the figure to swap items
      </p>

      <svg
        viewBox="0 0 240 560"
        width="200"
        height="467"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <defs>
          {/* ── Skin gradients ── */}
          <radialGradient id="skinFace" cx="42%" cy="38%" r="58%">
            <stop offset="0%" stopColor={skinHi} />
            <stop offset="55%" stopColor={skin} />
            <stop offset="100%" stopColor={skinSh} />
          </radialGradient>
          <linearGradient id="skinNeck" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={skinSh} />
            <stop offset="40%" stopColor={skin} />
            <stop offset="70%" stopColor={skinHi} />
            <stop offset="100%" stopColor={skinSh} />
          </linearGradient>
          <linearGradient id="skinArm" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={skinSh} />
            <stop offset="30%" stopColor={skinHi} />
            <stop offset="65%" stopColor={skin} />
            <stop offset="100%" stopColor={skinSh} />
          </linearGradient>
          <linearGradient id="skinLeg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={skinSh} />
            <stop offset="35%" stopColor={skinHi} />
            <stop offset="70%" stopColor={skin} />
            <stop offset="100%" stopColor={skinSh} />
          </linearGradient>
          <radialGradient id="skinHand" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor={skinHi} />
            <stop offset="100%" stopColor={skinSh} />
          </radialGradient>

          {/* ── Per-item color gradients (3D cloth look) ── */}
          {uniqueItems.map(item => {
            const id = gradId(item.id);
            const hi = shade(item.dominantColor, 55);
            const mid = item.dominantColor;
            const lo = shade(item.dominantColor, -45);
            return (
              <linearGradient key={id} id={id} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={lo} />
                <stop offset="22%" stopColor={mid} />
                <stop offset="50%" stopColor={hi} />
                <stop offset="78%" stopColor={mid} />
                <stop offset="100%" stopColor={lo} />
              </linearGradient>
            );
          })}

          {/* Vertical cloth gradient for legs */}
          {uniqueItems.map(item => {
            const id = gradId(item.id) + "_v";
            const hi = shade(item.dominantColor, 45);
            const lo = shade(item.dominantColor, -35);
            return (
              <linearGradient key={id} id={id} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={lo} />
                <stop offset="30%" stopColor={hi} />
                <stop offset="60%" stopColor={item.dominantColor} />
                <stop offset="100%" stopColor={lo} />
              </linearGradient>
            );
          })}

          {/* Hair gradient */}
          <radialGradient id="hairGrad" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor={shade(hair, 60)} />
            <stop offset="60%" stopColor={hair} />
            <stop offset="100%" stopColor={shade(hair, -20)} />
          </radialGradient>

          {/* Drop shadow filter */}
          <filter id="softShadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="#00000030" />
          </filter>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#7c3aed80" />
          </filter>
        </defs>

        {/* ═══════════════════════════════════
            HAIR (behind head)
        ═══════════════════════════════════ */}
        {fem ? (
          <g>
            {/* Back hair mass */}
            <ellipse cx="120" cy="66" rx="42" ry="48" fill={hair} />
            {/* Side locks */}
            <path d="M78 75 Q60 110 62 155 Q66 168 72 160 Q72 130 80 95Z" fill={hair} />
            <path d="M162 75 Q180 110 178 155 Q174 168 168 160 Q168 130 160 95Z" fill={hair} />
            {/* Parting highlight */}
            <path d="M110 30 Q120 22 130 30" stroke={shade(hair, 50)} strokeWidth="2" fill="none" opacity="0.5" />
          </g>
        ) : (
          <g>
            {/* Short masculine hair */}
            <ellipse cx="120" cy="58" rx="38" ry="30" fill={hair} />
            <rect x="82" y="36" width="76" height="24" rx="6" fill={hair} />
            {/* Fade sides */}
            <ellipse cx="82" cy="66" rx="8" ry="14" fill={hair} opacity="0.6" />
            <ellipse cx="158" cy="66" rx="8" ry="14" fill={hair} opacity="0.6" />
          </g>
        )}

        {/* ═══════════════════════════════════
            HEAD
        ═══════════════════════════════════ */}
        <g filter="url(#softShadow)">
          {fem ? (
            <ellipse cx="120" cy="68" rx="36" ry="42" fill="url(#skinFace)" />
          ) : (
            <ellipse cx="120" cy="65" rx="34" ry="38" fill="url(#skinFace)" />
          )}
        </g>

        {/* ── Ear lobes ── */}
        <ellipse cx={fem ? 84 : 86} cy={fem ? 75 : 72} rx="5" ry="7" fill={skin} stroke={skinSh} strokeWidth="0.5" />
        <ellipse cx={fem ? 156 : 154} cy={fem ? 75 : 72} rx="5" ry="7" fill={skin} stroke={skinSh} strokeWidth="0.5" />

        {/* ── Eyes ── */}
        {(() => {
          const ey = fem ? 66 : 63;
          const { item, active, label, onClick } = zoneProps("zone-eyes");
          return (
            <g onClick={onClick} style={{ cursor: "pointer" }} role="button" aria-label={`${label}${item ? `: ${item.name}` : " (empty)"}`}>
              {item ? (
                /* Sunglasses */
                <>
                  <rect x="95" y={ey - 8} width="20" height="14" rx="6"
                    fill={item.dominantColor} opacity="0.82"
                    stroke={shade(item.dominantColor, -50)} strokeWidth={active ? 2.5 : 1.5}
                    filter={active ? "url(#glow)" : undefined} />
                  <rect x="118" y={ey - 8} width="20" height="14" rx="6"
                    fill={item.dominantColor} opacity="0.82"
                    stroke={shade(item.dominantColor, -50)} strokeWidth={active ? 2.5 : 1.5} />
                  <line x1="115" y1={ey} x2="118" y2={ey} stroke={shade(item.dominantColor, -50)} strokeWidth="1.5" />
                  <line x1="95" y1={ey} x2="90" y2={ey + 1} stroke={shade(item.dominantColor, -50)} strokeWidth="1.5" />
                  <line x1="138" y1={ey} x2="143" y2={ey + 1} stroke={shade(item.dominantColor, -50)} strokeWidth="1.5" />
                  {/* Lens shine */}
                  <ellipse cx="101" cy={ey - 2} rx="3" ry="2" fill="white" opacity="0.3" />
                  <ellipse cx="124" cy={ey - 2} rx="3" ry="2" fill="white" opacity="0.3" />
                </>
              ) : (
                /* Normal eyes */
                <>
                  {/* Eyebrows */}
                  <path d={fem ? `M103 ${ey-10} Q110 ${ey-13} 117 ${ey-10}` : `M102 ${ey-9} Q110 ${ey-12} 118 ${ey-9}`}
                    stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d={fem ? `M123 ${ey-10} Q130 ${ey-13} 137 ${ey-10}` : `M122 ${ey-9} Q130 ${ey-12} 138 ${ey-9}`}
                    stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round" />
                  {/* Eyes */}
                  <ellipse cx="110" cy={ey} rx="6" ry={fem ? 5 : 4.5} fill="white" />
                  <ellipse cx="130" cy={ey} rx="6" ry={fem ? 5 : 4.5} fill="white" />
                  <ellipse cx="110" cy={ey} rx="4" ry={fem ? 4 : 3.5} fill="#3D2314" />
                  <ellipse cx="130" cy={ey} rx="4" ry={fem ? 4 : 3.5} fill="#3D2314" />
                  <circle cx="108" cy={ey - 1} r="1.2" fill="white" />
                  <circle cx="128" cy={ey - 1} r="1.2" fill="white" />
                  {/* Eyelid line */}
                  <path d={`M104 ${ey-4} Q110 ${ey-7} 116 ${ey-4}`} fill="none" stroke="#3D2314" strokeWidth="1" />
                  <path d={`M124 ${ey-4} Q130 ${ey-7} 136 ${ey-4}`} fill="none" stroke="#3D2314" strokeWidth="1" />
                </>
              )}
            </g>
          );
        })()}

        {/* ── Nose ── */}
        <g opacity="0.6">
          <path
            d={fem
              ? "M120 70 Q117 80 115 86 Q120 90 125 86 Q123 80 120 70"
              : "M120 68 Q117 78 114 85 Q120 89 126 85 Q123 78 120 68"}
            fill={skinSh} opacity="0.35"
          />
          <ellipse cx={fem ? 116 : 115} cy={fem ? 87 : 85} rx="3.5" ry="2.5" fill={skinSh} opacity="0.4" />
          <ellipse cx={fem ? 124 : 125} cy={fem ? 87 : 85} rx="3.5" ry="2.5" fill={skinSh} opacity="0.4" />
        </g>

        {/* ── Lips ── */}
        {fem ? (
          <g>
            <path d="M111 96 Q120 100 129 96 Q126 104 120 106 Q114 104 111 96Z" fill="#C47A7A" />
            <path d="M111 96 Q120 93 129 96" fill="none" stroke="#A05050" strokeWidth="0.8" />
            <path d="M115 96 Q120 99 125 96" fill={shade("#C47A7A", 20)} opacity="0.5" />
          </g>
        ) : (
          <g>
            <path d="M112 91 Q120 95 128 91 Q126 98 120 100 Q114 98 112 91Z" fill="#B06060" opacity="0.8" />
            <path d="M112 91 Q120 88 128 91" fill="none" stroke="#904040" strokeWidth="0.7" />
          </g>
        )}

        {/* ── Cheek blush (feminine) ── */}
        {fem && (
          <>
            <ellipse cx="96" cy="80" rx="9" ry="6" fill="#FF9090" opacity="0.18" />
            <ellipse cx="144" cy="80" rx="9" ry="6" fill="#FF9090" opacity="0.18" />
          </>
        )}

        {/* ═══════════════════════════════════
            NECK
        ═══════════════════════════════════ */}
        {(() => {
          const { item, active, label, onClick } = zoneProps("zone-neck");
          return (
            <>
              <rect x="107" y={fem ? 108 : 100} width="26" height="28" rx="6" fill="url(#skinNeck)" />
              {item && (
                <g onClick={onClick} style={{ cursor: "pointer" }} role="button" aria-label={`${label}: ${item.name}`}>
                  {item.category === Category.SCARF ? (
                    <>
                      <path
                        d={`M98 ${fem ? 114 : 106} Q120 ${fem ? 126 : 118} 142 ${fem ? 114 : 106} Q142 ${fem ? 130 : 122} 120 ${fem ? 136 : 128} Q98 ${fem ? 130 : 122} 98 ${fem ? 114 : 106}Z`}
                        fill={item.dominantColor}
                        stroke={shade(item.dominantColor, -40)}
                        strokeWidth={active ? 2.5 : 1}
                        filter={active ? "url(#glow)" : undefined}
                      />
                      <path d={`M112 ${fem ? 134 : 126} Q108 ${fem ? 160 : 152} 106 ${fem ? 185 : 177}`}
                        stroke={item.dominantColor} strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.9" />
                    </>
                  ) : (
                    /* Necklace */
                    <path
                      d={`M102 ${fem ? 116 : 108} Q120 ${fem ? 130 : 122} 138 ${fem ? 116 : 108}`}
                      fill="none"
                      stroke={item.dominantColor}
                      strokeWidth={active ? 4 : 3}
                      strokeLinecap="round"
                      filter={active ? "url(#glow)" : undefined}
                    />
                  )}
                </g>
              )}
            </>
          );
        })()}

        {/* ═══════════════════════════════════
            TORSO — TOP / DRESS / OUTERWEAR
        ═══════════════════════════════════ */}
        {(() => {
          const { item, active, label, onClick } = zoneProps("zone-torso");
          const fill = item ? `url(#${gradId(item.id)})` : (fem ? "#e8d5c4" : "#d0c4b8");
          const stroke = item ? shade(item.dominantColor, -55) : "#b0a090";

          if (fem) {
            return (
              <g onClick={onClick} style={{ cursor: "pointer" }} role="button" aria-label={`${label}${item ? `: ${item.name}` : " (empty)"}`}
                filter={active ? "url(#glow)" : "url(#softShadow)"}>
                {/* Feminine torso — hourglass shape */}
                <path
                  d="M82 132 Q58 148 54 178 L56 228 Q62 246 88 256 Q104 262 120 262 Q136 262 152 256 Q178 246 184 228 L186 178 Q182 148 158 132 Q142 122 120 122 Q98 122 82 132Z"
                  fill={fill} stroke={stroke} strokeWidth={active ? 3 : 1.5}
                />
                {/* Waist cinch */}
                <path d="M56 210 Q78 222 120 226 Q162 222 184 210" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
                {/* Neckline */}
                <path d="M100 128 Q120 144 140 128" fill="none" stroke={stroke} strokeWidth="1.5" />
                {/* Shoulder seams */}
                <path d="M82 132 Q70 128 62 134" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.7" />
                <path d="M158 132 Q170 128 178 134" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.7" />
                {/* Center fold */}
                {item && <path d="M120 130 L120 260" stroke={shade(item.dominantColor, -40)} strokeWidth="0.6" opacity="0.3" fill="none" />}
                {item && <path d="M96 140 Q98 200 98 255" stroke={shade(item.dominantColor, -40)} strokeWidth="0.5" opacity="0.2" fill="none" />}
                {item && <path d="M144 140 Q142 200 142 255" stroke={shade(item.dominantColor, -40)} strokeWidth="0.5" opacity="0.2" fill="none" />}
              </g>
            );
          } else {
            return (
              <g onClick={onClick} style={{ cursor: "pointer" }} role="button" aria-label={`${label}${item ? `: ${item.name}` : " (empty)"}`}
                filter={active ? "url(#glow)" : "url(#softShadow)"}>
                {/* Masculine torso — broader, boxier */}
                <path
                  d="M74 130 Q48 146 44 176 L46 234 Q56 252 88 260 Q104 264 120 264 Q136 264 152 260 Q184 252 194 234 L196 176 Q192 146 166 130 Q146 120 120 120 Q94 120 74 130Z"
                  fill={fill} stroke={stroke} strokeWidth={active ? 3 : 1.5}
                />
                <path d="M98 126 Q120 138 142 126" fill="none" stroke={stroke} strokeWidth="1.5" />
                <path d="M74 130 Q62 126 54 132" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.7" />
                <path d="M166 130 Q178 126 186 132" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.7" />
                {/* Pec/chest subtle shading */}
                {item && <path d="M120 128 L120 262" stroke={shade(item.dominantColor, -40)} strokeWidth="0.7" opacity="0.25" fill="none" />}
                {item && <path d="M90 144 Q92 204 92 258" stroke={shade(item.dominantColor, -40)} strokeWidth="0.5" opacity="0.18" fill="none" />}
                {item && <path d="M150 144 Q148 204 148 258" stroke={shade(item.dominantColor, -40)} strokeWidth="0.5" opacity="0.18" fill="none" />}
              </g>
            );
          }
        })()}

        {/* ═══════════════════════════════════
            ARMS
        ═══════════════════════════════════ */}
        {(() => {
          const torso = getItemForZone("zone-torso", outfit.items);
          const sleeveGrad = torso ? `url(#${gradId(torso.id)})` : "url(#skinArm)";
          const sleeveStroke = torso ? shade(torso.dominantColor, -55) : skinSh;

          if (fem) {
            return (
              <>
                {/* Left arm */}
                <path d="M54 148 Q32 164 28 210 Q28 236 36 250 Q44 256 52 250 Q60 236 62 210 L62 152Z"
                  fill={sleeveGrad} stroke={sleeveStroke} strokeWidth="1" filter="url(#softShadow)" />
                {/* Left forearm skin */}
                <path d="M36 250 Q28 268 30 290 Q34 306 44 308 Q54 308 56 294 Q58 276 52 250Z"
                  fill="url(#skinArm)" stroke={skinSh} strokeWidth="0.8" />
                {/* Left hand */}
                <ellipse cx="42" cy="314" rx="11" ry="14" fill="url(#skinHand)" stroke={skinSh} strokeWidth="0.8" />

                {/* Right arm */}
                <path d="M186 148 Q208 164 212 210 Q212 236 204 250 Q196 256 188 250 Q180 236 178 210 L178 152Z"
                  fill={sleeveGrad} stroke={sleeveStroke} strokeWidth="1" filter="url(#softShadow)" />
                {/* Right forearm skin */}
                <path d="M204 250 Q212 268 210 290 Q206 306 196 308 Q186 308 184 294 Q182 276 188 250Z"
                  fill="url(#skinArm)" stroke={skinSh} strokeWidth="0.8" />
                {/* Right hand */}
                <ellipse cx="198" cy="314" rx="11" ry="14" fill="url(#skinHand)" stroke={skinSh} strokeWidth="0.8" />
              </>
            );
          } else {
            return (
              <>
                {/* Left arm — thicker masculine */}
                <path d="M44 150 Q20 168 16 218 Q16 246 26 260 Q36 266 44 260 Q54 246 56 218 L56 154Z"
                  fill={sleeveGrad} stroke={sleeveStroke} strokeWidth="1" filter="url(#softShadow)" />
                <path d="M26 260 Q16 280 18 302 Q22 318 34 320 Q46 320 48 306 Q50 288 44 260Z"
                  fill="url(#skinArm)" stroke={skinSh} strokeWidth="0.8" />
                <ellipse cx="32" cy="326" rx="13" ry="16" fill="url(#skinHand)" stroke={skinSh} strokeWidth="0.8" />

                {/* Right arm */}
                <path d="M196 150 Q220 168 224 218 Q224 246 214 260 Q204 266 196 260 Q186 246 184 218 L184 154Z"
                  fill={sleeveGrad} stroke={sleeveStroke} strokeWidth="1" filter="url(#softShadow)" />
                <path d="M214 260 Q224 280 222 302 Q218 318 206 320 Q194 320 192 306 Q190 288 196 260Z"
                  fill="url(#skinArm)" stroke={skinSh} strokeWidth="0.8" />
                <ellipse cx="208" cy="326" rx="13" ry="16" fill="url(#skinHand)" stroke={skinSh} strokeWidth="0.8" />
              </>
            );
          }
        })()}

        {/* ═══════════════════════════════════
            BELT / WAIST
        ═══════════════════════════════════ */}
        {(() => {
          const { item, active, label, onClick } = zoneProps("zone-waist");
          if (!item) return null;
          const bc = item.dominantColor;
          const bd = shade(bc, -50);
          const bl = shade(bc, 45);
          return (
            <g onClick={onClick} style={{ cursor: "pointer" }} role="button" aria-label={`${label}: ${item.name}`}
              filter={active ? "url(#glow)" : undefined}>
              <rect x={fem ? 58 : 50} y={fem ? 254 : 258} width={fem ? 124 : 140} height="16" rx="4"
                fill={bc} stroke={bd} strokeWidth={active ? 2.5 : 1} />
              {/* Buckle */}
              <rect x="113" y={fem ? 255 : 259} width="14" height="14" rx="3" fill={bl} stroke={bd} strokeWidth="1" />
              <rect x="115" y={fem ? 258 : 262} width="10" height="8" rx="1.5" fill="none" stroke={bd} strokeWidth="1" />
            </g>
          );
        })()}

        {/* ═══════════════════════════════════
            LEGS
        ═══════════════════════════════════ */}
        {(() => {
          const { item, active, label, onClick } = zoneProps("zone-legs");
          const fill = item ? `url(#${gradId(item.id)}_v)` : "#9090a0";
          const stroke = item ? shade(item.dominantColor, -55) : "#606070";
          const baseY = fem ? 266 : 270;

          return (
            <g onClick={onClick} style={{ cursor: "pointer" }} role="button" aria-label={`${label}${item ? `: ${item.name}` : " (empty)"}`}
              filter={active ? "url(#glow)" : "url(#softShadow)"}>
              {/* Left leg */}
              <path
                d={fem
                  ? `M62 ${baseY} Q56 314 54 374 L58 468 L100 468 L108 392 L116 ${baseY}Z`
                  : `M54 ${baseY} Q46 316 44 378 L48 468 L94 468 L104 396 L116 ${baseY}Z`}
                fill={fill} stroke={stroke} strokeWidth={active ? 2.5 : 1.5}
              />
              {/* Right leg */}
              <path
                d={fem
                  ? `M178 ${baseY} Q184 314 186 374 L182 468 L140 468 L132 392 L124 ${baseY}Z`
                  : `M186 ${baseY} Q194 316 196 378 L192 468 L146 468 L136 396 L124 ${baseY}Z`}
                fill={fill} stroke={stroke} strokeWidth={active ? 2.5 : 1.5}
              />
              {/* Crotch seam */}
              {item && (
                <path
                  d={fem ? `M80 ${baseY + 4} Q120 ${baseY + 22} 160 ${baseY + 4}` : `M72 ${baseY + 4} Q120 ${baseY + 24} 168 ${baseY + 4}`}
                  fill="none" stroke={shade(item.dominantColor, -50)} strokeWidth="1.2" opacity="0.55"
                />
              )}
              {/* Fold lines */}
              {item && (
                <>
                  <path d={fem ? `M80 ${baseY + 10} Q80 400 80 460` : `M72 ${baseY + 10} Q72 404 72 462`}
                    stroke={shade(item.dominantColor, -40)} strokeWidth="0.6" opacity="0.22" fill="none" />
                  <path d={fem ? `M160 ${baseY + 10} Q160 400 160 460` : `M168 ${baseY + 10} Q168 404 168 462`}
                    stroke={shade(item.dominantColor, -40)} strokeWidth="0.6" opacity="0.22" fill="none" />
                </>
              )}
              {/* Knee highlight */}
              {item && (
                <>
                  <ellipse cx={fem ? 74 : 66} cy="370" rx="10" ry="8" fill={shade(item.dominantColor, 30)} opacity="0.25" />
                  <ellipse cx={fem ? 166 : 174} cy="370" rx="10" ry="8" fill={shade(item.dominantColor, 30)} opacity="0.25" />
                </>
              )}
            </g>
          );
        })()}

        {/* ═══════════════════════════════════
            FEET / SHOES
        ═══════════════════════════════════ */}
        {(() => {
          const { item, active, label, onClick } = zoneProps("zone-feet");
          const fill = item ? `url(#${gradId(item.id)})` : "#3a3a4a";
          const stroke = item ? shade(item.dominantColor, -60) : "#1a1a2a";

          if (fem) {
            return (
              <g onClick={onClick} style={{ cursor: "pointer" }} role="button" aria-label={`${label}${item ? `: ${item.name}` : " (empty)"}`}
                filter={active ? "url(#glow)" : "url(#softShadow)"}>
                {/* Left shoe */}
                <path d="M54 468 Q46 480 44 496 Q46 510 64 512 Q82 512 84 498 L84 468Z"
                  fill={fill} stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
                <path d="M42 510 Q46 516 66 516 Q84 516 86 510" fill="none" stroke={stroke} strokeWidth="2" />
                {/* Shoe highlight */}
                {item && <ellipse cx="62" cy="476" rx="8" ry="4" fill={shade(item.dominantColor, 55)} opacity="0.35" />}
                {/* Right shoe */}
                <path d="M186 468 Q194 480 196 496 Q194 510 176 512 Q158 512 156 498 L156 468Z"
                  fill={fill} stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
                <path d="M198 510 Q194 516 174 516 Q156 516 154 510" fill="none" stroke={stroke} strokeWidth="2" />
                {item && <ellipse cx="178" cy="476" rx="8" ry="4" fill={shade(item.dominantColor, 55)} opacity="0.35" />}
              </g>
            );
          } else {
            return (
              <g onClick={onClick} style={{ cursor: "pointer" }} role="button" aria-label={`${label}${item ? `: ${item.name}` : " (empty)"}`}
                filter={active ? "url(#glow)" : "url(#softShadow)"}>
                {/* Left shoe — wider masculine */}
                <path d="M44 468 Q34 482 32 498 Q34 514 58 516 Q80 516 82 500 L82 468Z"
                  fill={fill} stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
                <path d="M30 514 Q34 520 60 520 Q84 520 84 514" fill="none" stroke={stroke} strokeWidth="2.5" />
                {item && <ellipse cx="56" cy="478" rx="10" ry="5" fill={shade(item.dominantColor, 55)} opacity="0.3" />}
                {/* Right shoe */}
                <path d="M196 468 Q206 482 208 498 Q206 514 182 516 Q160 516 158 500 L158 468Z"
                  fill={fill} stroke={stroke} strokeWidth={active ? 2.5 : 1.5} />
                <path d="M210 514 Q206 520 180 520 Q156 520 156 514" fill="none" stroke={stroke} strokeWidth="2.5" />
                {item && <ellipse cx="184" cy="478" rx="10" ry="5" fill={shade(item.dominantColor, 55)} opacity="0.3" />}
              </g>
            );
          }
        })()}

        {/* ═══════════════════════════════════
            WRIST / WATCH
        ═══════════════════════════════════ */}
        {(() => {
          const { item, active, label, onClick } = zoneProps("zone-wrist");
          if (!item) return null;
          const x = fem ? 22 : 10;
          const y = fem ? 274 : 284;
          const wc = item.dominantColor;
          return (
            <g onClick={onClick} style={{ cursor: "pointer" }} role="button" aria-label={`${label}: ${item.name}`}
              filter={active ? "url(#glow)" : undefined}>
              {/* Strap */}
              <rect x={x} y={y} width="22" height="16" rx="5"
                fill={wc} stroke={shade(wc, -50)} strokeWidth={active ? 2 : 1} />
              {/* Watch face */}
              <rect x={x + 4} y={y + 3} width="14" height="10" rx="3"
                fill={shade(wc, 50)} stroke={shade(wc, -40)} strokeWidth="0.8" />
              {/* Hands */}
              <line x1={x + 11} y1={y + 8} x2={x + 11} y2={y + 5} stroke={shade(wc, -60)} strokeWidth="1" />
              <line x1={x + 11} y1={y + 8} x2={x + 14} y2={y + 8} stroke={shade(wc, -60)} strokeWidth="1" />
            </g>
          );
        })()}

        {/* ═══════════════════════════════════
            BAG (hand area right side)
        ═══════════════════════════════════ */}
        {(() => {
          const { item, active, label, onClick } = zoneProps("zone-hand");
          if (!item) return null;
          const bc = item.dominantColor;
          const bd = shade(bc, -50);
          const bl = shade(bc, 45);
          const bx = fem ? 192 : 196;
          const by = fem ? 296 : 308;
          return (
            <g onClick={onClick} style={{ cursor: "pointer" }} role="button" aria-label={`${label}: ${item.name}`}
              filter={active ? "url(#glow)" : "url(#softShadow)"}>
              {/* Handle */}
              <path d={`M${bx + 8} ${by} Q${bx + 10} ${by - 18} ${bx + 24} ${by - 18} Q${bx + 38} ${by - 18} ${bx + 40} ${by}`}
                fill="none" stroke={bd} strokeWidth="3" strokeLinecap="round" />
              {/* Bag body */}
              <rect x={bx} y={by} width="48" height="40" rx="8"
                fill={bc} stroke={bd} strokeWidth={active ? 2.5 : 1.5} />
              {/* Front pocket */}
              <rect x={bx + 6} y={by + 14} width="36" height="18" rx="5"
                fill={shade(bc, -20)} stroke={bd} strokeWidth="0.8" />
              {/* Clasp */}
              <circle cx={bx + 24} cy={by + 10} r="4" fill={bl} stroke={bd} strokeWidth="1" />
              {/* Shine */}
              <rect x={bx + 4} y={by + 3} width="14" height="6" rx="3" fill={bl} opacity="0.4" />
            </g>
          );
        })()}

        {/* ═══════════════════════════════════
            HAT
        ═══════════════════════════════════ */}
        {(() => {
          const { item, active, label, onClick } = zoneProps("zone-head");
          if (!item) return null;
          const hc = item.dominantColor;
          const hd = shade(hc, -50);
          const hl = shade(hc, 45);
          const headTop = fem ? 28 : 26;
          return (
            <g onClick={onClick} style={{ cursor: "pointer" }} role="button" aria-label={`${label}: ${item.name}`}
              filter={active ? "url(#glow)" : "url(#softShadow)"}>
              {/* Brim */}
              <ellipse cx="120" cy={headTop + 22} rx="52" ry="11"
                fill={hd} stroke={hd} strokeWidth="1" />
              {/* Crown */}
              <path
                d={`M78 ${headTop + 22} Q74 ${headTop} 120 ${headTop - 14} Q166 ${headTop} 162 ${headTop + 22}Z`}
                fill={hc} stroke={hd} strokeWidth={active ? 2.5 : 1.5}
              />
              {/* Crown highlight */}
              <path d={`M96 ${headTop + 16} Q120 ${headTop + 6} 144 ${headTop + 16}`}
                fill="none" stroke={hl} strokeWidth="2" opacity="0.55" />
              {/* Hat band */}
              <rect x="80" y={headTop + 18} width="80" height="6" rx="2"
                fill={shade(hc, -30)} stroke={hd} strokeWidth="0.5" />
            </g>
          );
        })()}

        {/* ═══════════════════════════════════
            EARRINGS
        ═══════════════════════════════════ */}
        {(() => {
          const { item, active, label, onClick } = zoneProps("zone-ears");
          if (!item || item.category !== Category.JEWELRY) return null;
          const ec = item.dominantColor;
          const ed = shade(ec, -40);
          const earY = fem ? 82 : 78;
          return (
            <g onClick={onClick} style={{ cursor: "pointer" }} role="button" aria-label={`${label}: ${item.name}`}
              filter={active ? "url(#glow)" : undefined}>
              {/* Left earring */}
              <circle cx={fem ? 84 : 86} cy={earY} r="6"
                fill={ec} stroke={ed} strokeWidth={active ? 2 : 1} />
              <circle cx={fem ? 83 : 85} cy={earY - 1} r="2" fill="white" opacity="0.4" />
              {fem && (
                <>
                  <line x1="84" y1={earY + 6} x2="84" y2={earY + 16} stroke={ec} strokeWidth="2" />
                  <circle cx="84" cy={earY + 20} r="4" fill={ec} stroke={ed} strokeWidth="1" />
                  <circle cx="83" cy={earY + 19} r="1.5" fill="white" opacity="0.35" />
                </>
              )}
              {/* Right earring */}
              <circle cx={fem ? 156 : 154} cy={earY} r="6"
                fill={ec} stroke={ed} strokeWidth={active ? 2 : 1} />
              <circle cx={fem ? 155 : 153} cy={earY - 1} r="2" fill="white" opacity="0.4" />
              {fem && (
                <>
                  <line x1="156" y1={earY + 6} x2="156" y2={earY + 16} stroke={ec} strokeWidth="2" />
                  <circle cx="156" cy={earY + 20} r="4" fill={ec} stroke={ed} strokeWidth="1" />
                  <circle cx="155" cy={earY + 19} r="1.5" fill="white" opacity="0.35" />
                </>
              )}
            </g>
          );
        })()}

      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-1.5 justify-center max-w-[220px]">
        {outfit.items.map((item) => (
          <div key={item.id} className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.dominantColor }} />
            <span>{item.subcategory || item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
