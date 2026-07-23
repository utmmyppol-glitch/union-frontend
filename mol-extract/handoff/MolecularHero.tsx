"use client";

/**
 * MolecularHero — Union Systems Hero. 실제 ball-and-stick 분자 모델 (CPK 원소색, 매트, 투명 배경).
 *
 * 드롭인:
 *   import dynamic from "next/dynamic";
 *   const MolecularHero = dynamic(() => import("@/components/MolecularHero"), { ssr: false });
 *   <div style={{ position:"relative", width:"100%", height:"100%", minHeight:760 }}><MolecularHero /></div>
 *
 * 의존성: three (설치됨). Bloom/postprocessing 불필요.
 * 검증된 데모의 1:1 이식본. CPK 색·매트 재질·스튜디오 조명·프래그먼트 구조를 바꾸지 말 것
 * — 발광/네온/랜덤 블롭을 넣으면 다시 "AI 그래픽"처럼 보인다. 배경은 투명(페이지가 비침).
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Primary = { title: string; vendor: string; pos: [number, number, number]; r: number; dep: number; brand: string };

const PRIMARIES: Primary[] = [
  { title: "IT 인프라 · 협업", vendor: "Microsoft", pos: [0.4, 0.5, 1.4], r: 1.06, dep: 0.56, brand: "#0078D4" },
  { title: "통합 보안\n인프라", vendor: "AhnLab", pos: [-3.0, 1.9, 0.6], r: 0.9, dep: 0.5, brand: "#6F92FF" },
  { title: "데이터\n거버넌스", vendor: "엔코아", pos: [3.1, 1.8, 0.4], r: 0.94, dep: 0.5, brand: "#4D8F97" },
  { title: "ITAM · PC OFF", vendor: "닥터소프트", pos: [-3.2, -1.8, 1.0], r: 0.88, dep: 0.48, brand: "#7C8794" },
  { title: "Contents", vendor: "Adobe", pos: [3.5, -1.4, 0.8], r: 0.92, dep: 0.5, brand: "#FF5C5C" },
  { title: "설계", vendor: "Autodesk", pos: [1.4, -2.9, 0.5], r: 0.88, dep: 0.48, brand: "#49C58E" },
  { title: "통합 유틸\n/백신", vendor: "이스트소프트", pos: [-1.2, 3.0, 1.2], r: 0.88, dep: 0.48, brand: "#E0A24B" },
];

function makeLabel(d: Primary) {
  const cw = 700, ch = 380;
  const cv = document.createElement("canvas");
  cv.width = cw; cv.height = ch;
  const ctx = cv.getContext("2d")!;
  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = 4;
  const draw = () => {
    ctx.clearRect(0, 0, cw, ch);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = d.title.split("\n");
    const tSize = lines.length > 1 ? 88 : 100;
    ctx.font = `800 ${tSize}px 'Pretendard Variable', Pretendard, sans-serif`;
    ctx.shadowColor = "rgba(255,255,255,.55)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#16130f";
    const lh = tSize * 1.02;
    const tH = (lines.length - 1) * lh;
    const cy = ch * 0.44 - tH / 2;
    lines.forEach((ln, i) => ctx.fillText(ln, cw / 2, cy + i * lh));
    ctx.font = "600 42px 'Pretendard Variable', Pretendard, sans-serif";
    ctx.fillStyle = "#5a544b";
    ctx.fillText(d.vendor, cw / 2, ch * 0.44 + tH / 2 + 72);
    tex.needsUpdate = true;
  };
  draw();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  return { tex, aspect: cw / ch };
}

export default function MolecularHero() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let W = 0, H = 0, raf = 0, built = false;
    const start = performance.now();
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const disposables: { dispose: () => void }[] = [];

    let renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, group: THREE.Group;
    const labeled: { atom: THREE.Group; hex: THREE.Mesh; planeMat: THREE.MeshBasicMaterial }[] = [];
    const smalls: THREE.Mesh[] = [];
    const orbits: THREE.Mesh[] = [];
    const ray = new THREE.Raycaster();
    let ndc: THREE.Vector2 | null = null, mx = 0, my = 0, any = false;
    const up = new THREE.Vector3(0, 1, 0);

    const onMove = (e: PointerEvent) => { const r = host.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - 0.5; my = (e.clientY - r.top) / r.height - 0.5; ndc = new THREE.Vector2(mx * 2, -my * 2); };
    const onLeave = () => { ndc = null; mx = 0; my = 0; };

    const build = () => {
      built = true;
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xFBFAF7, 13, 30); // 배경 아이보리로 fade
      camera = new THREE.PerspectiveCamera(44, W / H, 0.1, 100);
      camera.position.set(0, 0, 13);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0); // 투명 배경
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.outputEncoding = THREE.sRGBEncoding;
      host.appendChild(renderer.domElement);

      // 부드러운 세라믹 라이팅 (검은 그림자 방지 — 반대편도 밝게)
      scene.add(new THREE.HemisphereLight(0xffffff, 0xe9e2d5, 0.98));
      const key = new THREE.DirectionalLight(0xfff6ec, 0.5); key.position.set(4, 7, 6); scene.add(key);
      const fill = new THREE.DirectionalLight(0xeef2f8, 0.38); fill.position.set(-5, -2, 4); scene.add(fill);
      const rimL = new THREE.DirectionalLight(0xffffff, 0.3); rimL.position.set(-3, 5, -6); scene.add(rimL);

      group = new THREE.Group();
      scene.add(group);

      // 라벨 육각 7개 (매트, 발광 없음)
      PRIMARIES.forEach((d) => {
        const atom = new THREE.Group();
        atom.position.set(...d.pos);
        const geo = new THREE.CylinderGeometry(d.r, d.r, d.dep, 6);
        geo.rotateX(Math.PI / 2);
        const mat = new THREE.MeshPhysicalMaterial({ color: 0xf6f2ea, roughness: 0.5, metalness: 0.0, clearcoat: 0.5, clearcoatRoughness: 0.38 }); // 아이보리 세라믹
        mat.fog = false;
        const hex = new THREE.Mesh(geo, mat);
        atom.add(hex);
        const { tex, aspect } = makeLabel(d);
        const pw = d.r * 1.55, ph = pw / aspect;
        const planeMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), planeMat);
        plane.position.z = d.dep / 2 + 0.02;
        atom.add(plane);
        (atom.userData as any) = { phase: rand(0, 6.28), breath: rand(0, 6.28), hoverT: 0 };
        group.add(atom);
        labeled.push({ atom, hex, planeMat });
        disposables.push(geo, mat, plane.geometry, planeMat, tex);
      });

      // 실제 분자: CPK 원소색 + 링/체인 프래그먼트
      const CPK: Record<string, THREE.Material> = {
        C: new THREE.MeshPhysicalMaterial({ color: 0x7d786f, roughness: 0.6, metalness: 0.0, clearcoat: 0.22, clearcoatRoughness: 0.5 }),
        H: new THREE.MeshPhysicalMaterial({ color: 0xfcfbf9, roughness: 0.5, metalness: 0.0, clearcoat: 0.4, clearcoatRoughness: 0.4 }),
        O: new THREE.MeshPhysicalMaterial({ color: 0xe99191, roughness: 0.5, metalness: 0.0, clearcoat: 0.28, clearcoatRoughness: 0.45 }),
        N: new THREE.MeshPhysicalMaterial({ color: 0x87a8f6, roughness: 0.5, metalness: 0.0, clearcoat: 0.28, clearcoatRoughness: 0.45 }),
        S: new THREE.MeshPhysicalMaterial({ color: 0xe7d487, roughness: 0.5, metalness: 0.0, clearcoat: 0.28, clearcoatRoughness: 0.45 }),
      };
      const RAD: Record<string, number> = { C: 0.42, H: 0.28, O: 0.4, N: 0.4, S: 0.44 };
      Object.values(CPK).forEach((m) => disposables.push(m));
      const bondMat = new THREE.MeshStandardMaterial({ color: 0xc6c0b8, roughness: 0.9, metalness: 0.0 }); // 따뜻한 회색 무광 본드
      disposables.push(bondMat);

      const addAtom = (pos: THREE.Vector3, el: string) => {
        const geo = new THREE.IcosahedronGeometry(RAD[el], 2);
        const m = new THREE.Mesh(geo, CPK[el]);
        m.position.copy(pos);
        (m.userData as any) = { breath: rand(0, 6.28), amp: rand(0.006, 0.018) };
        group.add(m); smalls.push(m); disposables.push(geo);
        return m;
      };
      const addBond = (a: THREE.Vector3, b: THREE.Vector3, th: number) => {
        const dir = new THREE.Vector3().subVectors(b, a);
        const len = dir.length();
        const geo = new THREE.CylinderGeometry(th, th, len, 7);
        const m = new THREE.Mesh(geo, bondMat);
        m.position.copy(a).add(b).multiplyScalar(0.5);
        m.quaternion.setFromUnitVectors(up, dir.clone().normalize());
        group.add(m); disposables.push(geo);
      };
      const makeRing = (center: THREE.Vector3) => {
        const bx = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
        const cy = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).cross(bx).normalize();
        const R = 0.72, atoms: THREE.Mesh[] = [];
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const p = center.clone().addScaledVector(bx, Math.cos(a) * R).addScaledVector(cy, Math.sin(a) * R);
          const el = i % 3 === 1 && Math.random() > 0.55 ? (Math.random() > 0.5 ? "N" : "O") : "C";
          atoms.push(addAtom(p, el));
        }
        for (let i = 0; i < 6; i++) addBond(atoms[i].position, atoms[(i + 1) % 6].position, 0.058);
        atoms.forEach((at) => { if (Math.random() > 0.82) { const out = at.position.clone().sub(center).setLength(0.58).add(at.position); const o = addAtom(out, "O"); addBond(at.position, o.position, 0.06); } });
        return atoms;
      };
      const makeChain = (startPos: THREE.Vector3, n: number) => {
        let prev = startPos.clone();
        let dir = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
        const atoms: THREE.Mesh[] = [addAtom(prev, "C")];
        for (let i = 1; i < n; i++) {
          const bend = new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize();
          dir = dir.clone().multiplyScalar(0.5).add(bend.multiplyScalar(0.55)).normalize();
          dir.z -= 0.6; dir.normalize(); // 체인이 앞으로 안 튀어나오게 (라벨 뒤 유지)
          const p = prev.clone().addScaledVector(dir, 1.18);
          const el = Math.random() > 0.78 ? (Math.random() > 0.5 ? "O" : "N") : "C";
          const a = addAtom(p, el); addBond(prev, p, 0.058); atoms.push(a);
          prev = p;
        }
        return atoms;
      };
      // 골격은 라벨 뒤(z 음수) + 넓게 벌려 여백 확보 (뭉침/홀 느낌 제거)
      const fragCenters: [number, number, number][] = [[2.6, 1.0, -1.8], [-2.8, 1.0, -2.0], [0.0, -2.4, -1.7], [-2.4, -1.6, -2.2], [2.5, -1.8, -2.1]];
      const fragAtoms: THREE.Mesh[] = [];
      fragCenters.forEach((c, i) => { const ctr = new THREE.Vector3(...c); const at = i % 2 === 0 ? makeRing(ctr) : makeChain(ctr, 3 + Math.floor(Math.random() * 2)); fragAtoms.push(...at); });
      fragAtoms.forEach((a) => { if (a.position.z > -0.4) a.position.z = -0.4 - Math.random() * 1.2; });
      labeled.forEach((l) => { let best: THREE.Mesh | null = null, bd = 1e9; fragAtoms.forEach((a) => { const dd = a.position.distanceTo(l.atom.position); if (dd < bd) { bd = dd; best = a; } }); if (best && bd < 4.6) addBond(l.atom.position, (best as THREE.Mesh).position, 0.05); });

      // 우아한 굤도 링 (atom 모티프 — 여백을 디자인 요소로)
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xcabfa8, transparent: true, opacity: 0.4 });
      ringMat.fog = false;
      disposables.push(ringMat);
      orbits.length = 0;
      for (let i = 0; i < 3; i++) {
        const geo = new THREE.TorusGeometry(4.4 + i * 0.55, 0.014, 8, 140);
        const tor = new THREE.Mesh(geo, ringMat);
        tor.rotation.set(rand(0, 3.14), rand(0, 3.14), rand(0, 3.14));
        (tor.userData as any) = { sx: rand(-0.02, 0.02), sy: rand(-0.02, 0.02) };
        group.add(tor); orbits.push(tor); disposables.push(geo);
      }

      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);

      const camQ = new THREE.Quaternion(), gInv = new THREE.Quaternion(), sway = new THREE.Quaternion(), sE = new THREE.Euler();
      let prev = performance.now();
      const animate = () => {
        const now = performance.now();
        Math.min((now - prev) / 1000, 0.05); prev = now;
        const t = (now - start) / 1000;
        group.rotation.y = Math.sin(t * 0.09) * 0.36 + mx * 0.28;
        group.rotation.x = Math.sin(t * 0.07 + 1.3) * 0.18 - my * 0.18;
        group.rotation.z = Math.sin(t * 0.05 + 0.6) * 0.04;
        group.position.y = Math.sin(t * 0.15) * 0.1;

        let hov: THREE.Object3D | null = null;
        if (ndc) { ray.setFromCamera(ndc, camera); const hits = ray.intersectObjects(labeled.map((l) => l.hex)); if (hits.length) hov = hits[0].object; }
        any = !!hov;
        host.style.cursor = hov ? "pointer" : "default";
        group.getWorldQuaternion(gInv); gInv.invert(); camQ.copy(camera.quaternion);
        labeled.forEach(({ atom, hex, planeMat }) => {
          const u = atom.userData as any;
          u.hoverT += ((hex === hov ? 1 : 0) - u.hoverT) * 0.12;
          const h = u.hoverT, amp = 0.13 * (1 - 0.7 * h);
          sE.set(Math.sin(t * 0.5 + u.phase) * amp, Math.sin(t * 0.42 + u.phase) * (amp + 0.02), 0);
          sway.setFromEuler(sE);
          atom.quaternion.copy(gInv).multiply(camQ).multiply(sway);
          atom.scale.setScalar((1 + Math.sin(t * 0.7 + u.breath) * 0.005) * (1 + 0.07 * h));
          planeMat.opacity = any ? 0.45 + 0.55 * h : 1;
        });
        smalls.forEach((m) => { const u = m.userData as any; m.scale.setScalar(1 + Math.sin(t * 0.8 + u.breath) * u.amp); });
        orbits.forEach((o) => { const u = o.userData as any; o.rotation.x += u.sx * 0.02; o.rotation.y += u.sy * 0.02; });

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();
    };

    const measure = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (w > 0 && h > 0) {
        if (!built) { W = w; H = h; build(); }
        else if (renderer) { W = w; H = h; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); }
      }
    };
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    measure();
    requestAnimationFrame(measure);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      disposables.forEach((d) => d.dispose());
      if (renderer) { renderer.dispose(); if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement); }
    };
  }, []);

  return <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />;
}
