import path from "path";
import fs from "fs";
import { findShortestPath } from "./findShortestPath.js";

//setup
const fetchData = () => {
  const fileName = path.resolve(process.cwd(), "input.txt");
  const fileContent = fs.readFileSync(fileName, "utf-8");
  return fileContent;
};

const lines = fetchData().split(/\r?\n/).filter(Boolean);

const pattern =
  /^Valve (?<point>.*) has flow rate=(?<rate>.*); tunnel(s?) lead(s?) to valve(s?) (?<connections>.*)$/;

const data = lines
  .map((line) => line.match(pattern).groups)
  .map(({ point, rate, connections }) => ({
    point,
    rate: Number(rate),
    connections: connections.split(", "),
  }));

const distanceGraph = data.reduce(
  (res, d) => ({
    ...res,
    [d.point]: d.connections.reduce((acc, c) => ({ ...acc, [c]: 1 }), {}),
  }),
  {}
);

const distanceMap = new Map();
function findDistance(start, finish) {
  const hash = `${start}_${finish}`;
  if (distanceMap.has(hash)) return distanceMap.get(hash);
  const distance = findShortestPath(distanceGraph, start, finish).distance;
  distanceMap.set(hash, distance);
}

const scoresMap = data.reduce((acc, d) => ({ ...acc, [d.point]: d.rate }), {});

function getReward(start: string, finish: string, lifeLeft: number) {
  const distance = findDistance(start, finish);
  const requiredLife = distance + 1;
  const reward = (lifeLeft - requiredLife) * scoresMap[finish];
  return { requiredLife, reward };
}

function getRouteReward(route: string[], life: number) {
  let totalReward = 0;
  let remainingLife = life;
  for (let i = 1; i < route.length; i++) {
    const res = getReward(route[i - 1], route[i], remainingLife);
    if (remainingLife <= 0) break;
    totalReward += res.reward;
    remainingLife -= res.requiredLife;
  }
  return { reward: totalReward, life: remainingLife };
}

const weightedPoints = data.filter((d) => d.rate).map((d) => d.point);

//part 1
{
  let maxReward = 0;

  function walk(path: string[], nodes: string[]) {
    const stats = getRouteReward(["AA", ...path], 30);

    if (stats.life <= 0) {
      return false;
    }

    if (stats.reward > maxReward) maxReward = stats.reward;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      path.push(node);
      walk(
        path,
        nodes.filter((n) => n !== node)
      );
      path.pop();
    }
  }

  walk([], weightedPoints);

  console.log("part 1", maxReward); //1751
}

//part 2
{
  const PART2_LIFE = 26;
  let allRoutes = [];

  function walk(path: string[], nodes: string[]) {
    const stats = getRouteReward(["AA", ...path], PART2_LIFE);

    if (stats.life <= 0) {
      return false;
    }

    allRoutes.push([...path]);

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      path.push(node);
      walk(
        path,
        nodes.filter((n) => n !== node)
      );
      path.pop();
    }
  }

  walk([], weightedPoints);

  const part2 = Math.max(
    ...allRoutes.map((r1, i, self) => {
      const { reward } = getRouteReward(["AA", ...r1], PART2_LIFE);
      const parallelRoutes = allRoutes.filter((r) =>
        r.every((p) => !r1.includes(p))
      );
      const secondsReward = Math.max(
        ...parallelRoutes.map(
          (r) => getRouteReward(["AA", ...r], PART2_LIFE).reward
        )
      );
      console.log(`Progress: ${Math.floor((100 * i) / self.length)}%`);
      return reward + secondsReward;
    })
  );

  console.log("part 2", part2); //2207
}
