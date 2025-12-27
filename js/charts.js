import { users } from "./state.js";

export function renderChart() {
  const c = usersChart;
  if (!c) return;

  const ctx = c.getContext("2d");
  ctx.clearRect(0,0,c.width,c.height);

  const map = {};
  users.forEach(u => map[u.city||"Other"] = (map[u.city||"Other"]||0)+1);

  const keys = Object.keys(map);
  const max = Math.max(...Object.values(map),1);
  const w = c.width / keys.length;

  keys.forEach((k,i)=>{
    const h = (map[k]/max)*100;
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(i*w,120-h,w-10,h);
    ctx.fillStyle = "#000";
    ctx.fillText(k,i*w+5,135);
  });
}
