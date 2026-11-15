// Ready-made templates. Images live in templates/<dir>/
// items: [file name, displayed name]. axes: [x low, x high, y low, y high] per language.
const TEMPLATES=[
	{
		id: "valorant",
		dir: "templates/Valorant_Agents",
		cover: ["Sage.png", "Omen.png", "Neon.png", "Fade.png"],
		axes: {
			en: ["Weak", "Strong", "Ew", "Sexy"],
			fr: ["Faible", "Fort", "Beurk", "Sexy"]
		},
		items: [
			["Astra.png", "Astra"],
			["Breach.png", "Breach"],
			["Brimstone.png", "Brimstone"],
			["Chamber.png", "Chamber"],
			["Clove.png", "Clove"],
			["Cypher.png", "Cypher"],
			["Deadlock.png", "Deadlock"],
			["Fade.png", "Fade"],
			["Gecko.png", "Gecko"],
			["Harbor.png", "Harbor"],
			["Iso.png", "Iso"],
			["Jett.png", "Jett"],
			["Kayo.png", "KAY/O"],
			["Killjoy.png", "Killjoy"],
			["Neon.png", "Neon"],
			["Omen.png", "Omen"],
			["Phoenix.png", "Phoenix"],
			["Raze.png", "Raze"],
			["Reyna.png", "Reyna"],
			["Sage.png", "Sage"],
			["Skye.png", "Skye"],
			["Sova.png", "Sova"],
			["Viper.png", "Viper"],
			["Yoru.png", "Yoru"]
		]
	},

	{
		id: "kpop",
		dir: "templates/Kpop_demon_hunters_songs",
		cover: ["Golden.jpg", "Takedown.jpg", "How_its_done.jpg", "Soda_pop.jpg"],
		axes: {
			en: ["Boring", "Catchy", "Sad", "Happy"],
			fr: ["Boring", "Catchy", "Triste", "Joyeuse"]},
		items: [
			["Free.jpg", "Free"],
			["Golden.jpg", "Golden"],
			["How_its_done.jpg", "How It’s Done"],
			["Soda_pop.jpg", "Soda Pop"],
			["Takedown.jpg", "Takedown"],
			["What_it_sounds_like.jpg", "What It Sounds Like"],
			["Your_Idol.jpg", "Your Idol"]
		]
	},

	{
		id:"chess",
		dir: "templates/Chess_Pieces",
	 	cover: ["king.png", "bishop.png", "knight.png", "rook.png"],
	 	axes: {
	 		en: ["Weak", "Strong"],
	 		fr: ["Faible", "Fort"]
	 	},
	 	items: [
	 		["pawn.png", "Pawn"],
	 		["knight.png", "Knight"],
	 		["bishop.png", "Bishop"],
	 		["rook.png", "Rook"],
	 		["king.png", "King"],
	 		["queen.png", "Queen"]
	 	]
	},

	{
		id:"france",
		dir: "templates/France_Regions",
	 	cover: ["bretagne.png", "corse.png", "occitanie.png", "la-reunion.png"],
	 	axes: {
	 		en: ["West", "East", "South", "North"],
	 		fr: ["Ouest", "Est", "Sud", "Nord"]
	 	},
	 	items: [
	 		["auvergne-rhone-alpes.png", "Auvergne-Rhône-Alpes"],
	 		["bourgogne-franche-comte.png", "Bourgogne-Franche-Comté"],
	 		["bretagne.png", "Bretagne"],
	 		["centre-val-de-loire.png", "Centre-Val de Loire"],
	 		["corse.png", "Corse"],
	 		["grand-est.png", "Grand Est"],
	 		["guadeloupe.png", "Guadeloupe"],
	 		["guyane.png", "Guyane"],	
	 		["hauts-de-france.png", "Hauts-de-France"],	
	 		["ile-de-france.png", "Île-de-France"],
	 		["la-reunion.png", "La Réunion"],
	 	  	["martinique.png", "Martinique"],
	 	  	["mayotte.png", "Mayotte"],
	 	  	["normandie.png", "Normandie"],
	 	  	["nouvelle-aquitaine.png", "Nouvelle-Aquitaine"],
	 	  	["occitanie.png", "Occitanie"],
	 	  	["pays-de-la-loire.png", "Pays de la Loire"],
	 	  	["provence-alpes-cote-d-azur.png", "Provence-Alpes-Côte d’Azur"]
	 	]
	}
];
