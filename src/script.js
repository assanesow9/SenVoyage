/* ------------------------------------------
       DONNÉES : 14 régions du Sénégal
    ------------------------------------------ */
    const REGIONS = [
      { nom: "Dakar",        emoji: "🌊" },
      { nom: "Thiès",        emoji: "🏛️" },
      { nom: "Saint-Louis",  emoji: "🌉" },
      { nom: "Kaolack",      emoji: "🥜" },
      { nom: "Ziguinchor",   emoji: "🌴" },
      { nom: "Tambacounda",  emoji: "🌍" },
      { nom: "Mbour",        emoji: "🐠" },
      { nom: "Diourbel",     emoji: "🕌" },
      { nom: "Louga",        emoji: "🌵" },
      { nom: "Fatick",       emoji: "🦩" },
      { nom: "Kolda",        emoji: "🌿" },
      { nom: "Sédhiou",      emoji: "🛶" },
      { nom: "Matam",        emoji: "🏜️" },
      { nom: "Kédougou",     emoji: "⛰️" },
    ];
 
    /* ------------------------------------------
       ÉTAT DE L'APPLICATION
    ------------------------------------------ */
    let nbPassagers  = 1;
    let dateChoisie  = null;
    let labelDate    = '';
 
    /* ------------------------------------------
       REMPLIR LES SELECTS AU CHARGEMENT
    ------------------------------------------ */
    function remplirSelects() {
      const selects = [
        document.getElementById('depart'),
        document.getElementById('arrivee')
      ];
      selects.forEach(sel => {
        REGIONS.forEach(r => {
          const opt = document.createElement('option');
          opt.value = r.nom;
          opt.textContent = r.emoji + ' ' + r.nom;
          sel.appendChild(opt);
        });
      });
    }
 
    /* ------------------------------------------
       REMPLIR LA GRILLE DES RÉGIONS
    ------------------------------------------ */
    function remplirGrilleRegions() {
      const grille = document.getElementById('grille-regions');
      REGIONS.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r.emoji + ' ' + r.nom;
        li.className = `
          bg-white border-2 border-sable-f px-5 py-2.5 rounded-full
          text-sm font-medium text-encre cursor-pointer
          shadow-sm transition-all duration-200
          hover:bg-vert-c hover:border-vert hover:text-vert-f
          hover:-translate-y-0.5 hover:shadow-md
        `;
        li.onclick = () => {
          document.getElementById('depart').value = r.nom;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        grille.appendChild(li);
      });
    }
 
    /* ------------------------------------------
       GESTION DES CHIPS DE DATE
    ------------------------------------------ */
    const JOURS   = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
    const MOIS    = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
 
    function formaterDate(d) {
      return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`;
    }
 
    function choisirDate(type, bouton) {
      // Réinitialiser tous les chips
      document.querySelectorAll('.chip-date').forEach(b => {
        b.className = b.className
          .replace('bg-vert border-vert text-white shadow-md', '')
          + ' border-sable-f text-gray-400 hover:border-vert hover:text-vert';
      });
 
      // Activer le chip cliqué
      bouton.className = bouton.className
        .replace('border-sable-f text-gray-400 hover:border-vert hover:text-vert', '')
        + ' bg-vert border-vert text-white shadow-md';
 
      const champDate = document.getElementById('date-voyage');
      const affichage = document.getElementById('date-affichage');
 
      if (type === 'today') {
        champDate.classList.add('hidden');
        dateChoisie = new Date();
        labelDate   = "Aujourd'hui · " + formaterDate(dateChoisie);
        affichage.textContent = '📅 ' + labelDate;
 
      } else if (type === 'demain') {
        champDate.classList.add('hidden');
        dateChoisie = new Date();
        dateChoisie.setDate(dateChoisie.getDate() + 1);
        labelDate   = 'Demain · ' + formaterDate(dateChoisie);
        affichage.textContent = '📅 ' + labelDate;
 
      } else {
        // Afficher le champ date
        champDate.classList.remove('hidden');
        champDate.min = new Date().toISOString().split('T')[0];
        affichage.textContent = 'Choisissez une date dans le calendrier';
        dateChoisie = null;
        labelDate   = '';
      }
    }
 
    function onDateCustom() {
      const val = document.getElementById('date-voyage').value;
      if (val) {
        dateChoisie = new Date(val + 'T12:00:00');
        labelDate   = formaterDate(dateChoisie);
        document.getElementById('date-affichage').textContent = '📅 ' + labelDate;
      }
    }
 
    /* ------------------------------------------
       COMPTEUR DE PASSAGERS
    ------------------------------------------ */
    function changerPassagers(delta) {
      nbPassagers = Math.max(1, Math.min(5, nbPassagers + delta));
      document.getElementById('nb-passagers').textContent = nbPassagers;
      document.getElementById('btn-moins').disabled = nbPassagers === 1;
      document.getElementById('btn-plus').disabled  = nbPassagers === 5;
    }
 
    /* ------------------------------------------
       VALIDATION ET RECHERCHE
    ------------------------------------------ */
    function afficherErreur(msg) {
      document.getElementById('texte-erreur').textContent = msg;
      document.getElementById('msg-erreur').classList.remove('hidden');
    }
 
    function cacherErreur() {
      document.getElementById('msg-erreur').classList.add('hidden');
    }
 
    function lancerRecherche() {
      const depart  = document.getElementById('depart').value;
      const arrivee = document.getElementById('arrivee').value;
 
      if (!depart) {
        afficherErreur('Veuillez sélectionner une ville de départ.'); return;
      }
      if (!arrivee) {
        afficherErreur("Veuillez sélectionner une ville d'arrivée."); return;
      }
      if (depart === arrivee) {
        afficherErreur('Le départ et l\'arrivée doivent être différents.'); return;
      }
      if (!dateChoisie) {
        afficherErreur('Veuillez choisir une date de voyage.'); return;
      }
      cacherErreur();
 
      // ✅ Ici on passera à la page de résultats (étape 2)
      alert(
        `✅ Recherche lancée !\n\n` +
        `📍 Départ   : ${depart}\n` +
        `🏁 Arrivée  : ${arrivee}\n` +
        `📅 Date     : ${labelDate}\n` +
        `👥 Passagers: ${nbPassagers}\n\n` +
        `→ Prochaine étape : Page de résultats`
      );
    }
 
    /* ------------------------------------------
       INITIALISATION
    ------------------------------------------ */
    remplirSelects();
    remplirGrilleRegions();
    // Sélectionner "Aujourd'hui" par défaut
    choisirDate('today', document.getElementById('chip-today'));
    // Année dynamique dans le copyright
    document.getElementById('annee-copyright').textContent = new Date().getFullYear();
 