import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyLane, findSupportingLog, isTrafficCollision } from '../game-logic.js';

test('row 7 is a river lane', () => {
  assert.deepEqual(classifyLane(7), { road: false, river: true });
});

test('row 2 is safe ground', () => {
  assert.deepEqual(classifyLane(2), { road: false, river: false });
});

test('road lanes repeat every 12 rows', () => {
  assert.deepEqual(classifyLane(15), { road: true, river: false });
});

test('a player inside a log is supported by that log', () => {
  const log = { x: 4, width: 3 };
  assert.equal(findSupportingLog(5, [{ x: 0, width: 3 }, log]), log);
});

test('the left edge of the log support area is excluded', () => {
  assert.equal(findSupportingLog(4 + .12, [{ x: 4, width: 3 }]), undefined);
});

test('an empty river lane has no supporting log', () => {
  assert.equal(findSupportingLog(5, []), undefined);
});

test('a car hits the player when their footprints overlap', () => {
  const lanes = new Map([[4, { road: true, cars: [{ x: 3, width: 2 }] }]]);
  assert.equal(isTrafficCollision({ x: 3, y: 4.5 }, lanes), true);
});

test('a car in the same lane misses a player outside its footprint', () => {
  const lanes = new Map([[4, { road: true, cars: [{ x: 3, width: 2 }] }]]);
  assert.equal(isTrafficCollision({ x: 6, y: 4.5 }, lanes), false);
});
