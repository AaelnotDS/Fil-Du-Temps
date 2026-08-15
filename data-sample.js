// Données de démonstration, au même format que ce que l'app construit
// à partir de votre Google Sheet une fois CONFIG.SHEET_CSV_URL renseigné
// dans app.js. Tant que ce lien n'est pas renseigné, c'est ce jeu de
// données qui s'affiche.

window.SAMPLE_EVENTS = [
  {
    id: 'amanirenas', annee: -25, date_affichee: 'v. 27 av. J.-C.',
    lieu: 'Royaume de Koush (actuel Soudan)', lat: 15.5, lng: 32.5,
    theme: 'Résistances', zone_geo: 'Afrique',
    personnages: ['Amanirenas', 'Auguste'],
    resume: [
      "Alors que l'Empire romain étend son emprise sur l'Égypte, la reine Amanirenas, à la tête du royaume de Koush, mène plusieurs années de résistance armée contre les garnisons romaines installées au sud de la première cataracte du Nil.",
      "Les sources antiques racontent qu'elle aurait perdu un œil au combat sans jamais cesser de commander ses troupes. Le conflit se conclut par un traité relativement favorable à Koush, un dénouement rare face à Rome à cette époque."
    ],
    videos: [], auteur: '', sources: ''
  },
  {
    id: 'zanj', annee: 869, date_affichee: '869',
    lieu: 'Basse Mésopotamie (Irak actuel)', lat: 30.5, lng: 47.8,
    theme: 'Résistances', zone_geo: 'Moyen-Orient',
    personnages: ['Ali ibn Muhammad'],
    resume: [
      "Pendant près de quinze ans, des dizaines de milliers d'esclaves affectés aux travaux agricoles les plus pénibles du califat abbasside se soulèvent et fondent leur propre État autour de Bassora.",
      "Le mouvement, mené par Ali ibn Muhammad, tient tête aux armées califales pendant plus d'une décennie avant d'être écrasé — un épisode que l'historiographie a longtemps traité comme un simple fait divers plutôt que comme l'une des plus grandes révoltes serviles de l'histoire."
    ],
    videos: [{plateforme:'YouTube', label:'Exemple — remplacez par votre lien', url:'#'}],
    auteur: 'Yanni', sources: ''
  },
  {
    id: 'onna-musha', annee: 1184, date_affichee: '1184',
    lieu: 'Japon', lat: 36.2, lng: 138.0,
    theme: 'Figures oubliées', zone_geo: 'Asie',
    personnages: ['Tomoe Gozen'],
    resume: [
      "Les récits épiques du Japon féodal mentionnent des onna-musha, des femmes de la noblesse guerrière entraînées au combat au même titre que les hommes. Tomoe Gozen, qui aurait combattu lors de la guerre de Genpei, en reste la figure la plus citée.",
      "Longtemps réduite à un personnage romanesque, son existence illustre un rôle féminin dans la guerre médiévale japonaise que la vulgate du samouraï strictement masculin a largement effacé."
    ],
    videos: [], auteur: 'Manon', sources: ''
  },
  {
    id: 'mansa-moussa', annee: 1324, date_affichee: '1324',
    lieu: 'Empire du Mali', lat: 16.0, lng: -3.0,
    theme: 'Sociétés & pouvoirs', zone_geo: 'Afrique',
    personnages: ['Mansa Moussa'],
    resume: [
      "Souverain de l'empire du Mali, alors l'un des plus grands producteurs d'or au monde, Mansa Moussa entreprend un pèlerinage vers La Mecque avec une caravane si richement dotée en or qu'elle aurait, selon les chroniques du Caire, fait chuter sa valeur sur les marchés locaux pendant des années.",
      "Cet épisode fait de lui l'un des hommes les plus riches jamais recensés dans l'histoire, à une époque où l'Europe ignorait presque tout de la puissance de l'Afrique de l'Ouest médiévale."
    ],
    videos: [{plateforme:'TikTok', label:'Exemple — remplacez par votre lien', url:'#'}],
    auteur: 'Jules', sources: ''
  },
  {
    id: 'zheng-he', annee: 1405, date_affichee: '1405',
    lieu: 'Mer de Chine, océan Indien', lat: 32.0, lng: 118.8,
    theme: 'Explorations & échanges', zone_geo: 'Asie',
    personnages: ['Zheng He'],
    resume: [
      "Amiral eunuque de la dynastie Ming, Zheng He commande sept expéditions maritimes à la tête de flottes qui comptaient parfois plus de deux cents navires, plusieurs décennies avant les grands voyages européens.",
      "Ces expéditions atteignent l'Asie du Sud-Est, l'Inde, la péninsule Arabique et la côte est-africaine, tissant des réseaux diplomatiques et commerciaux qui seront abandonnés par la Chine impériale peu après sa mort."
    ],
    videos: [], auteur: '', sources: ''
  },
  {
    id: 'cospaia', annee: 1440, date_affichee: '1440',
    lieu: 'Cospaia, Italie', lat: 43.5, lng: 12.2,
    theme: 'Sociétés & pouvoirs', zone_geo: 'Europe',
    personnages: [],
    resume: [
      "Une erreur de bornage entre les États pontificaux et la République de Florence laisse un minuscule territoire sans souveraineté reconnue. Ses habitants en profitent pour se déclarer indépendants pendant près de quatre siècles.",
      "N'étant soumise à aucun impôt ni monopole, Cospaia devient un haut lieu de culture du tabac, alors interdite alentour, avant d'être finalement rattachée à la Toscane en 1826."
    ],
    videos: [], auteur: 'Hugo', sources: ''
  },
  {
    id: 'tombouctou', annee: 1510, date_affichee: 'v. XVe–XVIe s.',
    lieu: 'Tombouctou, Empire Songhaï', lat: 16.77, lng: -3.01,
    theme: 'Sciences & savoirs', zone_geo: 'Afrique',
    personnages: [],
    resume: [
      "À l'apogée de l'empire Songhaï, Tombouctou compte plusieurs dizaines de milliers d'étudiants réunis autour de l'université de Sankoré, où l'on enseigne le droit, l'astronomie, la médecine ou les mathématiques.",
      "Les manuscrits qui y sont produits et conservés, plusieurs centaines de milliers selon les estimations, contredisent l'idée longtemps répandue d'une Afrique de l'Ouest sans tradition écrite savante."
    ],
    videos: [], auteur: '', sources: ''
  },
  {
    id: 'afonso', annee: 1526, date_affichee: '1526',
    lieu: 'Royaume du Kongo', lat: -5.79, lng: 14.24,
    theme: 'Sociétés & pouvoirs', zone_geo: 'Afrique',
    personnages: ['Nzinga Mbemba (Afonso Ier)'],
    resume: [
      "Converti au christianisme et allié du royaume du Portugal, le souverain du Kongo Afonso Ier entretient une correspondance diplomatique suivie avec Lisbonne et le Vatican, échangeant émissaires, prêtres et artisans.",
      "Dans plusieurs de ses lettres, il alerte le roi du Portugal sur les ravages que la traite négrière naissante inflige à son royaume — un témoignage africain direct, rare pour l'époque, sur les débuts de ce commerce."
    ],
    videos: [], auteur: '', sources: ''
  },
  {
    id: 'bois-caiman', annee: 1791, date_affichee: 'Août 1791',
    lieu: 'Saint-Domingue (Haïti actuel)', lat: 19.76, lng: -72.2,
    theme: 'Résistances', zone_geo: 'Amériques',
    personnages: ['Dutty Boukman', 'Cécile Fatiman'],
    resume: [
      "Selon la tradition orale haïtienne, une cérémonie vodou tenue dans la nuit du 14 août 1791 aurait servi de point de départ à l'insurrection générale des personnes réduites en esclavage à Saint-Domingue.",
      "Menée par des figures aujourd'hui moins connues que Toussaint Louverture, comme le prêtre vodou Dutty Boukman ou la prêtresse Cécile Fatiman, cette révolte ouvre la voie à la première abolition de l'esclavage obtenue par ceux qui la subissaient, et à la naissance d'Haïti."
    ],
    videos: [{plateforme:'YouTube', label:'Exemple — remplacez par votre lien', url:'#'}],
    auteur: 'Constance', sources: ''
  },
  {
    id: 'petroleuses', annee: 1871, date_affichee: 'Mai 1871',
    lieu: 'Paris', lat: 48.8566, lng: 2.3522,
    theme: 'Luttes sociales', zone_geo: 'Europe',
    personnages: ['Louise Michel'],
    resume: [
      "Durant la Semaine sanglante qui met fin à la Commune de Paris, la presse conservatrice accuse des femmes du peuple d'avoir incendié la capitale au pétrole — les « pétroleuses ». Aucune preuve sérieuse n'a jamais confirmé l'ampleur de ces accusations.",
      "Le mythe, largement fabriqué pour discréditer l'engagement politique des femmes communardes, éclipse leur rôle réel : infirmières, combattantes, organisatrices, à l'image de Louise Michel."
    ],
    videos: [], auteur: '', sources: ''
  },
  {
    id: 'lawrence', annee: 1912, date_affichee: 'Janvier 1912',
    lieu: 'Lawrence, Massachusetts', lat: 42.707, lng: -71.163,
    theme: 'Luttes sociales', zone_geo: 'Amériques',
    personnages: [],
    resume: [
      "Quand les employeurs textiles de Lawrence réduisent les salaires en réponse à une nouvelle loi limitant le temps de travail, des ouvrières immigrées, parlant plus de vingt langues différentes, déclenchent une grève générale spontanée.",
      "Le mot d'ordre attribué au mouvement, réclamer « du pain, mais aussi des roses », en fait l'un des symboles fondateurs de la lutte pour la dignité au travail, au-delà de la seule question salariale."
    ],
    videos: [], auteur: 'Victoire', sources: ''
  },
  {
    id: 'code-talkers', annee: 1942, date_affichee: '1942–1945',
    lieu: 'Théâtre du Pacifique, Seconde Guerre mondiale', lat: 35.68, lng: -109.05,
    theme: 'Figures oubliées', zone_geo: 'Amériques',
    personnages: [],
    resume: [
      "Pendant la Seconde Guerre mondiale, l'armée américaine recrute des soldats navajos pour transmettre des messages militaires codés dans leur langue, alors non écrite et pratiquement inconnue en dehors de leur communauté.",
      "Ce code ne sera jamais percé par les forces japonaises. Ses artisans resteront pourtant tenus au secret pendant plus de vingt ans après la guerre, et largement ignorés de l'histoire officielle du conflit."
    ],
    videos: [], auteur: '', sources: ''
  }
];
