// Física das faíscas do hero: um anel de N faíscas reaproveitadas (sem alocar por quadro).
// Faísca morta fica estacionada fora da cena, em y = PARKED.

export const PARKED = 99;
const GRAVITY = 3.2;
const DRAG = 0.985;

export interface SparkPool {
  pos: Float32Array;
  vel: Float32Array;
  life: Float32Array;
  max: Float32Array;
  next: number;
}

export function createPool(n: number): SparkPool {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) pos[i * 3 + 1] = PARKED;
  return { pos, vel: new Float32Array(n * 3), life: new Float32Array(n), max: new Float32Array(n).fill(1), next: 0 };
}

/** Acende a faísca mais antiga em (x, y), em direção aleatória, somando a velocidade do cursor. */
export function spawn(p: SparkPool, x: number, y: number, vx: number, vy: number, rnd: () => number = Math.random) {
  const i = p.next;
  p.next = (i + 1) % p.life.length;
  const j = i * 3;
  const a = rnd() * Math.PI * 2;
  const speed = 0.6 + rnd() * 1.8;
  p.pos[j] = x;
  p.pos[j + 1] = y;
  p.pos[j + 2] = (rnd() - 0.5) * 0.4;
  p.vel[j] = Math.cos(a) * speed + vx;
  p.vel[j + 1] = Math.sin(a) * speed + vy + 0.8;
  p.vel[j + 2] = (rnd() - 0.5) * 0.6;
  p.max[i] = 0.5 + rnd() * 0.8;
  p.life[i] = p.max[i];
}

/** Avança dt segundos; devolve quantas faíscas seguem vivas. */
export function step(p: SparkPool, dt: number): number {
  let alive = 0;
  for (let i = 0; i < p.life.length; i++) {
    const j = i * 3;
    if (p.life[i] <= 0) {
      p.pos[j + 1] = PARKED;
      continue;
    }
    p.life[i] -= dt;
    if (p.life[i] <= 0) {
      p.life[i] = 0;
      p.pos[j + 1] = PARKED;
      continue;
    }
    alive++;
    p.vel[j + 1] -= GRAVITY * dt;
    p.vel[j] *= DRAG;
    p.pos[j] += p.vel[j] * dt;
    p.pos[j + 1] += p.vel[j + 1] * dt;
    p.pos[j + 2] += p.vel[j + 2] * dt;
  }
  return alive;
}

/** Brilho restante da faísca i, de 1 (acabou de nascer) a 0 (apagada). */
export function fade(p: SparkPool, i: number): number {
  return Math.max(p.life[i] / p.max[i], 0);
}
