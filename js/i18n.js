// Add a language: copy the "en" block, translate it, and add a button case in setLang().
const LANG={
    en:{
        sub: "Compare items head to head and watch a quantified ranking build up.",
        items_h: "Items",
        items_d: "Add the things you want to rank: type their names, add images, or mix both.",
        src_text: "Type names",
        src_img: "Add images",
        drop_t: "Click to choose images, or drop them here",
        drop_d: "You can select several at once.",
        remove: "Remove",
        ph_names: "One name per line, for example:\nPizza\nSushi\nTacos",
        files_note: "Images are named after their file. Images stay in your browser.",
        cont: "Continue a previous session:",
        clr: "Clear import",
        method_h: "Ranking method",
        per_item: "Duels per item",
        kfac: "Elo K-factor",
        k16: "16 – slow, stable",
        k32: "32 – balanced",
        k64: "64 – fast, volatile",
        ktip: "K controls how far a rating moves after each duel. Higher K reacts faster but is noisier.",
        start: "Start ranking",
        tie: "Tie",
        undo: "Undo",
        reset: "New session",
        keys: "Keys: [left] left item, [down] tie, [right] right item",
        live_h: "Live ranking",
        res_h: "Results (JSON)",
        copy: "Copy",
        copied: "Copied",
        dl: "Download .json",
        mode_rr: "Full round-robin",
        mode_smart: "Elo – adaptive pairing",
        mode_bt: "Bradley–Terry – adaptive pairing",
        mode_rand: "Elo – random pairing",
        tip_rr: "Every item meets every other item exactly once. Score = win rate (a tie counts as half a win). Most exact, but the number of duels grows with n².",
        tip_smart: "Elo ratings, and each new duel pits items with similar ratings against each other. Gives the most information per duel, so the ranking converges quickly.",
        tip_bt: "Refits a statistical model on all duels at once, so the result does not depend on the order of answers. Usually more accurate than Elo for the same number of duels. Shown on an Elo-like scale (1000 = average).",
        tip_rand: "Elo ratings with random opponents. Simpler and less biased by early results, but needs more duels to settle.",
        count_min: "Add at least 2 items.",
        count_n: "{n} items → {p} possible pairs.",
        x_rr: "{p} duels in total",
        x_toomany: " (too many for this list)",
        x_rec: "Recommended for this list size",
        x_about: "About {d} duels",
        imp_ok: "Imported {n} duels. Add images with the same names to show them.",
        imp_err: "Could not read this file. Use a JSON exported by this tool.",
        discard: "Discard this session?",
        duel_of: "Duel {n} of {total}",
        duel_n: "Duel {n}",
        done_rr: "{n}/{total} done",
        done_elo: "{n} duels · target {t} per item",
        all_done: "All duels complete.",
        more: "Add 2 more duels per item",
        two_axes: "Rate on two axes (scatter plot)",
        two_tip: "Each duel asks two questions, one per axis, and the live view becomes a scatter plot. You can skip either question for a pair.",
        which: "Which is more “{x}”?",
        skip: "Skip",
        keys2: "Keys: [left] [down] [right] for the first row, A S D for the second",
        ay_lo: "low",
        ay_hi: "high",
        import_btn: "Import",
        imp_h: "Import a previous session or template",
        imp_d: "Choose a JSON file exported by this tool.",
        imp_session: "Continue a session",
        imp_session_d: "Restores the items, duels, manual positions and axis names.",
        imp_tpl: "Use as a template",
        imp_tpl_d: "Keeps only the items and axis names, then starts from scratch.",
        tpl_ok: "Template loaded: {n} items.",
        foot_by: "Made by",
        foot_more: "Explore other projects",
        tpl_h: "Templates",
        tpl_items: "{n} items",
        tpl_replace: "Replace the current items with this template?",
        prev: "Previous",
        next: "Next",
        t_valorant: "Valorant agents",
        t_valorant_d: "Rank the agents from weak to strong, and from ew to sexy.",
        t_kpop: "KPop Demon Hunters songs",
        t_kpop_d: "Rank the songs from sleepy to catchy, and from sad to happy.",
        t_france: "Regions of France",
        t_france_d: "Rank the regions by their geographical positions. Yes it's a dummy example.",
        t_chess: "Chess pieces",
        t_chess_d: "Rank chess pieces from weak to strong.",
        size_l: "Item size",
        exp: "Export image",
        exp_err: "Could not export the image. Open the page over http(s) (for example on GitHub Pages) rather than as a local file.",
        validate: "Validate items",
        clear_all: "Clear all",
        clear_confirm: "Clear all items and settings?",
        how_h: "How do you want to rank your items?",
        ch_manual: "Manual",
        ch_manual_d: "Drag and drop each item to where you think it belongs.",
        ch_assist: "Assisted",
        ch_assist_d: "Compare items two by two and let the ranking be computed for you.",
        back: "Back",
        tray_h: "To place: drag each item onto the plot",
        tray_done: "All items placed. Drag them to fine-tune; double-click to send one back.",
        empty_hint: "Add your items below, then validate.",
        ax_manual: "your placement",
        mode_manual: "Manual placement",
        drag_hint: "Drag to reposition · double-click to reset",
        resetpos: "Reset manual positions",
        ax_bad: "bad",
        ax_good: "good",
        ax_edit: "Click to rename this end of the axis",
        ax_rr: "win rate",
        ax_bt: "Bradley–Terry strength (Elo scale)",
        ax_elo: "Elo rating",
        n_duels:"{n} duels",
        lang_name: "English",
        lang_title: "Language",
        theme_title: "Switch theme"
    },
    fr: {
        sub: "Comparez des éléments deux à deux et suivez un classement chiffré qui se construit en direct.",
        items_h: "Éléments",
        items_d: "Ajoutez ce que vous voulez classer : saisissez des noms, ajoutez des images, ou mélangez les deux.",
        src_text: "Saisir des noms",
        src_img: "Ajouter des images",
        drop_t: "Cliquez pour choisir des images, ou déposez-les ici",
        drop_d: "Vous pouvez en sélectionner plusieurs à la fois.",
        remove: "Retirer",
        ph_names: "Un nom par ligne, par exemple :\nPizza\nSushi\nTacos",
        files_note: "Les images sont nommées d’après leur fichier. Elles restent dans votre navigateur.",
        cont: "Reprendre une session précédente :",
        clr: "Effacer l’import",
        method_h: "Méthode de classement",
        per_item: "Duels par élément",
        kfac: "Facteur K d’Elo",
        k16: "16 – lent, stable",
        k32: "32 – équilibré", 
        k64: "64 – rapide, instable",
        ktip: "K règle l’ampleur du changement de note après chaque duel. Plus K est élevé, plus la réaction est rapide, mais bruitée.",
        start: "Commencer le classement",
        tie: "Égalité",
        undo: "Annuler",
        reset: "Nouvelle session",
        keys: "Touches : [left] élément de gauche, [down] égalité, [right] élément de droite",
        live_h: "Classement en direct",
        res_h: "Résultats (JSON)",
        copy: "Copier",
        copied: "Copié",
        dl: "Télécharger .json",
        mode_rr: "Tournoi complet (round-robin)",
        mode_smart: "Elo – appariement adaptatif",
        mode_bt: "Bradley–Terry – appariement adaptatif",
        mode_rand: "Elo – appariement aléatoire",
        tip_rr: "Chaque élément affronte chaque autre exactement une fois. Score = taux de victoire (une égalité compte pour une demi-victoire). Le plus exact, mais le nombre de duels croît avec n².",
        tip_smart: "Notes Elo, et chaque nouveau duel oppose des éléments de notes proches. C’est ce qui apporte le plus d’information par duel : le classement converge vite.",
        tip_bt: "Ajuste un modèle statistique sur tous les duels à la fois : le résultat ne dépend pas de l’ordre des réponses. Généralement plus précis qu’Elo à nombre de duels égal. Affiché sur une échelle proche d’Elo (1000 = moyenne).",
        tip_rand: "Notes Elo avec des adversaires tirés au hasard. Plus simple et moins influencé par les premiers résultats, mais demande plus de duels pour se stabiliser.",
        count_min: "Ajoutez au moins 2 éléments.",
        count_n: "{n} éléments → {p} paires possibles.",
        x_rr: "{p} duels au total",
        x_toomany: " (trop pour cette liste)",
        x_rec: "Recommandé pour cette taille de liste",
        x_about: "Environ {d} duels",
        imp_ok: "{n} duels importés. Ajoutez des images portant les mêmes noms pour les afficher.",
        imp_err: "Impossible de lire ce fichier. Utilisez un JSON exporté par cet outil.",
        discard: "Abandonner cette session ?",
        duel_of: "Duel {n} sur {total}",
        duel_n: "Duel {n}",
        done_rr: "{n}/{total} terminés",
        done_elo: "{n} duels · objectif {t} par élément",
        all_done: "Tous les duels sont terminés.",
        more: "Ajouter 2 duels par élément",
        two_axes: "Noter sur deux axes (nuage de points)",
        two_tip: "Chaque duel pose deux questions, une par axe, et le suivi en direct devient un nuage de points. Vous pouvez ignorer l’une des questions pour une paire.",
        which: "Lequel est le plus « {x} » ?",
        skip: "Passer",
        keys2: "Touches : [left] [down] [right] pour la première ligne, A S D pour la seconde",
        ay_lo: "faible",
        ay_hi: "élevé",
        import_btn: "Importer",
        imp_h: "Importer une session ou un modèle",
        imp_d: "Choisissez un fichier JSON exporté par cet outil.",
        imp_session: "Reprendre une session",
        imp_session_d: "Restaure les éléments, les duels, les positions manuelles et les noms d’axes.",
        imp_tpl: "Utiliser comme modèle",
        imp_tpl_d: "Ne garde que les éléments et les noms d’axes, puis repart de zéro.",
        tpl_ok: "Modèle chargé : {n} éléments.",
        foot_by: "Fait par",
        foot_more: "Découvrir d’autres projets",
        tpl_h: "Modèles",
        tpl_items: "{n} éléments",
        tpl_replace: "Remplacer les éléments actuels par ce modèle ?",
        prev: "Précédent",
        next: "Suivant",
        t_valorant: "Agents de Valorant",
        t_valorant_d: "Classez les agents de faible à fort, et de beurk à sexy.",
        t_kpop: "Chansons de KPop Demon Hunters",
        t_kpop_d: "Classez les chansons d’endormante à entêtante, et de triste à joyeuse.",
        t_france: "Régions de France",
        t_france_d: "Classez les régions d’après leur positions géographiques. Oui, c’est un exemple bête.",
        t_chess: "Pions des échecs",
        t_chess_d: "Classez les pions des échecs de faibles à forts.",
        size_l: "Taille des éléments",
        exp: "Exporter l’image",
        exp_err: "Impossible d’exporter l’image. Ouvrez la page en http(s) (par exemple sur GitHub Pages) plutôt que comme fichier local.",
        validate: "Valider les éléments",
        clear_all: "Tout effacer",
        clear_confirm: "Effacer tous les éléments et réglages ?",
        how_h: "Comment voulez-vous classer vos éléments ?",
        ch_manual: "Manuel",
        ch_manual_d: "Glissez-déposez chaque élément à l’endroit où il vous semble à sa place.",
        ch_assist: "Assisté",
        ch_assist_d: "Comparez les éléments deux par deux ; le classement est calculé pour vous.",
        back: "Retour",
        tray_h: "À placer : glissez chaque élément sur le graphique",
        tray_done: "Tout est placé. Glissez pour affiner ; double-clic pour en renvoyer un.",
        empty_hint: "Ajoutez vos éléments ci-dessous, puis validez.",
        ax_manual: "votre placement",
        mode_manual: "Placement manuel",
        drag_hint: "Glissez pour repositionner · double-clic pour réinitialiser",
        resetpos: "Réinitialiser les positions manuelles",
        ax_bad: "mauvais",
        ax_good: "bon",
        ax_edit: "Cliquez pour renommer cette extrémité de l’axe",
        ax_rr: "taux de victoire",
        ax_bt: "force Bradley–Terry (échelle Elo)",
        ax_elo: "note Elo",
        n_duels: "{n} duels",
        lang_name: "Français",
        lang_title: "Langue",
        theme_title: "Changer de thème"
    }
};

let lang=(()=>{let l=null;try{l=localStorage.getItem("lang")}catch(e){}
    return l in LANG?l:(navigator.language||"en").toLowerCase().startsWith("fr")?"fr":"en"})();

// Turns [left] / [right] / [up] / [down] tokens in a string into Font Awesome arrows (other text is escaped).
function rich(s){
    return s.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))
        .replace(/\[(left|right|up|down)\]/g,(m,d)=>`<i class="fa-solid fa-arrow-${d}" aria-hidden="true"></i>`);
}

function t(k,p){
    let s=(LANG[lang]&&LANG[lang][k])||LANG.en[k]||k;
    if(p)for(const x in p)s=s.split("{"+x+"}").join(p[x]);
    return s;
}

function applyLang(){
    document.documentElement.lang=lang;
    document.querySelectorAll("[data-i18n]").forEach(e=>{const s=t(e.dataset.i18n);if(s.includes("["))e.innerHTML=rich(s);else e.textContent=s});
    document.querySelectorAll("[data-i18n-ph]").forEach(e=>e.placeholder=t(e.dataset.i18nPh));
    document.querySelectorAll("[data-i18n-aria]").forEach(e=>{e.setAttribute("aria-label",t(e.dataset.i18nAria));e.title=t(e.dataset.i18nAria)});
    document.querySelectorAll("[data-i18n-tip]").forEach(e=>e.dataset.tip=t(e.dataset.i18nTip));
    const lb=document.getElementById("langbtn"),tb=document.getElementById("themebtn");
    lb.title=t("lang_title");lb.setAttribute("aria-label",t("lang_title"));buildLangMenu();
    for(const id of["axl","axr","ayl","ayr"])document.getElementById(id).title=t("ax_edit");
    tb.innerHTML=`<i class="fa-solid fa-${window.currentTheme==="dark"?"sun":"moon"}" aria-hidden="true"></i>`;tb.title=t("theme_title");tb.setAttribute("aria-label",t("theme_title"));
}

function buildLangMenu(){
    const m=document.getElementById("langmenu");m.innerHTML="";
    Object.keys(LANG).forEach(code=>{
        const li=document.createElement("li"),b=document.createElement("button"),cur=code===lang;
        b.className="mi"+(cur?" cur":"");b.textContent=LANG[code].lang_name;if(cur)b.insertAdjacentHTML("beforeend",' <i class="fa-solid fa-check" aria-hidden="true"></i>');
        b.setAttribute("role","option");b.setAttribute("aria-selected",cur);
        b.onclick=()=>{closeLangMenu();setLang(code)};
        li.append(b);m.append(li);
    });
}
function closeLangMenu(){
    document.getElementById("langmenu").classList.add("hide");
    document.getElementById("langbtn").setAttribute("aria-expanded","false");
}

function setLang(l){
    lang=l;try{localStorage.setItem("lang",l)}catch(e){}
    refreshLang(); // defined in app.js: re-renders setup, import note and the live session
}