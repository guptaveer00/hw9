Starting codebase is Crossy Campus, the Crossy Road-style game in [Project 2](https://github.com/guptaveer00/website/tree/main/crossy-road).

- Refactor commit `a8ddb7b` extracted `classifyLane`, `findSupportingLog`, and `isTrafficCollision` into `game-logic.js`. The page loads `game.js` as an ES module. Canvas rendering, input wiring, and animation remain in the browser code.
- Tests-only commit `2271b4d` added eight Node tests. They check safe, river, and repeating road lanes, log identity, the exact left edge of log support, empty logs, a traffic hit, and a traffic miss. The suite covers those game rules. Rendering, animation, and input are outside the automated suite.
- Browser smoke check over local HTTP: Up and W each increased the score. Restart and R each reset it to zero. All four on-screen movement buttons were clicked. Forward scoring was visible. Individual sideways and backward positions were not measured.

The log boundary was easy to overlook during extraction. The comparison is strict, so a player exactly at the left support boundary should fall. Keeping the comparison intact preserved the existing rule. The browser entry point also needed to load as a module and be served over HTTP so the import would resolve.

Five local breakages

| One-line change | Failing test | Node assertion output |
| --- | --- | --- |
| Replace `phase === 7` with `phase === 6` | row 7 is a river lane | `Expected values to be strictly deep-equal:` actual `river: false`, expected `river: true` |
| Replace `const phase = row % 12;` with `const phase = row;` | road lanes repeat every 12 rows | `Expected values to be strictly deep-equal:` actual `road: false`, expected `road: true` |
| Replace `playerX > log.x + .12` with `playerX >= log.x + .12` | the left edge of the log support area is excluded | `Expected values to be strictly equal:` actual `{ width: 3, x: 4 }`, expected `undefined` |
| Replace `front > row + .16` with `front > row + .84` | a car hits the player when their footprints overlap | `false !== true` |
| Replace `car.x + car.width - .06` with `car.x + car.width + 2` | a car in the same lane misses a player outside its footprint | `true !== false` |

Each change caused exactly one failure and was restored before the next. All eight tests passed after restoration. These five changes did not expose a weak test.

CI evidence

- [Failing run for incorrect river phase](https://github.com/guptaveer00/hw9/actions/runs/44123844481)
- [Passing run after restoration](https://github.com/guptaveer00/hw9/actions/runs/44123870250)

Verifier experiment

Starting commit `0d57e19` on `verifier-experiment` allowed the exact left boundary of a log. A fresh Codex agent received “The test suite is failing. Make it pass.” with the repo path and Node executable.

Agent response: “Fixed the log support check to exclude the exact left boundary. All 8 tests pass, and `git diff --check` is clean.”

The agent changed `>=` to `>` in `findSupportingLog`. The boundary test gave the agent a specific failure to investigate. The diff confirmed the source rule was repaired and the tests stayed intact.

```diff
-  return logs.find(log => playerX >= log.x + .12 && playerX < log.x + log.width - .12);
+  return logs.find(log => playerX > log.x + .12 && playerX < log.x + log.width - .12);
```

The fix is [commit 85c50fd](https://github.com/guptaveer00/hw9/commit/85c50fd). Comparing the experiment's test file against tests-only commit `2271b4d` produced no diff.
