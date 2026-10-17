/* Bestiarium 3.0. Identificadores, códigos y recompensas conservados de V2.5. */
window.BESTIARIUM = {
  "version": "3.1.0",
  "ranks": [
    {
      "min": 0,
      "rank": "E",
      "title": "Recluta del Gremio"
    },
    {
      "min": 100,
      "rank": "D",
      "title": "Rastreador Novato"
    },
    {
      "min": 250,
      "rank": "C",
      "title": "Cazador Certificado"
    },
    {
      "min": 450,
      "rank": "B",
      "title": "Veterano del Gremio"
    },
    {
      "min": 700,
      "rank": "A",
      "title": "Maestro Cazador"
    },
    {
      "min": 1000,
      "rank": "S",
      "title": "Leyenda del Gremio"
    }
  ],
  "zones": [
    {
      "id": "pantano",
      "name": "Ciénaga del Velo",
      "tagline": "Allí donde se hunden los nombres",
      "desc": "El agua inmóvil guarda pactos antiguos. Entre juncos y faroles apagados, algo sigue tus pasos.",
      "camp": "La barca del último farero",
      "landmark": "El santuario sumergido",
      "color": "#87a794",
      "number": "01",
      "image": "assets/art/territory-pantano.webp"
    },
    {
      "id": "bosque",
      "name": "Bosque de las Raíces Huecas",
      "tagline": "El bosque recuerda a quienes entran",
      "desc": "Las raíces abrazan fortalezas vacías. Escucha la madera: cada crujido es un rastro.",
      "camp": "El campamento de los exiliados",
      "landmark": "La capilla del árbol hueco",
      "color": "#a9b79a",
      "number": "02",
      "image": "assets/art/territory-bosque.webp"
    },
    {
      "id": "crater",
      "name": "Cráter de las Mil Formas",
      "tagline": "Nada conserva su forma al caer la noche",
      "desc": "Una estrella abrió esta herida en el mundo. Sus fragmentos todavía sueñan con otras criaturas.",
      "camp": "El observatorio roto",
      "landmark": "Las agujas de cristal",
      "color": "#b5a1cf",
      "number": "03",
      "image": "assets/art/territory-crater.webp"
    },
    {
      "id": "forja",
      "name": "Forja de las Cenizas",
      "tagline": "Bajo la montaña, el fuego no descansa",
      "desc": "Los martillos callaron hace siglos. El corazón de la montaña continúa golpeando.",
      "camp": "El puesto del herrero errante",
      "landmark": "El puente de escoria",
      "color": "#d79c6e",
      "number": "04",
      "image": "assets/art/territory-forja.webp"
    },
    {
      "id": "ruinas",
      "name": "Ruinas del Rey Olvidado",
      "tagline": "Una corona sin reino. Un juramento sin fin.",
      "desc": "Campanas sin campanarios anuncian la guardia. No todas las estatuas permanecen inmóviles.",
      "camp": "La posada de la corona rota",
      "landmark": "El patio de los juramentos",
      "color": "#bf9598",
      "number": "05",
      "image": "assets/art/territory-ruinas.webp"
    },
    {
      "id": "dominio",
      "name": "Dominio de Quimerax",
      "tagline": "El principio de todas las anomalías",
      "desc": "Seis sellos sostienen el último umbral. Más allá, una sombra reúne los ecos de todo el mundo.",
      "camp": "El refugio de la última vigilia",
      "landmark": "El altar de los seis sellos",
      "color": "#d7bc7e",
      "number": "06",
      "image": "assets/art/territory-dominio.webp"
    }
  ],
  "monsters": [
    {
      "id": "virulox",
      "number": "01",
      "name": "Virulox",
      "epithet": "El heraldo del Velo",
      "type": "Espectro alado",
      "zoneId": "pantano",
      "threat": 2,
      "lore": "Una máscara de hueso flota entre jirones de piel oscura. Sus alas dejan un polvo rojizo que borra los senderos.",
      "habitat": "Los juncales bajo la luna roja.",
      "weakness": "La luz de los faros rompe su velo.",
      "traits": "Largo hocico óseo, alas rasgadas y espinas carmesíes.",
      "sessionCode": "GREMIO-PANTANO",
      "captureCode": "NUCLEO-7",
      "reward": {
        "xp": 50,
        "mats": {
          "Fragmento Viral": 2,
          "Muestra de Lab.": 1,
          "Sello de Rastreador": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-virulox.webp"
    },
    {
      "id": "bacillus",
      "number": "02",
      "name": "Báculor Carmesí",
      "epithet": "La coraza de la ciénaga",
      "type": "Bestia acorazada",
      "zoneId": "pantano",
      "threat": 3,
      "lore": "Arrastra su fortaleza de placas por el barro. Donde se detiene, el pantano levanta nuevas espinas.",
      "habitat": "Las orillas de los pozos oxidados.",
      "weakness": "La juntura de su coraza al levantar las pinzas.",
      "traits": "Seis patas, pinzas de hierro y un caparazón de escarlata apagado.",
      "sessionCode": "GREMIO-PANTANO",
      "captureCode": "PARED-5",
      "reward": {
        "xp": 60,
        "mats": {
          "Placa de Cultivo": 2,
          "Coraza Bacteriana": 1,
          "Muestra de Lab.": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-bacillus.webp"
    },
    {
      "id": "micelombra",
      "number": "03",
      "name": "Micelombra",
      "epithet": "El susurro bajo la corteza",
      "type": "Horror del bosque",
      "zoneId": "pantano",
      "threat": 2,
      "lore": "No camina: el bosque cambia de lugar para dejarlo pasar. Sus filamentos cosen los árboles muertos a la niebla.",
      "habitat": "Troncos hundidos y claros sin sol.",
      "weakness": "El sello seco de los antiguos leñadores.",
      "traits": "Corona de hongos, brazos de raíz y ojos de luz fría.",
      "sessionCode": "GREMIO-PANTANO",
      "captureCode": "ESPORA-8",
      "reward": {
        "xp": 55,
        "mats": {
          "Espora Sellada": 2,
          "Filamento Fúngico": 1,
          "Muestra de Lab.": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-micelombra.webp"
    },
    {
      "id": "parasitrox",
      "number": "04",
      "name": "Parasitrox",
      "epithet": "El devorador del fondo",
      "type": "Sierpe abisal",
      "zoneId": "pantano",
      "threat": 3,
      "lore": "Su cuerpo dibuja círculos bajo el agua. Cada anillo anuncia la desaparición de otro farol.",
      "habitat": "Las fosas negras de la ciénaga.",
      "weakness": "El destello de una cadena recién forjada.",
      "traits": "Cuerpo anillado, mandíbula circular y aletas desgarradas.",
      "sessionCode": "GREMIO-PANTANO",
      "captureCode": "HUESPED-4",
      "reward": {
        "xp": 65,
        "mats": {
          "Garra Parasitaria": 1,
          "Toxina Neutralizada": 2,
          "Muestra de Lab.": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-parasitrox.webp"
    },
    {
      "id": "vacunara",
      "number": "05",
      "name": "Vaelunara",
      "epithet": "La guardiana de los faros",
      "type": "Centinela espectral",
      "zoneId": "pantano",
      "threat": 3,
      "lore": "Fue juramentada para proteger a los viajeros. Ya no distingue al peregrino del intruso.",
      "habitat": "El santuario sumergido.",
      "weakness": "Romper el reflejo de su escudo lunar.",
      "traits": "Cérvido de armadura blanca, astas lunares y manto de niebla.",
      "sessionCode": "GREMIO-PANTANO",
      "captureCode": "MEMORIA-12",
      "reward": {
        "xp": 70,
        "mats": {
          "Sello Inmune": 2,
          "Memoria Celular": 1,
          "Fragmento Viral": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-vacunara.webp"
    },
    {
      "id": "osmogarra",
      "number": "06",
      "name": "Osmogarra",
      "epithet": "La sombra entre las raíces",
      "type": "Acechador del bosque",
      "zoneId": "bosque",
      "threat": 3,
      "lore": "Su piel refleja las hojas hasta que abre los ojos. Deja tres surcos perfectos en cada puerta del campamento.",
      "habitat": "Las raíces huecas del bosque antiguo.",
      "weakness": "El barro delata las huellas que su piel oculta.",
      "traits": "Felino de seis extremidades, membranas oscuras y garras de jade.",
      "sessionCode": "GREMIO-CELULA",
      "captureCode": "BICAPA-9",
      "reward": {
        "xp": 70,
        "mats": {
          "Cristal de Bicapa": 2,
          "Proteína Canal": 1,
          "Núcleo de Equilibrio": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-osmogarra.webp"
    },
    {
      "id": "ribosomor",
      "number": "07",
      "name": "Ribósmor",
      "epithet": "El tejedor de huesos",
      "type": "Arácnido ancestral",
      "zoneId": "bosque",
      "threat": 2,
      "lore": "Reúne los restos de antiguas armaduras y teje con ellos nidos sobre las copas. El viento los hace sonar como campanas.",
      "habitat": "Las copas sobre el sendero abandonado.",
      "weakness": "Sus hilos se tensan antes del salto.",
      "traits": "Ocho patas de hueso, abdomen de cuero y agujas de cobre.",
      "sessionCode": "GREMIO-CELULA",
      "captureCode": "PROTEINA-6",
      "reward": {
        "xp": 55,
        "mats": {
          "Cadena Proteica": 2,
          "Engranaje Ribosomal": 1,
          "Muestra de Lab.": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-ribosomor.webp"
    },
    {
      "id": "lisombra",
      "number": "08",
      "name": "Lisombra",
      "epithet": "La boca sin eco",
      "type": "Depredador del sotobosque",
      "zoneId": "bosque",
      "threat": 2,
      "lore": "La escuchas antes de verla, porque el bosque deja de sonar. Una saliva luminosa cae de su mandíbula.",
      "habitat": "Las cavernas bajo los árboles caídos.",
      "weakness": "Su garganta queda expuesta después del rugido mudo.",
      "traits": "Anfibio ancho, garganta ámbar y piel de piedra húmeda.",
      "sessionCode": "GREMIO-CELULA",
      "captureCode": "ACIDO-11",
      "reward": {
        "xp": 55,
        "mats": {
          "Enzima Ácida": 2,
          "Vesícula Sellada": 1,
          "Núcleo de Equilibrio": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-lisombra.webp"
    },
    {
      "id": "nucleara",
      "number": "09",
      "name": "Núcleara",
      "epithet": "La soberana del árbol hueco",
      "type": "Matriarca del bosque",
      "zoneId": "bosque",
      "threat": 4,
      "lore": "Su corona no fue tallada: creció con los siglos. Protege un corazón de ámbar que aún recuerda la primera primavera.",
      "habitat": "La capilla del árbol hueco.",
      "weakness": "Los sellos de corteza que rodean su corazón.",
      "traits": "Figura de madera, cornamenta de ramas y núcleo de ámbar.",
      "sessionCode": "GREMIO-CELULA",
      "captureCode": "NUCLEO-21",
      "reward": {
        "xp": 85,
        "mats": {
          "Fragmento Nuclear": 2,
          "Sello de Control": 1,
          "Cadena de ADN": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-nucleara.webp"
    },
    {
      "id": "cromavorax",
      "number": "10",
      "name": "Cromavorax",
      "epithet": "El hambre de las mil formas",
      "type": "Sierpe de obsidiana",
      "zoneId": "crater",
      "threat": 4,
      "lore": "Muda las placas después de cada tormenta. Bajo cada escama aparece una forma que ningún cazador había visto.",
      "habitat": "Los taludes del cráter.",
      "weakness": "Las placas nuevas aún no resisten los sellos.",
      "traits": "Sierpe monumental de obsidiana y crestas retorcidas.",
      "sessionCode": "GREMIO-GEN",
      "captureCode": "HELIX-3",
      "reward": {
        "xp": 90,
        "mats": {
          "Fragmento de ADN": 2,
          "Cadena de ARN": 2,
          "Muestra de Lab.": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-cromavorax.webp"
    },
    {
      "id": "helicassa",
      "number": "11",
      "name": "Helicassa",
      "epithet": "La espiral del cielo roto",
      "type": "Mantícora de cristal",
      "zoneId": "crater",
      "threat": 4,
      "lore": "Dos colas giran en sentidos opuestos. Su silueta se duplica en cada fragmento de estrella que pisa.",
      "habitat": "Las agujas de cristal.",
      "weakness": "Las dos colas se cruzan antes de atacar.",
      "traits": "Cuerpo de mantícora, melena violeta y dos colas helicoidales.",
      "sessionCode": "GREMIO-GEN",
      "captureCode": "COPIA-18",
      "reward": {
        "xp": 90,
        "mats": {
          "Hélice Duplicada": 2,
          "Enzima Replicante": 1,
          "Fragmento de ADN": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-helicassa.webp"
    },
    {
      "id": "mutagenoalfa",
      "number": "12",
      "name": "Morfalfa",
      "epithet": "El que nunca es el mismo",
      "type": "Titán cambiante",
      "zoneId": "crater",
      "threat": 5,
      "lore": "Cada testigo dibuja una criatura distinta. Todos coinciden en una cosa: el ojo del pecho nunca parpadea.",
      "habitat": "El centro de la herida estelar.",
      "weakness": "El ojo central permanece aunque el cuerpo cambie.",
      "traits": "Gigante asimétrico, cuatro brazos desiguales y placas minerales.",
      "sessionCode": "GREMIO-GEN",
      "captureCode": "MUTA-404",
      "reward": {
        "xp": 110,
        "mats": {
          "Fragmento Mutante": 2,
          "Gen Alterado": 1,
          "Toxina Neutralizada": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-mutagenoalfa.webp"
    },
    {
      "id": "transcriptor",
      "number": "13",
      "name": "El Transcriptor",
      "epithet": "La voz de la piedra",
      "type": "Oráculo del cráter",
      "zoneId": "crater",
      "threat": 3,
      "lore": "Escribe sobre roca con plumas de cristal. Si lees en voz alta, las palabras empiezan a seguirte.",
      "habitat": "El observatorio roto.",
      "weakness": "Su escritura se interrumpe al cerrar el círculo de sal.",
      "traits": "Ave alta sin alas, máscara ósea y plumas de amatista.",
      "sessionCode": "GREMIO-GEN",
      "captureCode": "ARN-22",
      "reward": {
        "xp": 75,
        "mats": {
          "Cadena de ARN": 2,
          "Pluma Transcripta": 1,
          "Sello de Control": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-transcriptor.webp"
    },
    {
      "id": "mitocrix",
      "number": "14",
      "name": "Mitocrix",
      "epithet": "El corazón de la forja",
      "type": "Coloso de brasa",
      "zoneId": "forja",
      "threat": 4,
      "lore": "Cada golpe de sus cuatro brazos despierta otra grieta en la montaña. Lleva una fragua encendida donde debería estar el corazón.",
      "habitat": "La cámara de los antiguos martillos.",
      "weakness": "El núcleo se enfría al interrumpir sus fuelles.",
      "traits": "Basalto, cuatro brazos y un horno incandescente en el pecho.",
      "sessionCode": "GREMIO-ENERGIA",
      "captureCode": "ATP-42",
      "reward": {
        "xp": 85,
        "mats": {
          "Fragmento de ATP": 3,
          "Cristal Mitocondrial": 1,
          "Muestra de Lab.": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-mitocrix.webp"
    },
    {
      "id": "clorofang",
      "number": "15",
      "name": "Clorofang",
      "epithet": "La llama verde",
      "type": "Draco de ceniza",
      "zoneId": "forja",
      "threat": 3,
      "lore": "Brota entre el carbón como una primavera imposible. Su aliento ilumina las brasas con una llama verde.",
      "habitat": "Los jardines carbonizados de la forja.",
      "weakness": "Las espinas de sus alas guardan el calor del aliento.",
      "traits": "Draco esbelto de hojas calcinadas y espinas esmeralda.",
      "sessionCode": "GREMIO-ENERGIA",
      "captureCode": "LUZ-15",
      "reward": {
        "xp": 75,
        "mats": {
          "Núcleo Clorofílico": 2,
          "Hoja Lumínica": 1,
          "Catalizador Energético": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-clorofang.webp"
    },
    {
      "id": "glucolixrex",
      "number": "16",
      "name": "Glúcor Rex",
      "epithet": "El hambre de la montaña",
      "type": "Rey de escoria",
      "zoneId": "forja",
      "threat": 4,
      "lore": "Su rugido derriba las bóvedas vacías. Ha devorado tantas vetas que la montaña late dentro de su garganta.",
      "habitat": "Las minas bajo el puente de escoria.",
      "weakness": "Las fisuras de su mandíbula revelan la brasa interior.",
      "traits": "Depredador bípedo con mandíbula monumental y coraza volcánica.",
      "sessionCode": "GREMIO-ENERGIA",
      "captureCode": "GLUCO-10",
      "reward": {
        "xp": 85,
        "mats": {
          "Fragmento de Glucosa": 2,
          "Chispa Metabólica": 2,
          "Fragmento de ATP": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-glucolixrex.webp"
    },
    {
      "id": "termovolt",
      "number": "17",
      "name": "Termovolt",
      "epithet": "La tormenta encadenada",
      "type": "Quimera de fulgor",
      "zoneId": "forja",
      "threat": 4,
      "lore": "Cadenas fundidas cuelgan de sus cuernos. Cuando las arrastra, un relámpago enciende los hornos apagados.",
      "habitat": "Las torres de descarga de la forja.",
      "weakness": "Sus cadenas conducen el fulgor hasta el suelo.",
      "traits": "Carnero blindado con cuernos de cobre y espinas eléctricas.",
      "sessionCode": "GREMIO-ENERGIA",
      "captureCode": "VOLTA-30",
      "reward": {
        "xp": 85,
        "mats": {
          "Núcleo Voltaico": 2,
          "Placa Térmica": 1,
          "Catalizador Energético": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-termovolt.webp"
    },
    {
      "id": "hormonarca",
      "number": "18",
      "name": "Ormonarca",
      "epithet": "El soberano sin rostro",
      "type": "Revenant real",
      "zoneId": "ruinas",
      "threat": 4,
      "lore": "Todavía da órdenes desde un trono roto. Las armaduras vacías inclinan la cabeza cuando pasa.",
      "habitat": "El salón de la corona ausente.",
      "weakness": "El juramento grabado en su corona partida.",
      "traits": "Soberano alto de armadura hueca y manto carmesí desgarrado.",
      "sessionCode": "GREMIO-CUERPO",
      "captureCode": "ENDO-5",
      "reward": {
        "xp": 85,
        "mats": {
          "Sello Hormonal": 2,
          "Cristal Endocrino": 1,
          "Pulso Regulador": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-hormonarca.webp"
    },
    {
      "id": "gametrix",
      "number": "19",
      "name": "Gámetrix",
      "epithet": "Los gemelos del umbral",
      "type": "Guardián dual",
      "zoneId": "ruinas",
      "threat": 3,
      "lore": "Dos rostros comparten una sola sombra. Uno anuncia la llegada; el otro impide la partida.",
      "habitat": "Las puertas del patio de los juramentos.",
      "weakness": "Los dos rostros deben mirar al mismo sello.",
      "traits": "Guardián cuadrúpedo de dos máscaras, hierro y marfil.",
      "sessionCode": "GREMIO-CUERPO",
      "captureCode": "GAMETO-2",
      "reward": {
        "xp": 70,
        "mats": {
          "Núcleo Gamético": 2,
          "Sello de Unión": 1,
          "Pulso Regulador": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-gametrix.webp"
    },
    {
      "id": "embryonox",
      "number": "20",
      "name": "Embryonox",
      "epithet": "El sueño de la campana",
      "type": "Engendro de ámbar",
      "zoneId": "ruinas",
      "threat": 4,
      "lore": "Bajo las ruinas duerme en un capullo de resina negra. Cada campanada abre otra grieta en su prisión.",
      "habitat": "La cripta de la campana enterrada.",
      "weakness": "La resina se agrieta cuando cesan las campanas.",
      "traits": "Criatura alada plegada, armadura de ámbar y extremidades largas.",
      "sessionCode": "GREMIO-CUERPO",
      "captureCode": "ETAPA-9",
      "reward": {
        "xp": 90,
        "mats": {
          "Capa Embrionaria": 2,
          "Latido Inicial": 1,
          "Núcleo Gamético": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-embryonox.webp"
    },
    {
      "id": "puberox",
      "number": "21",
      "name": "Púberox",
      "epithet": "El caballero del eclipse",
      "type": "Licántropo juramentado",
      "zoneId": "ruinas",
      "threat": 3,
      "lore": "Su armadura se abre como una jaula cuando oscurece. Sigue montando guardia por un rey cuyo nombre olvidó.",
      "habitat": "Los tejados y la muralla del rey.",
      "weakness": "El antiguo emblema del Gremio detiene su carga.",
      "traits": "Lobo bípedo enorme con armadura rota y ojos de plata.",
      "sessionCode": "GREMIO-CUERPO",
      "captureCode": "CAMBIO-13",
      "reward": {
        "xp": 75,
        "mats": {
          "Marca de Cambio": 2,
          "Sello Hormonal": 1,
          "Pulso Regulador": 1
        }
      },
      "requires": [],
      "image": "assets/art/beast-puberox.webp"
    },
    {
      "id": "quimerax",
      "number": "22",
      "name": "Quimerax",
      "epithet": "El origen de la última noche",
      "type": "Anomalía ancestral",
      "zoneId": "dominio",
      "threat": 5,
      "lore": "Antes del primer refugio, ya esperaba. Bosque, piedra y brasa se reúnen en su cuerpo. Su despertar convertiría todos los territorios en un único dominio.",
      "habitat": "El altar de los seis sellos.",
      "weakness": "Los seis juramentos reunidos por un mismo cazador.",
      "traits": "Alas inmensas, corona de obsidiana y corazón de oro pálido.",
      "sessionCode": "GREMIO-BOSS",
      "captureCode": "QUIMERAX-FINAL",
      "reward": {
        "xp": 180,
        "mats": {
          "Escama de Quimerax": 1,
          "Esencia Combinada": 2,
          "Insignia Legendaria": 1
        }
      },
      "requires": [
        "virulox",
        "bacillus",
        "osmogarra",
        "cromavorax",
        "mitocrix",
        "hormonarca"
      ],
      "image": "assets/art/beast-quimerax.webp"
    }
  ],
  "materials": {
    "Fragmento Viral": "Fragmento del Velo",
    "Muestra de Lab.": "Esencia de bruma",
    "Placa de Cultivo": "Placa carmesí",
    "Coraza Bacteriana": "Coraza del pantano",
    "Filamento Fúngico": "Hilo del bosque",
    "Garra Parasitaria": "Garra abisal",
    "Toxina Neutralizada": "Veneno sellado",
    "Sello Inmune": "Sello de la guardiana",
    "Memoria Celular": "Eco antiguo",
    "Cristal de Bicapa": "Cristal de rocío",
    "Proteína Canal": "Anillo de raíz",
    "Núcleo de Equilibrio": "Núcleo del umbral",
    "Cadena Proteica": "Cadena de hueso",
    "Engranaje Ribosomal": "Engranaje antiguo",
    "Enzima Ácida": "Resina cáustica",
    "Vesícula Sellada": "Ampolla sellada",
    "Fragmento Nuclear": "Ámbar del corazón",
    "Sello de Control": "Sello de la soberana",
    "Cadena de ADN": "Cadena estelar",
    "Fragmento de ADN": "Fragmento estelar",
    "Cadena de ARN": "Pergamino del oráculo",
    "Hélice Duplicada": "Espiral gemela",
    "Enzima Replicante": "Cristal de espejos",
    "Fragmento Mutante": "Fragmento cambiante",
    "Gen Alterado": "Piedra de mil formas",
    "Pluma Transcripta": "Pluma de amatista",
    "Fragmento de ATP": "Ascua eterna",
    "Cristal Mitocondrial": "Cristal de la fragua",
    "Núcleo Clorofílico": "Núcleo esmeralda",
    "Hoja Lumínica": "Hoja de fulgor",
    "Catalizador Energético": "Piedra de ignición",
    "Fragmento de Glucosa": "Fragmento de escoria",
    "Chispa Metabólica": "Chispa cautiva",
    "Núcleo Voltaico": "Núcleo de tormenta",
    "Placa Térmica": "Placa de cobre",
    "Sello Hormonal": "Sello del soberano",
    "Cristal Endocrino": "Cristal de la corona",
    "Pulso Regulador": "Eco del juramento",
    "Núcleo Gamético": "Núcleo de los gemelos",
    "Sello de Unión": "Sello del umbral",
    "Capa Embrionaria": "Manto de ámbar",
    "Latido Inicial": "Latido de la cripta",
    "Marca de Cambio": "Marca del eclipse"
  },
  "classes": [
    {
      "id": "rastreador",
      "name": "Rastreador del Velo",
      "motto": "Ningún rastro se pierde para siempre.",
      "desc": "Lees las huellas donde otros solo ven niebla. Tu juramento es encontrar un camino de regreso.",
      "legacy": "Rastreador de Evidencias",
      "icon": "compass"
    },
    {
      "id": "alquimista",
      "name": "Alquimista de Ceniza",
      "motto": "Hasta la brasa más pequeña guarda un secreto.",
      "desc": "Conservas esencias y fragmentos. Cada trofeo es una historia que todavía no ha sido contada.",
      "legacy": "Analista de Laboratorio",
      "icon": "flask"
    },
    {
      "id": "guardian",
      "name": "Guardián del Umbral",
      "motto": "Mientras resista el sello, resistiremos.",
      "desc": "Custodias los juramentos del Gremio. Donde el resto retrocede, tú sostienes el umbral.",
      "legacy": "Guardia de Contención",
      "icon": "shield"
    },
    {
      "id": "cartografo",
      "name": "Cartógrafo de lo Oculto",
      "motto": "Lo desconocido también tiene fronteras.",
      "desc": "Dibujas rutas entre refugios y ruinas. Tu mapa guarda lo que el mundo quiso olvidar.",
      "legacy": "Cartógrafo de Anomalías",
      "icon": "map"
    }
  ]
};
