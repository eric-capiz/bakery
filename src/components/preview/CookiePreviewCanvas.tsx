import {
  Suspense,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Center,
  ContactShadows,
  Environment,
  OrbitControls,
  Text3D,
} from "@react-three/drei";
import * as THREE from "three";
import type { PastryType } from "../../../lib/pastryTypes";
import { MAX_BUILD_CAKE_MESSAGE_LENGTH } from "../../../lib/constants";

const FONT_ICING = "/fonts/helvetiker_bold.typeface.json";
/** White / eggshell fluted liner — strong shadow between pleats */
function createCupcakeLinerTexture(): THREE.CanvasTexture {
  const w = 200;
  const h = 400;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, "#f7f4ef");
  base.addColorStop(0.5, "#ebe6de");
  base.addColorStop(1, "#ddd6cc");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  for (let x = 0; x < w; x += 8) {
    const u = x / w;
    const deep = u * Math.PI * 24;
    const shade = 0.03 + 0.14 * (0.5 + 0.5 * Math.sin(deep));
    ctx.fillStyle = `rgba(55, 48, 42, ${shade})`;
    ctx.fillRect(x, 0, 5, h);
  }
  ctx.fillStyle = "rgba(214, 130, 150, 0.18)";
  ctx.fillRect(w * 0.2, 0, w * 0.07, h);
  ctx.fillRect(w * 0.68, 0, w * 0.06, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function createFrostingBaseTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const cx = size / 2;
  const grd = ctx.createRadialGradient(cx, cx, 8, cx, cx, size * 0.46);
  grd.addColorStop(0, "#f8e0e8");
  grd.addColorStop(1, "#e8b8c8");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cx, size * 0.45, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function useDisposablePleatedCylinder(
  topR: number,
  botR: number,
  height: number,
  seg: number,
  pleats: number,
  amp: number
) {
  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(topR, botR, height, seg, 1, false);
    const pos = g.attributes.position;
    const tmp = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      tmp.fromBufferAttribute(pos, i);
      const ang = Math.atan2(tmp.z, tmp.x);
      const mul = 1 + amp * Math.sin(ang * pleats);
      tmp.x *= mul;
      tmp.z *= mul;
      pos.setXYZ(i, tmp.x, tmp.y, tmp.z);
    }
    g.computeVertexNormals();
    return g;
  }, [topR, botR, height, seg, pleats, amp]);
  useEffect(() => () => geo.dispose(), [geo]);
  return geo;
}

function useFrostingSwirlTube() {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const turns = 4.5;
    const steps = 64;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const ang = t * turns * Math.PI * 2;
      const r = 0.2 * (1 - t * 0.88);
      pts.push(new THREE.Vector3(r * Math.cos(ang), t * 0.17, r * Math.sin(ang)));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    return new THREE.TubeGeometry(curve, 96, 0.044, 10, false);
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  return geo;
}

function FrostingBaseDisc({
  texture,
  position,
  radius,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  radius: number;
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <circleGeometry args={[radius, 48]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.55}
        metalness={0}
        envMapIntensity={0.45}
      />
    </mesh>
  );
}

function IcingMessage3D({
  text,
  position,
  size = 0.078,
  lineHeight = 0.85,
  slim = false,
}: {
  text: string;
  position: [number, number, number];
  size?: number;
  lineHeight?: number;
  /** Thinner extrusion / bevel — reads less like pink bricks on shallow pies */
  slim?: boolean;
}) {
  const raw = text.trim() || "Preview";
  const display =
    raw.length > MAX_BUILD_CAKE_MESSAGE_LENGTH
      ? raw.slice(0, MAX_BUILD_CAKE_MESSAGE_LENGTH)
      : raw;
  const lens = display.length;
  const sizeScale = lens > 16 ? 0.72 : lens > 11 ? 0.85 : 1;
  const s = size * sizeScale * (slim ? 0.92 : 1);
  const height = slim ? 0.02 : 0.045;
  const bevelThickness = slim ? 0.006 : 0.014;
  const bevelSize = slim ? 0.004 : 0.01;
  const bevelSegments = slim ? 2 : 4;

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <Center top>
        <Text3D
          font={FONT_ICING}
          size={s}
          height={height}
          curveSegments={slim ? 8 : 12}
          bevelEnabled
          bevelThickness={bevelThickness}
          bevelSize={bevelSize}
          bevelOffset={0}
          bevelSegments={bevelSegments}
          lineHeight={lineHeight}
          letterSpacing={slim ? -0.02 : -0.03}
        >
          {display}
          <meshPhysicalMaterial
            color="#f5a8c8"
            emissive="#4a1828"
            emissiveIntensity={0.04}
            roughness={0.26}
            metalness={0.06}
            clearcoat={0.58}
            clearcoatRoughness={0.22}
            envMapIntensity={0.75}
          />
        </Text3D>
      </Center>
    </group>
  );
}

function CookieChip({
  x,
  z,
  r,
  chipBaseY,
}: {
  x: number;
  z: number;
  r: number;
  chipBaseY: number;
}) {
  const yCenter = chipBaseY + 0.008 + r * 0.32;
  return (
    <mesh position={[x, yCenter, z]} scale={[1, 0.65, 1]} castShadow receiveShadow>
      <sphereGeometry args={[r, 14, 12]} />
      <meshStandardMaterial
        color="#2a1a10"
        roughness={0.92}
        metalness={0}
        envMapIntensity={0.28}
      />
    </mesh>
  );
}

const CookiePastryBlock = forwardRef<
  THREE.Group,
  {
    frostingTex: THREE.CanvasTexture;
    message: string;
  }
>(function CookiePastryBlock({ frostingTex, message }, ref) {
  const centerY = 0.078;
  const chipSpecs: [number, number, number][] = [
    [0.18, 0.12, 0.04],
    [-0.22, -0.08, 0.035],
    [0.08, -0.2, 0.038],
    [-0.1, 0.22, 0.032],
    [0.25, -0.18, 0.03],
    [-0.26, 0.14, 0.034],
  ];
  return (
    <group ref={ref} position={[0, 0.085, 0]}>
      <mesh castShadow receiveShadow position={[0, centerY, 0]} scale={[1, 0.2, 1]}>
        <sphereGeometry args={[0.56, 40, 28]} />
        <meshPhysicalMaterial
          color="#e7a66e"
          roughness={0.66}
          metalness={0}
          sheen={0.32}
          sheenRoughness={0.88}
          sheenColor="#f5d4b0"
          envMapIntensity={0.5}
        />
      </mesh>
      {chipSpecs.map(([x, z, r], i) => (
        <CookieChip key={i} x={x} z={z} r={r} chipBaseY={centerY} />
      ))}
      <FrostingBaseDisc
        texture={frostingTex}
        position={[0, centerY + 0.108, 0]}
        radius={0.2}
      />
      <IcingMessage3D text={message} position={[0, centerY + 0.13, 0]} size={0.05} />
    </group>
  );
});

const PiePastryBlock = forwardRef<
  THREE.Group,
  { frostingTex: THREE.CanvasTexture; message: string }
>(function PiePastryBlock({ frostingTex: _frostingTex, message: _message }, ref) {
  const panBottomY = 0.004;
  const wallH = 0.166;
  const wallCenterY = panBottomY + wallH / 2;
  const rimY = panBottomY + wallH - 0.006;
  const topR = 0.52;
  const botR = 0.34;
  const crustInnerR = topR - 0.034;
  /** Baked shell inside dish; filling and lattice live inside this. */
  const pastryFloorR = crustInnerR - 0.012;
  /**
   * Crimp tube sits near baseR = topR−0.012 with amplitude ~0.011 and radius ~0.015 → inner ~ topR−0.038.
   * Top fruit surface must reach that or top-down rays show dish between filling and crimp.
   */
  const fruitFillTopR = topR - 0.037;
  const fruitFillBottomR = fruitFillTopR * 0.87;
  const bottomCrustH = 0.03;
  const bottomCrustCenterY = panBottomY + bottomCrustH / 2 + 0.006;
  const fillBottomY = panBottomY + 0.006 + bottomCrustH;
  /** Tall fruit layer — deep-dish read (~3″–ish vs ~9–10″ pan in these units). */
  const fillH = 0.118;
  const fillCenterY = fillBottomY + fillH / 2;
  const fillTopY = fillBottomY + fillH;
  /** Pastry wall to same height as fill so we don’t step down short of the fruit top. */
  const sideCrustH = fillTopY - fillBottomY + 0.004;
  /** Strips reach almost to crimp (was too tight — read as “floating” on a white dish). */
  const latticeClearR = topR - 0.026;

  const sideCrustGeo = useMemo(() => {
    const ri = fruitFillTopR;
    /** Was topR−0.012: left ~1.2cm of ceramic rim exposed from above. Flush to dish lip. */
    const ro = topR - 0.002;
    const h = Math.max(0.02, sideCrustH);
    const pts = [
      new THREE.Vector2(ri, 0),
      new THREE.Vector2(ro, 0),
      new THREE.Vector2(ro, h),
      new THREE.Vector2(ri, h),
    ];
    return new THREE.LatheGeometry(pts, 48);
  }, [fruitFillTopR, sideCrustH, topR]);
  useEffect(() => () => sideCrustGeo.dispose(), [sideCrustGeo]);
  const latticeStrips = useMemo(() => {
    const n = 5;
    const R = latticeClearR;
    const stripW = 0.042;
    const stripT = 0.024;
    const baseY = fillTopY + stripT / 2 - 0.002;
    type Strip = {
      pos: [number, number, number];
      rotY: number;
      len: number;
    };
    const out: Strip[] = [];
    for (let i = 1; i <= n; i++) {
      const u = (i / (n + 1)) * 2 - 1;
      const z = u * R * 0.92;
      const halfLen = Math.sqrt(Math.max(0, R * R - z * z)) * 0.96;
      const weaveA = i % 2 === 0 ? 0.007 : 0;
      out.push({
        pos: [0, baseY + weaveA, z],
        rotY: 0,
        len: halfLen * 2,
      });
      const x = u * R * 0.92;
      const halfLenZ = Math.sqrt(Math.max(0, R * R - x * x)) * 0.96;
      const weaveB = i % 2 === 1 ? 0.007 : 0;
      out.push({
        pos: [x, baseY + weaveB, 0],
        rotY: Math.PI / 2,
        len: halfLenZ * 2,
      });
    }
    return { list: out, stripW, stripT, latticeTopY: baseY + stripT };
  }, [fillTopY, latticeClearR]);

  const crimpTube = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segs = 88;
    const baseR = topR - 0.012;
    const y0 = rimY + 0.001;
    for (let i = 0; i <= segs; i++) {
      const t = (i / segs) * Math.PI * 2;
      const wave = 0.011 * Math.sin(9 * t);
      const r = baseR + wave;
      const yWave = y0 + 0.005 * Math.sin(18 * t);
      pts.push(
        new THREE.Vector3(Math.cos(t) * r, yWave, Math.sin(t) * r)
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts, true);
    return new THREE.TubeGeometry(curve, 64, 0.015, 8, true);
  }, [rimY, topR]);
  useEffect(() => () => crimpTube.dispose(), [crimpTube]);

  /** Warm cream ceramic — grey-blue reads as a metal tin in side view. */
  const ceramic = {
    color: "#efe6da" as const,
    roughness: 0.58,
    metalness: 0,
    envMapIntensity: 0.28,
  };

  return (
    <group ref={ref} position={[0, 0.032, 0]}>
      <mesh
        castShadow
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, panBottomY, 0]}
      >
        <circleGeometry args={[botR, 48]} />
        <meshStandardMaterial {...ceramic} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, wallCenterY, 0]}>
        <cylinderGeometry args={[topR, botR, wallH, 48, 1, true]} />
        <meshStandardMaterial {...ceramic} side={THREE.DoubleSide} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, bottomCrustCenterY, 0]}>
        <cylinderGeometry
          args={[pastryFloorR * 0.96, pastryFloorR, bottomCrustH, 40, 1, false]}
        />
        <meshStandardMaterial
          color="#9d7149"
          roughness={0.88}
          metalness={0}
          envMapIntensity={0.3}
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        position={[0, fillBottomY, 0]}
        geometry={sideCrustGeo}
      >
        <meshStandardMaterial
          color="#b2763e"
          roughness={0.84}
          metalness={0}
          envMapIntensity={0.32}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0, fillCenterY, 0]}>
        <cylinderGeometry
          args={[fruitFillBottomR, fruitFillTopR, fillH, 56, 1, false]}
        />
        <meshStandardMaterial
          color="#5c2410"
          roughness={0.88}
          metalness={0}
          envMapIntensity={0.2}
        />
      </mesh>
      {/**
       * One continuous pastry lid under the fruit top — rings + partial radii still let
       * top-down rays hit the ceramic bowl. This disc spans the whole dish opening.
       */}
      <mesh
        castShadow
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, fillTopY - 0.0025, 0]}
      >
        <circleGeometry args={[topR - 0.004, 64]} />
        <meshStandardMaterial
          color="#b2763e"
          roughness={0.84}
          metalness={0}
          envMapIntensity={0.32}
          polygonOffset
          polygonOffsetFactor={2}
          polygonOffsetUnits={1}
        />
      </mesh>
      <mesh castShadow receiveShadow geometry={crimpTube}>
        <meshStandardMaterial
          color="#9d5c28"
          roughness={0.78}
          metalness={0}
          envMapIntensity={0.32}
        />
      </mesh>
      {latticeStrips.list.map((s, i) => (
        <mesh
          key={`lattice-${i}`}
          castShadow
          receiveShadow
          position={s.pos}
          rotation={[0, s.rotY, 0]}
        >
          <boxGeometry args={[s.len, latticeStrips.stripT, latticeStrips.stripW]} />
          <meshStandardMaterial
            color="#c6864a"
            roughness={0.8}
            metalness={0}
            envMapIntensity={0.34}
          />
        </mesh>
      ))}
    </group>
  );
});

const CupcakePastryBlock = forwardRef<
  THREE.Group,
  { frostingTex: THREE.CanvasTexture; linerTex: THREE.CanvasTexture; message: string }
>(function CupcakePastryBlock({ frostingTex, linerTex, message }, ref) {
  const pleatedLiner = useDisposablePleatedCylinder(
    0.36,
    0.245,
    0.34,
    48,
    28,
    0.034
  );
  const swirlGeo = useFrostingSwirlTube();
  return (
    <group ref={ref} position={[0, 0.12, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.2, 0]} geometry={pleatedLiner}>
        <meshStandardMaterial
          map={linerTex}
          color="#ffffff"
          roughness={0.88}
          metalness={0}
          envMapIntensity={0.28}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.318, 0]} scale={[1, 0.62, 1]}>
        <sphereGeometry args={[0.29, 28, 20]} />
        <meshStandardMaterial
          color="#deb58a"
          roughness={0.8}
          metalness={0}
          envMapIntensity={0.36}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.42, 0]} geometry={swirlGeo}>
        <meshPhysicalMaterial
          color="#f2a0c0"
          roughness={0.32}
          metalness={0}
          clearcoat={0.35}
          clearcoatRoughness={0.32}
          envMapIntensity={0.55}
        />
      </mesh>
      <FrostingBaseDisc texture={frostingTex} position={[0, 0.518, 0]} radius={0.14} />
      <IcingMessage3D text={message} position={[0, 0.546, 0]} size={0.042} />
    </group>
  );
});

function PastryMesh({
  type,
  frostingTex,
  linerTex,
  message,
}: {
  type: PastryType;
  frostingTex: THREE.CanvasTexture;
  linerTex: THREE.CanvasTexture;
  message: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });

  switch (type) {
    case "cake":
      return (
        <group ref={ref} position={[0, 0.2, 0]}>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.52, 0.55, 0.22, 40]} />
            <meshStandardMaterial
              color="#f2ddd0"
              roughness={0.78}
              metalness={0}
              envMapIntensity={0.42}
            />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.46, 0.5, 0.2, 40]} />
            <meshStandardMaterial
              color="#e8a0a8"
              roughness={0.48}
              metalness={0.02}
              envMapIntensity={0.48}
            />
          </mesh>
          <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.42, 0.18, 40]} />
            <meshStandardMaterial
              color="#f2ddd0"
              roughness={0.78}
              metalness={0}
              envMapIntensity={0.42}
            />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.32, 0.34, 0.12, 40]} />
            <meshPhysicalMaterial
              color="#c97b84"
              roughness={0.42}
              metalness={0.03}
              envMapIntensity={0.48}
              clearcoat={0.12}
            />
          </mesh>
          <FrostingBaseDisc
            texture={frostingTex}
            position={[0, 0.618, 0]}
            radius={0.26}
          />
          <IcingMessage3D text={message} position={[0, 0.648, 0]} size={0.072} />
        </group>
      );
    case "cookie":
      return (
        <CookiePastryBlock ref={ref} frostingTex={frostingTex} message={message} />
      );
    case "pie":
      return <PiePastryBlock ref={ref} frostingTex={frostingTex} message={message} />;
    case "cupcake":
      return (
        <CupcakePastryBlock
          ref={ref}
          frostingTex={frostingTex}
          linerTex={linerTex}
          message={message}
        />
      );
    case "brownie":
      return (
        <group ref={ref} position={[0, 0.2, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.88, 0.28, 0.75]} />
            <meshStandardMaterial
              color="#4a2c20"
              roughness={0.88}
              metalness={0}
              envMapIntensity={0.35}
            />
          </mesh>
          <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.04, 0.77]} />
            <meshStandardMaterial
              color="#6b4330"
              roughness={0.5}
              metalness={0}
              envMapIntensity={0.42}
            />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

function Plate({ subtle }: { subtle?: boolean }) {
  const r = subtle ? 0.92 : 1.35;
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <circleGeometry args={[r, 64]} />
      <meshStandardMaterial
        color="#faf6f1"
        roughness={0.65}
        metalness={0.02}
        envMapIntensity={0.25}
      />
    </mesh>
  );
}

function Scene({
  pastryType,
  frostingTex,
  linerTex,
  message,
}: {
  pastryType: PastryType;
  frostingTex: THREE.CanvasTexture;
  linerTex: THREE.CanvasTexture;
  message: string;
}) {
  const cookiePlate = pastryType === "cookie";
  const piePlate = pastryType === "pie";
  const orbitTarget: [number, number, number] =
    pastryType === "pie" ? [0, 0.26, 0] : [0, 0.38, 0];
  const polarMin = pastryType === "pie" ? 0.2 : 0.25;
  return (
    <>
      <color attach="background" args={["#f3ece4"]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#ffffff", "#8b7355", 0.32]} />
      <directionalLight
        castShadow
        position={[4.5, 8, 5]}
        intensity={1.1}
        color="#fff7ed"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.00015}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-4, 4.5, -2]} intensity={0.35} color="#e8e4ff" />
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.55} />
        <Plate subtle={cookiePlate || piePlate} />
        <PastryMesh
          type={pastryType}
          frostingTex={frostingTex}
          linerTex={linerTex}
          message={message}
        />
      </Suspense>
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.55}
        scale={12}
        blur={2.3}
        far={4.5}
      />
      <OrbitControls
        enablePan={false}
        minPolarAngle={polarMin}
        maxPolarAngle={Math.PI / 2}
        minDistance={pastryType === "pie" ? 1.45 : 1.6}
        maxDistance={5}
        target={orbitTarget}
      />
    </>
  );
}

export type CookiePreviewCanvasProps = {
  pastryType: PastryType;
  message?: string;
};

const CookiePreviewCanvas = ({
  pastryType,
  message = "Happy Birthday",
}: CookiePreviewCanvasProps) => {
  const safe = message.slice(0, MAX_BUILD_CAKE_MESSAGE_LENGTH);
  const frostingTex = useMemo(() => createFrostingBaseTexture(), []);
  const linerTex = useMemo(() => createCupcakeLinerTexture(), []);
  const camera = useMemo(
    () =>
      pastryType === "pie"
        ? ({ position: [0.52, 0.78, 1.85], fov: 34 } as const)
        : ({ position: [0, 1.35, 2.35], fov: 40 } as const),
    [pastryType]
  );
  useEffect(() => () => frostingTex.dispose(), [frostingTex]);
  useEffect(() => () => linerTex.dispose(), [linerTex]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        height: 420,
        margin: "1.5rem auto 0",
        borderRadius: 16,
        overflow: "hidden",
        border: "2px solid #ffb89a",
        boxShadow: "0 8px 28px rgba(139, 74, 58, 0.12)",
      }}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        key={pastryType === "pie" ? "pie-cam" : "std-cam"}
        camera={{ position: [...camera.position], fov: camera.fov, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <Scene
          pastryType={pastryType}
          frostingTex={frostingTex}
          linerTex={linerTex}
          message={safe}
        />
      </Canvas>
    </div>
  );
};

export default CookiePreviewCanvas;
