const filters = document.querySelector(".filters");
const gallery = document.querySelector(".gallery");
const projects = [...gallery.querySelectorAll(".project")];
const options = [...filters.querySelectorAll("button")];
const status = document.querySelector("#filter-status");

function showGroup(group) {
  const selected = options.find(option => option.dataset.filter === group) || options[0];
  const current = selected.dataset.filter;
  gallery.classList.toggle("filtered", current !== "all");
  options.forEach(option => option.setAttribute("aria-pressed", String(option === selected)));
  projects.forEach(project => {
    project.hidden = current !== "all" && project.dataset.group !== current;
  });
  const count = projects.filter(project => !project.hidden).length;
  status.textContent = selected.textContent + "，共 " + count + " 个项目";
}

function readLocation() {
  const category = location.hash.slice(1);
  showGroup(category);
  if (options.some(option => option.dataset.filter === category)) {
    document.querySelector("#projects").scrollIntoView({ behavior: "instant" });
  }
}

filters.hidden = false;
filters.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button || button.getAttribute("aria-pressed") === "true") return;
  const category = button.dataset.filter;
  showGroup(category);
  const hash = category === "all" ? "projects" : category;
  location.hash = hash;
});
window.addEventListener("hashchange", readLocation);
readLocation();

const dialog = document.querySelector("dialog");
const player = dialog.querySelector("video");
const playerTitle = dialog.querySelector("h2");
let opener;

document.addEventListener("click", event => {
  const link = event.target.closest("a[data-video]");
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
      typeof dialog.showModal !== "function") return;
  event.preventDefault();
  opener = link;
  playerTitle.textContent = link.dataset.title;
  player.src = link.getAttribute("href");
  dialog.showModal();
  player.play().catch(() => {});
});
dialog.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right ||
      event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener("close", () => {
  player.pause();
  player.removeAttribute("src");
  player.load();
  opener?.focus({ preventScroll: true });
});
