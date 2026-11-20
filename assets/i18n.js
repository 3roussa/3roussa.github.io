/* Langue du site : français par défaut, anglais sur demande.
   Choix gardé dans le navigateur ; ?lang=en ou ?lang=fr dans l'adresse l'impose.
   Les textes anglais des pages sont dans des attributs data-en (contenu)
   et data-en-<attribut> (ex. data-en-content, data-en-aria-label). */
(function () {
  var lang = "fr";
  try { lang = localStorage.getItem("lang") || "fr"; } catch (e) {}
  var q = new URLSearchParams(location.search).get("lang");
  if (q === "en" || q === "fr") {
    lang = q;
    try { localStorage.setItem("lang", q); } catch (e) {}
  }
  if (lang !== "en") lang = "fr";
  window.LANG = lang;
  document.documentElement.lang = lang;

  function translate() {
    if (lang !== "en") return;
    document.querySelectorAll("*").forEach(function (el) {
      for (var i = 0; i < el.attributes.length; i++) {
        var a = el.attributes[i];
        if (a.name === "data-en") el.innerHTML = a.value;
        else if (a.name.indexOf("data-en-") === 0) el.setAttribute(a.name.slice(8), a.value);
      }
    });
  }

  function switcher() {
    var nav = document.querySelector(".site-head .nav");
    if (!nav || nav.querySelector(".lang")) return;
    var box = document.createElement("div");
    box.className = "lang";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", lang === "en" ? "Language" : "Langue");
    [["fr", "FR", "Français"], ["en", "EN", "English"]].forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = o[1];
      b.lang = o[0];
      b.title = o[2];
      b.setAttribute("aria-label", o[2]);
      b.setAttribute("aria-pressed", String(o[0] === lang));
      b.addEventListener("click", function () {
        if (o[0] === lang) return;
        try { localStorage.setItem("lang", o[0]); } catch (e) {}
        var u = new URL(location.href);
        if (o[0] === "en") u.searchParams.set("lang", "en"); else u.searchParams.delete("lang");
        location.href = u.toString();
      });
      box.appendChild(b);
    });
    nav.appendChild(box);
  }

  function run() { translate(); switcher(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
