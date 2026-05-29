import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Copy,
  Shield,
  Car,
  FileText,
  Calculator,
  RotateCcw,
  Star,
  Zap,
  Wand2,
  Printer,
} from "lucide-react";

const TIPOS_DOCUMENTO = ["Auto de Contraordenação", "Ocorrência", "Notícia", "Detenção"];

const MOLDES_RAPIDOS = [
  { nome: "Fuga policial", descricao: "Fuga após ordem de paragem, possível condução perigosa e infrações associadas.", codigos: ["Penal-103", "Penal-110", "Estrada-4", "Estrada-18"], agravantes: "Fuga às autoridades; perigo para terceiros; desrespeito por ordem legítima de paragem." },
  { nome: "Sem carta / categoria", descricao: "Condução sem habilitação legal ou sem categoria específica.", codigos: ["Penal-111", "Estrada-33A"], agravantes: "Condução sem habilitação válida para o veículo em causa." },
  { nome: "Contramão", descricao: "Circulação em sentido contrário com perigo.", codigos: ["Estrada-13", "Estrada-16", "Penal-110"], agravantes: "Circulação em contramão; perigo concreto para terceiros; condução manifestamente perigosa." },
  { nome: "Acidente com fuga", descricao: "Acidente, abandono do local e eventual omissão de auxílio.", codigos: ["Penal-113", "Penal-114", "Penal-78"], agravantes: "Abandono do local do acidente; danos materiais e/ou feridos; ausência de prestação de auxílio." },
  { nome: "Roubo armado", descricao: "Roubo com arma e agravantes.", codigos: ["Penal-90", "Penal-120", "Penal-116", "Penal-117"], agravantes: "Uso de arma; ameaça ou violência; atuação com especial perigosidade." },
  { nome: "Droga / tráfico", descricao: "Posse, tráfico ou produção de substâncias ilícitas.", codigos: ["Penal-124", "Penal-125", "Penal-126", "Penal-128"], agravantes: "Indícios de posse/tráfico de substâncias ilícitas; quantidade e contexto a apurar." },
  { nome: "Armas", descricao: "Posse, porte, uso ou tráfico de armas.", codigos: ["Penal-116", "Penal-117", "Penal-118", "Penal-119", "Penal-121"], agravantes: "Posse/porte de arma; risco para a segurança pública; utilização ou suspeita de utilização em crime." },
];

const RELACIONADOS = {
  "Penal-103": ["Penal-110", "Estrada-4", "Estrada-18"],
  "Penal-110": ["Estrada-13", "Estrada-16", "Estrada-18", "Penal-114"],
  "Penal-111": ["Estrada-33A", "Estrada-33"],
  "Penal-113": ["Penal-114", "Penal-78"],
  "Penal-116": ["Penal-120", "Penal-117", "Penal-118"],
  "Penal-117": ["Penal-120", "Penal-119"],
  "Penal-124": ["Penal-125", "Penal-126"],
  "Penal-126": ["Penal-127", "Penal-128"],
  "Estrada-13": ["Penal-110", "Estrada-16", "Estrada-18"],
  "Estrada-18": ["Penal-110", "Estrada-16"],
  "Estrada-4": ["Penal-103", "Penal-101"],
};

const ESTRADA_ARTIGOS = [
  ["1", "Definições Legais"], ["2", "Âmbito de Aplicação"], ["3", "Liberdade de Trânsito", 600, 1500], ["4", "Ordens das Autoridades", 1000, 2500],
  ["5", "Sinalização Rodoviária", 900, 1200], ["6", "Sinais de Trânsito", 1500, 2000], ["7", "Hierarquia das Prescrições", 800, 800],
  ["8", "Suspensão ou Condicionamento do Trânsito", 1000, 1500], ["9", "Zonas de Acesso Restrito", 1200, 2000], ["10", "Circulação de Veículos Prioritários", 1500, 2500],
  ["11", "Obras, Obstáculos e Perigos na Via", 1500, 2500], ["12", "Utilização Especial da Via Pública", 2000, 3000], ["13", "Sentido de Circulação", 2000, 3500],
  ["14", "Utilização da Faixa de Rodagem", 800, 1500], ["15", "Distância de Segurança", 1200, 1200], ["16", "Manobras e Circulação Proibida", 1000, 5000],
  ["17", "Limites de Velocidade"], ["18", "Excesso de Velocidade", 500, 8000], ["19", "Regra Geral de Prioridade", 1500, 1500], ["20", "Rotundas", 1500, 1500],
  ["21", "Cedência de Passagem", 1500, 2000], ["22", "Cruzamentos", 2000, 2000], ["23", "Ultrapassagens", 2500, 3000], ["24", "Utilização Obrigatória de Luzes", 800, 1200],
  ["25", "Paragem e Estacionamento", 800, 1500], ["26", "Proteção de Peões", 1500, 1500], ["27", "Circulação de Ciclistas", 800, 800],
  ["28", "Condução sob Influência de Álcool ou Drogas", 2000, 6000], ["28A", "Condução sob Influência em Grau Criminal"], ["29", "Utilização de Dispositivos Eletrónicos", 1000, 2500],
  ["30", "Condução Negligente", 1500, 3500], ["31", "Transporte de Passageiros", 1000, 3000], ["32", "Uso de Equipamentos de Segurança", 800, 1500],
  ["33", "Documentação do Veículo", 1000, 2500], ["33A", "Habilitação Específica por Categoria", 2500, 4000], ["34", "Estado do Veículo", 1500, 5000],
  ["34A", "Equipamento Obrigatório do Veículo", 500, 1000], ["34B", "Transporte de Mercadorias", 1500, 4000], ["35", "Alterações Ilegais ao Veículo", 2000, 6000],
  ["36", "Matrículas", 1000, 2000], ["37", "Veículo Abandonado na Via Pública", 1000, 4000], ["38", "Apreensão de Veículo"], ["39", "Apreensão de Carta de Condução"],
  ["40", "Proibição Temporária de Conduzir"], ["41", "Reincidência"], ["42", "Competência das Autoridades"], ["43", "Disposição Final"],
];

const PENAL_ARTIGOS = [
  ["1", "Princípio da Legalidade"], ["2", "Aplicação da Lei"], ["3", "Igualdade perante a Lei"], ["4", "Responsabilidade Individual"], ["5", "Proporcionalidade"], ["6", "Presunção de Inocência"], ["7", "Boa-Fé e Interpretação"], ["8", "Classificação dos Crimes"],
  ["9", "Noção de Crime"], ["10", "Classificação dos Crimes quanto ao Procedimento"], ["11", "Crime Público"], ["12", "Crime Semipúblico"], ["13", "Crime Particular"], ["14", "Prazo de Tramitação da Queixa e Julgamento"], ["15", "Pessoa"], ["16", "Agente"], ["17", "Vítima"], ["18", "Bem Jurídico"], ["19", "Propriedade Privada"], ["20", "Propriedade Pública"], ["21", "Relevância da Natureza da Propriedade"], ["22", "Posse"], ["23", "Propriedade"], ["24", "Intenção"], ["25", "Negligência"], ["26", "Autoridade Pública"], ["27", "Ordem Pública"],
  ["28", "Responsabilidade Criminal"], ["29", "Responsabilidade Individual"], ["30", "Autoria"], ["31", "Comparticipação"], ["32", "Instigação"], ["33", "Tentativa"], ["34", "Punição da Tentativa"], ["35", "Desistência Voluntária"], ["36", "Concurso de Crimes"], ["37", "Concurso de Pessoas"], ["38", "Qualificação do Crime"], ["39", "Circunstâncias Agravantes"], ["40", "Circunstâncias Atenuantes"], ["41", "Reincidência"], ["42", "Culpabilidade"],
  ["43", "Legítima Defesa"], ["44", "Requisitos da Legítima Defesa"], ["45", "Excesso de Legítima Defesa"], ["46", "Estado de Necessidade"], ["47", "Requisitos do Estado de Necessidade"], ["48", "Consentimento do Ofendido"], ["49", "Cumprimento do Dever"], ["50", "Exercício Legítimo de Direito"], ["51", "Erro Não Culpável"], ["52", "Inimputabilidade"],
  ["53", "Princípios da Atuação Policial"], ["54", "Legitimidade da Intervenção"], ["55", "Detenção"], ["56", "Detenção em Flagrante Delito"], ["57", "Detenção Fora de Flagrante Delito"], ["58", "Direitos do Detido"], ["59", "Uso da Força"], ["60", "Revista Pessoal"], ["61", "Busca a Veículos"], ["62", "Busca a Propriedades"], ["63", "Exceções à Necessidade de Mandado"], ["64", "Apreensão"], ["65", "Flagrante Delito"], ["66", "Limites da Atuação Policial"], ["67", "Responsabilidade por Atuação Ilegal"],
  ["68", "Homicídio", 20000, 30000, 25, 30], ["69", "Homicídio Qualificado", 27000, 40000, 30, 30], ["70", "Homicídio Privilegiado", 26000, 32000, 21, 25], ["71", "Homicídio a Pedido da Vítima", 11000, 16000, 11, 16], ["72", "Homicídio por Negligência", 7000, 15000, 11, 15], ["73", "Ofensa à Integridade Física", 1000, 6000, 1, 3], ["74", "Ofensa à Integridade Física Grave", 4000, 8000, 4, 10], ["75", "Sequestro", 11000, 20000, 10, 18], ["76", "Tomada de Reféns", 15000, 25000, 15, 20], ["77", "Participação em Rixa", 1500, 6000, 1, 5], ["78", "Omissão de Auxílio", 10000, 14000, 2, 12], ["78A", "Recusa de Auxílio por Profissionais de Emergência", 5000, 20000, 3, 12], ["79", "Ameaça", 1000, 8000, 2, 5], ["80", "Coação", 1000, 8000, 2, 5], ["81", "Perseguição", 1000, 8000, 2, 5], ["82", "Violência Doméstica", 10000, 22000, 10, 18],
  ["83", "Injúria", 1000, 4000, 1, 2], ["84", "Difamação", 2000, 6000, 1, 3], ["85", "Divulgação de Conteúdo Ofensivo", 1500, 7000, 1, 4], ["86", "Falsa Imputação às Autoridades", 2000, 10000, 2, 5],
  ["87", "Furto", 2000, 8000, 1, 3], ["88", "Furto Qualificado", 5000, 12000, 3, 8], ["89", "Roubo", 9000, 22000, 10, 18], ["90", "Roubo Qualificado", 15000, 30000, 15, 25], ["91", "Extorsão", 8000, 20000, 8, 15], ["92", "Burla", 3000, 10000, 2, 6], ["93", "Burla Qualificada", 8000, 18000, 5, 12], ["94", "Abuso de Confiança", 3000, 10000, 2, 6], ["95", "Dano", 2000, 8000, 1, 4], ["96", "Dano Qualificado", 5000, 15000, 3, 8], ["97", "Invasão de Propriedade", 1000, 5000, 1, 2], ["98", "Apropriação Ilegítima", 1500, 6000, 1, 3], ["99", "Fogo Posto", 10000, 25000, 10, 20], ["100", "Invasão de Local Vedado ao Público", 2000, 8000, 2, 5],
  ["101", "Desobediência", 1000, 5000, 1, 3], ["102", "Resistência e Coação sobre Funcionário", 2000, 8000, 2, 6], ["103", "Fuga à Autoridade", 3000, 10000, 3, 8], ["104", "Desacato", 500, 4000, 1, 2], ["105", "Usurpação de Funções", 2000, 8000, 2, 6], ["106", "Denúncia Falsa", 2000, 10000, 2, 5], ["107", "Corrupção e Suborno", 10000, 25000, 5, 12], ["108", "Abuso de Poder", 8000, 20000, 4, 10], ["109", "Obstrução à Justiça", 3000, 12000, 3, 8],
  ["110", "Condução Perigosa", 2000, 8000, 2, 6], ["111", "Condução sem Habilitação Legal", 1000, 6000, 1, 3], ["112", "Condução sob Influência de Álcool ou Drogas", 2000, 8000, 2, 5], ["113", "Fuga após Acidente", 3000, 12000, 3, 8], ["114", "Condução Negligente com Resultado", 2000, 20000, 1, 15], ["115", "Utilização Indevida de Veículo", 2000, 8000, 1, 3],
  ["116", "Posse de Arma Branca Proibida", 1000, 5000, 1, 3], ["117", "Posse de Arma de Fogo Proibida", 3000, 10000, 3, 8], ["118", "Porte de Arma sem Licença", 2000, 8000, 2, 5], ["119", "Uso Indevido de Arma", 3000, 10000, 3, 8], ["120", "Uso de Arma em Crime"], ["121", "Tráfico de Armas de Fogo", 10000, 25000, 8, 15], ["122", "Tráfico de Armas Brancas Proibidas", 2000, 8000, 2, 6], ["123", "Modificação Ilegal de Arma de Fogo", 5000, 15000, 4, 10],
  ["124", "Posse de Substâncias Ilícitas para Consumo Próprio", 1000, 5000, 1, 3], ["125", "Posse de Substâncias Ilícitas", 5000, 15000, 4, 8], ["126", "Tráfico de Estupefacientes", 10000, 25000, 8, 15], ["127", "Tráfico Agravado", 15000, 30000, 12, 20], ["128", "Produção de Substâncias Ilícitas", 8000, 20000, 6, 12], ["129", "Facilitação de Consumo", 3000, 10000, 3, 6],
  ["130", "Caça Ilegal", 2000, 8000, 1, 3], ["131", "Pesca Ilegal", 2000, 8000, 1, 3], ["132", "Captura de Espécies Protegidas", 4000, 12000, 2, 6],
  ["133", "Falta de Identificação", 1000, 5000, 1, 2], ["134", "Falsificação de Documentos", 3000, 10000, 2, 6], ["135", "Uso de Documento Falso", 2000, 8000, 2, 5], ["136", "Associação Criminosa", 8000, 20000, 5, 12], ["137", "Branqueamento de Capitais", 10000, 25000, 5, 12], ["138", "Perturbação Grave da Ordem Pública", 2000, 10000, 2, 6], ["139", "Encobrimento", 2000, 10000, 2, 6], ["140", "Chamada Falsa às Autoridades", 1000, 6000, 1, 3], ["141", "Receptação", 2000, 10000, 2, 6], ["142", "Falso Testemunho (Perjúrio)", 2000, 10000, 2, 6], ["143", "Prevaricação", 3000, 12000, 3, 8], ["144", "Quebra de Sigilo", 2000, 8000, 2, 5], ["145", "Fraude", 2000, 10000, 2, 6], ["146", "Evasão Fiscal", 5000, 15000, 3, 8], ["147", "Ocultação de Identidade em Espaço Público", 500, 3000, 0, 1], ["148", "Posse de Equipamento Tático Suspeito", 1000, 6000, 1, 3], ["149", "Violação de Espaço Aéreo", 2000, 10000, 2, 6],
  ["150", "Prazo para Marcação de Audiência"], ["151", "Representação em Tribunal"], ["152", "Dever de Comparência"], ["153", "Prevenção de Abusos Processuais"], ["154", "Julgamento à Revelia"], ["155", "Mandado de Captura para Comparência"], ["156", "Tramitação do Processo"], ["157", "Aplicação de Sanção pela Autoridade Policial"], ["158", "Remessa do Processo ao Tribunal"], ["159", "Direito de Recurso"], ["160", "Incumprimento de Pagamento de Coimas e Sanções"],
];

function normalize(text) {
  return String(text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function inferCategoria(tipo, nome) {
  const s = normalize(nome);
  if (tipo === "Estrada") {
    if (s.includes("autoridade") || s.includes("emergencia")) return "Autoridade";
    if (s.includes("veiculo") || s.includes("matricula") || s.includes("documentacao")) return "Veículo/Via";
    if (s.includes("alcool") || s.includes("conducao") || s.includes("habilitacao") || s.includes("carta")) return "Documentação/Condução";
    return "Trânsito";
  }
  if (s.includes("arma")) return "Armas";
  if (s.includes("substancias") || s.includes("estupefacientes") || s.includes("consumo")) return "Droga";
  if (s.includes("homicidio") || s.includes("ofensa") || s.includes("ameaca") || s.includes("sequestro") || s.includes("refens") || s.includes("rixa") || s.includes("violencia")) return "Crimes violentos";
  if (s.includes("furto") || s.includes("roubo") || s.includes("dano") || s.includes("burla") || s.includes("patrimonio") || s.includes("extorsao")) return "Património";
  if (s.includes("corrupcao") || s.includes("fraude") || s.includes("fiscal") || s.includes("branqueamento")) return "Crimes económicos";
  if (s.includes("autoridade") || s.includes("desobediencia") || s.includes("resistencia") || s.includes("desacato") || s.includes("justica") || s.includes("identificacao")) return "Autoridade";
  if (s.includes("conducao") || s.includes("veiculo") || s.includes("acidente") || s.includes("espaco aereo")) return "Trânsito";
  if (s.includes("tribunal") || s.includes("processo") || s.includes("audiencia") || s.includes("recurso")) return "Processual/Tribunal";
  return "Geral";
}

const DESCRICOES_ESTRADA = {
  "1": "Define os principais conceitos usados no Código da Estrada, incluindo via pública, faixa de rodagem, berma, passeio, autoestrada, rotunda, veículo pesado e utilizadores vulneráveis.",
  "2": "Estabelece que o Código da Estrada se aplica a todas as vias públicas, vias privadas abertas ao público, parques, urbanizações e acessos livres.",
  "3": "Garante a liberdade de trânsito, proibindo a obstrução da via, criação de perigo ou qualquer conduta que dificulte a circulação normal.",
  "4": "Determina que todos os utilizadores da via devem obedecer às ordens legítimas dos agentes da autoridade, prevalecendo essas ordens sobre qualquer sinalização existente.",
  "5": "Regula a sinalização rodoviária e obriga à correta sinalização de obstáculos ou perigos criados na via.",
  "6": "Define que apenas entidades autorizadas podem instalar, alterar ou remover sinais de trânsito, punindo instalação ilegal ou danificação de sinalização.",
  "7": "Estabelece a hierarquia das prescrições rodoviárias: autoridade, sinalização temporária, sinais luminosos, sinais verticais e marcas rodoviárias.",
  "8": "Permite a suspensão ou condicionamento temporário do trânsito por obras, acidentes, emergências, eventos autorizados ou ordem das autoridades.",
  "9": "Proíbe a circulação em zonas sinalizadas como acesso restrito, trânsito condicionado ou reservadas a veículos autorizados.",
  "10": "Obriga os condutores a ceder passagem e facilitar a circulação de veículos prioritários em missão urgente, como polícia, emergência médica e socorro.",
  "11": "Regula obras, obstáculos e perigos na via, exigindo sinalização adequada sempre que exista risco para os utentes.",
  "12": "Determina que eventos, competições ou atividades que ocupem a via pública dependem de autorização das autoridades competentes.",
  "13": "Obriga os veículos a circular pelo lado correto da via e proíbe a circulação em sentido contrário ou contramão.",
  "14": "Impõe ao condutor o dever de utilizar corretamente a faixa de rodagem e evitar mudanças de via desnecessárias ou perigosas.",
  "15": "Obriga o condutor a manter distância suficiente do veículo da frente para evitar colisões.",
  "16": "Proíbe manobras perigosas ou contrárias às regras de circulação, incluindo traço contínuo, marcha-atrás perigosa, inversão proibida, cavalinhos, drift e burnout em via pública.",
  "17": "Define os limites gerais de velocidade, incluindo 50 km/h em zona urbana e 120 km/h em autoestrada quando não exista sinalização diferente.",
  "18": "Classifica o excesso de velocidade como leve, grave ou muito grave, podendo ter enquadramento criminal quando exista perigo concreto, fuga ou acidente.",
  "19": "Define a regra geral de prioridade, obrigando à cedência de passagem aos veículos provenientes da direita quando não exista sinalização em contrário.",
  "20": "Regula a circulação em rotundas, determinando que os veículos que já circulam na rotunda têm prioridade.",
  "21": "Obriga à cedência de passagem sempre que exista sinalização, entrada em via com prioridade, saída de estacionamento ou propriedade privada.",
  "22": "Obriga o condutor a reduzir velocidade e garantir segurança ao atravessar cruzamentos.",
  "23": "Regula ultrapassagens, proibindo ultrapassar sem segurança, visibilidade ou em locais perigosos/proibidos.",
  "24": "Obriga à utilização de luzes adequadas durante a noite, túneis, chuva intensa, nevoeiro ou outras situações de visibilidade reduzida.",
  "25": "Proíbe paragem ou estacionamento que impeça circulação, crie perigo, bloqueie acessos, passadeiras, cruzamentos ou locais reservados.",
  "26": "Obriga os condutores a proteger peões e ceder passagem em passadeiras ou zonas de atravessamento.",
  "27": "Regula a circulação de ciclistas e obriga os condutores a manter distância de segurança ao ultrapassá-los.",
  "28": "Proíbe a condução sob influência de álcool ou substâncias psicotrópicas, distinguindo infrações leves e graves pela taxa de álcool.",
  "28A": "Define as situações em que a condução sob influência passa a grau criminal, incluindo TAS superior a 1,2 g/L, recusa ao teste ou perigo para terceiros.",
  "29": "Proíbe a utilização de telemóveis ou outros dispositivos eletrónicos durante a condução.",
  "30": "Pune a condução negligente, ou seja, conduta imprudente que coloque em risco a segurança, mesmo sem dano direto.",
  "31": "Responsabiliza o condutor pela segurança dos passageiros e proíbe transporte em condições perigosas.",
  "32": "Obriga ao uso de equipamentos de segurança, como cinto de segurança e capacete quando aplicável.",
  "33": "Obriga o condutor a possuir e apresentar documentação válida do veículo quando solicitada pela autoridade.",
  "33A": "Exige habilitação específica para a categoria de veículo conduzido, incluindo motociclos, pesados, embarcações e aeronaves.",
  "34": "Exige que o veículo esteja em condições mínimas de segurança, punindo danos graves visíveis, pneus/rodas deficientes ou perigo evidente.",
  "34A": "Obriga o veículo a possuir equipamento mínimo de segurança, incluindo triângulo de sinalização e respetiva utilização em caso de imobilização.",
  "34B": "Regula o transporte comercial/profissional de mercadorias, exigindo guia de transporte válida com identificação, descrição, quantidade e data/hora.",
  "35": "Proíbe alterações ilegais ao veículo, como motor exposto, vidros demasiado escuros, néon não autorizado ou modificações que dificultem identificação.",
  "36": "Obriga todos os veículos a possuir matrícula válida, visível e legível, punindo falta de matrícula, matrícula ilegível ou danificada.",
  "37": "Regula veículos abandonados na via pública, permitindo remoção quando obstruam circulação, estejam degradados ou criem risco.",
  "38": "Define as situações excecionais em que um veículo pode ser apreendido, nomeadamente alterações ilegais graves ou associação à prática de crime.",
  "39": "Regula a apreensão da carta de condução em caso de múltiplas infrações graves, infrações muito graves reiteradas ou crimes no exercício da condução.",
  "40": "Permite a proibição temporária de conduzir consoante a gravidade da infração, reincidência ou prática de crime na condução.",
  "41": "Define reincidência como repetição de infrações da mesma natureza, podendo implicar agravamento da coima, apreensão da carta ou medidas adicionais.",
  "42": "Estabelece a competência das autoridades para fiscalizar, autuar e aplicar as medidas previstas no Código da Estrada.",
  "43": "Disposição final que reforça a obrigatoriedade do cumprimento do Código da Estrada e a aplicação dos princípios da legalidade, proporcionalidade e bom senso."
};

const DESCRICOES_PENAL = {
  "68": "Quem, de forma voluntária e intencional, tirar a vida a outra pessoa.",
  "69": "Homicídio praticado com especial gravidade, incluindo premeditação, especial crueldade, motivo fútil, meio perigoso, vítima vulnerável ou motivo de ódio.",
  "70": "Homicídio praticado sob forte emoção, provocação ou motivo relevante que diminua a culpa do agente.",
  "71": "Morte causada a pedido sério e consciente da vítima.",
  "72": "Morte causada por negligência, imprudência ou violação do dever de cuidado.",
  "73": "Agressão ou ofensa física sem lesão grave.",
  "74": "Agressão que cause lesões significativas, sequelas ou dano físico grave.",
  "75": "Privação intencional da liberdade de uma pessoa sem consentimento.",
  "76": "Captura ou retenção de pessoa para forçar terceiros a agir, omitir ou aceitar determinada condição.",
  "77": "Participação em confronto físico coletivo ou rixa.",
  "78": "Não prestação de ajuda a pessoa em situação de perigo grave quando era possível fazê-lo.",
  "78A": "Recusa ou omissão de auxílio por profissional de saúde, socorro ou emergência com dever e capacidade de intervir.",
  "79": "Intimidar outra pessoa causando medo ou receio pela sua integridade física, vida ou bens.",
  "80": "Forçar alguém, através de violência ou ameaça, a agir contra a sua vontade.",
  "81": "Assediar, vigiar ou perseguir repetidamente outra pessoa, causando receio ou perturbação.",
  "82": "Agressão, controlo, intimidação ou maus-tratos em contexto familiar ou relação semelhante.",
  "83": "Ofender a honra ou consideração de outra pessoa por palavras, gestos ou expressão direta.",
  "84": "Imputar a terceiros factos ou juízos ofensivos da honra ou reputação de outra pessoa.",
  "85": "Divulgar, partilhar ou tornar acessível conteúdo ofensivo, humilhante ou lesivo da dignidade de outra pessoa.",
  "86": "Comunicar ou denunciar às autoridades factos falsos com intenção de prejudicar outra pessoa.",
  "87": "Subtrair coisa móvel pertencente a outra pessoa sem violência ou ameaça.",
  "88": "Furto agravado por circunstâncias como atuação em grupo, bens de elevado valor, propriedade privada restrita, vulnerabilidade da vítima ou furto de veículo.",
  "89": "Subtrair bens recorrendo a violência ou ameaça contra a vítima.",
  "90": "Roubo agravado por uso de arma, atuação em grupo, lesão grave ou ocorrência contra estabelecimento ou entidade pública.",
  "91": "Constranger outra pessoa, por ameaça ou violência, a entregar bens ou valores.",
  "92": "Enganar alguém com intenção de obter vantagem ilegítima e causar prejuízo patrimonial.",
  "93": "Burla agravada por valores elevados, prática organizada/reiterada ou abuso de confiança/funções.",
  "94": "Apropriar-se de bens que foram confiados ao agente.",
  "95": "Destruir, danificar ou inutilizar coisa alheia.",
  "96": "Dano agravado por afetar bens públicos, causar prejuízo elevado ou comprometer serviços essenciais.",
  "97": "Entrar ou permanecer em propriedade privada sem autorização.",
  "98": "Apropriar-se de bem perdido, esquecido ou obtido por erro, sabendo que não lhe pertence.",
  "99": "Provocar incêndio em edifício, veículo, floresta ou qualquer bem, colocando pessoas ou bens em perigo.",
  "100": "Entrar ou permanecer em local público de acesso restrito ou vedado sem autorização.",
  "101": "Não cumprir ordem legítima emanada por autoridade pública no exercício das suas funções.",
  "102": "Empregar violência ou ameaça para impedir ou constranger autoridade pública no exercício das suas funções.",
  "103": "Fugir ou tentar evitar a ação das autoridades após ordem de paragem ou detenção.",
  "104": "Insultar, ofender gravemente ou adotar comportamento manifestamente desrespeitoso perante autoridade pública em funções.",
  "105": "Fazer-se passar por autoridade pública ou exercer funções sem legitimidade.",
  "106": "Denunciar às autoridades crime que sabe não ter ocorrido.",
  "107": "Oferecer, prometer ou aceitar vantagem indevida para obter benefício ou favorecer terceiros.",
  "108": "Autoridade pública que utiliza a sua posição para obter benefício próprio ou prejudicar terceiros.",
  "109": "Dificultar investigação, destruir provas ou impedir a atuação da justiça.",
  "110": "Conduzir de forma manifestamente perigosa, criando perigo concreto para a vida, integridade física de terceiros ou bens.",
  "111": "Conduzir ou operar veículo sem habilitação legal válida para o tipo de veículo em causa.",
  "112": "Conduzir sob efeito de álcool ou substâncias que comprometam a capacidade de condução.",
  "113": "Abandonar o local de acidente sem prestar auxílio, identificar-se ou aguardar a chegada das autoridades.",
  "114": "Provocar dano material relevante, lesão ou morte por negligência na condução.",
  "115": "Utilizar veículo sem autorização do proprietário, sem intenção de apropriação definitiva.",
  "116": "Possuir, transportar ou deter arma branca proibida ou em circunstâncias injustificadas.",
  "117": "Possuir, transportar ou deter arma de fogo sem autorização legal.",
  "118": "Transportar arma legal sem possuir licença válida.",
  "119": "Utilizar arma de forma perigosa ou fora das condições legais, sem que resulte diretamente outro crime.",
  "120": "Utilizar arma branca ou arma de fogo na prática de qualquer crime, funcionando como agravamento da pena.",
  "121": "Produzir, adquirir, vender ou distribuir armas de fogo de forma ilegal.",
  "122": "Produzir, adquirir ou distribuir armas brancas proibidas de forma ilegal.",
  "123": "Alterar ou modificar arma de fogo, aumentando a sua perigosidade.",
  "124": "Possuir substâncias ilícitas em quantidade destinada exclusivamente ao consumo próprio, dentro dos limites previstos.",
  "125": "Possuir substâncias ilícitas em quantidade superior à considerada para consumo próprio.",
  "126": "Produzir, adquirir, vender, distribuir ou ceder substâncias ilícitas.",
  "127": "Tráfico praticado em grupo organizado, envolvendo grandes quantidades ou em zonas sensíveis.",
  "128": "Cultivar, fabricar ou preparar substâncias ilícitas.",
  "129": "Ceder ou facilitar o consumo de substâncias ilícitas a terceiros.",
  "130": "Exercer caça sem licença válida ou sobre espécies não autorizadas.",
  "131": "Exercer pesca sem licença válida ou sobre espécies não autorizadas.",
  "132": "Capturar, ferir ou abater espécies classificadas como protegidas ou proibidas.",
  "133": "Recusar identificar-se ou não possuir documento de identificação válido quando legitimamente solicitado por autoridade competente.",
  "134": "Falsificar, alterar ou reproduzir documentos, identidades, matrículas ou qualquer elemento oficial.",
  "135": "Utilizar documento falsificado como se fosse verdadeiro.",
  "136": "Constituir, integrar ou participar em grupo organizado com objetivo de praticar crimes de forma continuada ou coordenada.",
  "137": "Ocultar, dissimular ou legitimar bens provenientes de atividade criminosa.",
  "138": "Provocar situações de violência, tumulto ou perturbação grave da ordem pública.",
  "139": "Auxiliar agente a fugir, ocultar vestígios do crime ou esconder bens provenientes de crime.",
  "140": "Contactar autoridades ou serviços de emergência com informação falsa, provocando mobilização desnecessária de meios.",
  "141": "Adquirir, receber, ocultar ou utilizar bens provenientes de crime, sabendo da sua origem ilícita.",
  "142": "Prestar declarações falsas ou omitir factos relevantes perante tribunal ou autoridade competente.",
  "143": "Autoridade que age contra a lei com intenção de beneficiar ou prejudicar alguém.",
  "144": "Divulgar informação confidencial obtida no exercício de funções.",
  "145": "Obter benefício ilegítimo para si ou terceiros através de engano ou artifício.",
  "146": "Ocultar rendimentos ou evitar o pagamento de impostos de forma ilegal.",
  "147": "Circular com o rosto oculto de forma a impedir identificação, podendo fundamentar abordagem e revista.",
  "148": "Possuir coletes balísticos, coldres ou equipamento tático sem justificação.",
  "149": "Operar aeronave sem autorização ou fora dos limites definidos.",
  "150": "Define os prazos para marcação de audiência após abertura formal de processo criminal.",
  "151": "Regula a representação em tribunal e atuação quando não exista procurador ou advogado presente.",
  "152": "Estabelece o dever das partes comparecerem em tribunal na data e hora designadas.",
  "153": "Proíbe comportamentos destinados a atrasar ou prejudicar o andamento normal do processo.",
  "154": "Permite julgamento à revelia quando o arguido, devidamente notificado, falte injustificadamente.",
  "155": "Regula a emissão de mandado de captura para assegurar a comparência do arguido em tribunal.",
  "156": "Define a tramitação do processo, investigação dos factos, recolha de prova e elaboração do auto de notícia.",
  "157": "Permite à autoridade policial aplicar sanção nos crimes leves e em certos crimes graves com confissão.",
  "158": "Define quando o processo deve ser remetido ao tribunal, nomeadamente crimes graves sem confissão.",
  "159": "Estabelece o direito de recurso da decisão policial ou judicial no prazo de 48 horas.",
  "160": "Regula o incumprimento de pagamento de coimas e sanções, incluindo pagamento voluntário, prestações, tribunal, penhora ou conversão em pena."
};

function obterDescricao(tipo, artigo, nome) {
  if (tipo === "Estrada" && DESCRICOES_ESTRADA[artigo]) return DESCRICOES_ESTRADA[artigo];
  if (tipo === "Penal" && DESCRICOES_PENAL[artigo]) return DESCRICOES_PENAL[artigo];
  return nome;
}

function criarArtigos(tipo, linhas) {
  return linhas.map(([artigo, nome, coimaMin = 0, coimaMax = 0, penaMin = 0, penaMax = 0]) => ({
    tipo,
    artigo,
    nome,
    descricao: obterDescricao(tipo, artigo, nome),
    coimaMin,
    coimaMax,
    penaMin,
    penaMax,
    keyword: `${nome} ${obterDescricao(tipo, artigo, nome)}`,
    codigo: `${tipo}-${artigo}`,
    categoria: inferCategoria(tipo, nome),
  }));
}

const ARTIGOS = [...criarArtigos("Estrada", ESTRADA_ARTIGOS), ...criarArtigos("Penal", PENAL_ARTIGOS)];

function money(v) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(v || 0);
}

function years(v) {
  if (!v) return "0 anos";
  return `${String(v).replace(".", ",")} anos`;
}

function calcularTotais(selecionados) {
  return selecionados.reduce(
    (acc, a) => ({ coimaMin: acc.coimaMin + (a.coimaMin || 0), coimaMax: acc.coimaMax + (a.coimaMax || 0), penaMin: acc.penaMin + (a.penaMin || 0), penaMax: acc.penaMax + (a.penaMax || 0) }),
    { coimaMin: 0, coimaMax: 0, penaMin: 0, penaMax: 0 }
  );
}

function calcularTotaisOperacionais(selecionados, dados = {}) {
  const base = calcularTotais(selecionados);
  const agravantes = gerarAgravantesLegais(selecionados, dados);
  const temAgravante = agravantes && !agravantes.includes("[sem agravantes");
  return {
    ...base,
    valorCoimaSugerido: temAgravante ? base.coimaMax : base.coimaMin,
    penaSugerida: temAgravante ? base.penaMax : base.penaMin,
    criterio: temAgravante
      ? "Com agravantes legais/indícios relevantes — avaliar aplicação acima do mínimo dentro da moldura prevista."
      : "Sem agravantes legais identificadas — aplicação pelo mínimo legal.",
  };
}

function encontrarArtigo(codigo) {
  return ARTIGOS.find((a) => a.codigo === codigo);
}

function sugerirPorContexto(texto, selecionados = []) {
  const s = normalize(texto);
  const regras = [
    { termos: ["fugiu", "fuga", "ordem de paragem"], codigos: ["Penal-103", "Estrada-4"] },
    { termos: ["sem carta", "sem habilitacao", "sem habilitação", "nao tem carta", "não tem carta"], codigos: ["Penal-111", "Estrada-33A"] },
    { termos: ["contramao", "contramão", "sentido contrario", "sentido contrário"], codigos: ["Estrada-13", "Penal-110"] },
    { termos: ["velocidade", "alta velocidade", "excesso"], codigos: ["Estrada-18", "Penal-110"] },
    { termos: ["vermelho", "stop", "sinal"], codigos: ["Estrada-7", "Estrada-22"] },
    { termos: ["acidente", "colid", "bateu", "embate"], codigos: ["Penal-113", "Penal-114"] },
    { termos: ["arma branca", "faca"], codigos: ["Penal-116"] },
    { termos: ["arma de fogo", "pistola", "municao", "munição"], codigos: ["Penal-117", "Penal-118", "Penal-120"] },
    { termos: ["droga", "cannabis", "erva", "cocaina", "cocaína", "xtc", "crack"], codigos: ["Penal-124", "Penal-125", "Penal-126"] },
    { termos: ["roubo", "assalto"], codigos: ["Penal-89", "Penal-90"] },
    { termos: ["refem", "refém"], codigos: ["Penal-76", "Penal-75"] },
    { termos: ["sequestro"], codigos: ["Penal-75"] },
    { termos: ["branqueamento", "dinheiro sujo"], codigos: ["Penal-137"] },
    { termos: ["identificar", "identificacao", "identificação"], codigos: ["Penal-133"] },
  ];
  const ja = new Set(selecionados.map((a) => a.codigo));
  const codigos = [];
  regras.forEach((r) => {
    if (r.termos.some((t) => s.includes(normalize(t)))) {
      r.codigos.forEach((c) => {
        if (!ja.has(c) && !codigos.includes(c)) codigos.push(c);
      });
    }
  });
  return codigos.map(encontrarArtigo).filter(Boolean).slice(0, 12);
}

function sugerirRelacionados(selecionados) {
  const ja = new Set(selecionados.map((a) => a.codigo));
  const codigos = [];
  selecionados.forEach((a) => {
    (RELACIONADOS[a.codigo] || []).forEach((c) => {
      if (!ja.has(c) && !codigos.includes(c)) codigos.push(c);
    });
  });
  return codigos.map(encontrarArtigo).filter(Boolean).slice(0, 10);
}

function gerarMedidasAcessorias(selecionados, dados) {
  const codigos = new Set(selecionados.map((a) => a.codigo));
  const medidas = [];
  if (["Estrada-39", "Estrada-40", "Penal-110", "Penal-111", "Penal-112", "Penal-113", "Penal-114"].some((c) => codigos.has(c))) medidas.push("Avaliar apreensão da carta/proibição temporária de conduzir, nos termos aplicáveis.");
  if (["Penal-116", "Penal-117", "Penal-118", "Penal-119", "Penal-121", "Penal-122", "Penal-123"].some((c) => codigos.has(c))) medidas.push("Apreensão cautelar das armas, munições ou objetos relacionados, quando aplicável.");
  if (["Penal-124", "Penal-125", "Penal-126", "Penal-127", "Penal-128", "Penal-129"].some((c) => codigos.has(c))) medidas.push("Apreensão do produto estupefaciente e demais elementos associados à prática do crime.");
  if (["Penal-137", "Penal-141"].some((c) => codigos.has(c))) medidas.push("Apreensão de valores/bens suspeitos e comunicação às entidades competentes.");
  if (normalize(dados.agravantes).includes("ferid")) medidas.push("Registar intervenção médica/SIRENE e eventual identificação dos feridos.");
  return medidas.length ? medidas.join("\n") : "[sem medidas acessórias identificadas automaticamente]";
}

function obterTipoDocumento(dados) {
  return String(dados.tipoDocumento || "Auto de Contraordenação").toUpperCase();
}


function criarTextoArtigosSimples(selecionados) {
  if (!selecionados.length) return "[selecionar artigos aplicáveis]";
  return selecionados
    .map((a) => `- Artigo ${a.artigo}.º (${a.tipo}) — ${a.nome}`)
    .join("\n");
}

function gerarAgravantesLegais(selecionados, dados = {}) {
  const codigos = new Set(selecionados.map((a) => a.codigo));
  const texto = normalize(`${dados.factos || ""} ${dados.agravantes || ""}`);
  const agravantes = [];

  function add(item) {
    if (!agravantes.includes(item)) agravantes.push(item);
  }

  const tem = (...lista) => lista.some((c) => codigos.has(c));

  if (texto.includes("reincid")) add("Reincidência — Art. 41.º do Código Penal / Art. 41.º do Código da Estrada, conforme aplicável.");
  if (texto.includes("arma") || texto.includes("faca") || texto.includes("pistola") || tem("Penal-117", "Penal-118", "Penal-119", "Penal-120")) add("Uso de arma ou meio perigoso — circunstância agravante prevista no Art. 39.º do Código Penal.");
  if (texto.includes("grupo") || texto.includes("vários") || texto.includes("varios") || tem("Penal-88", "Penal-90", "Penal-127", "Penal-136")) add("Atuação em grupo/organização — circunstância agravante ou qualificativa prevista no Código Penal.");
  if (texto.includes("autoridade") || texto.includes("policia") || texto.includes("polícia") || tem("Penal-101", "Penal-102", "Penal-103", "Penal-104")) add("Crime contra autoridade pública no exercício de funções — Art. 39.º do Código Penal.");
  if (texto.includes("violencia") || texto.includes("violência") || texto.includes("crueldade")) add("Especial violência/crueldade — Art. 39.º do Código Penal.");
  if (texto.includes("perigo") || texto.includes("contramao") || texto.includes("contramão") || tem("Penal-110", "Estrada-16", "Estrada-18", "Estrada-30")) add("Perigo concreto para terceiros — relevante para agravamento/enquadramento criminal rodoviário.");
  if (texto.includes("acidente") || texto.includes("colid") || texto.includes("embate") || tem("Penal-113", "Penal-114")) add("Acidente, danos ou feridos — relevante para enquadramento criminal e medidas rodoviárias.");

  if (tem("Penal-69")) add("Homicídio qualificado — crime já contém circunstâncias qualificativas próprias.");
  if (tem("Penal-88")) add("Furto qualificado — crime já contém circunstâncias qualificativas próprias.");
  if (tem("Penal-90")) add("Roubo qualificado — crime já contém circunstâncias qualificativas próprias.");
  if (tem("Penal-93")) add("Burla qualificada — crime já contém circunstâncias qualificativas próprias.");
  if (tem("Penal-96")) add("Dano qualificado — crime já contém circunstâncias qualificativas próprias.");
  if (tem("Penal-127")) add("Tráfico agravado — crime já contém circunstâncias agravadas próprias.");
  if (tem("Penal-120")) add("Uso de arma em crime — agrava a pena do crime praticado.");
  if (tem("Estrada-39")) add("Apreensão de carta — aplicável por múltiplas infrações graves/muito graves ou crimes na condução.");
  if (tem("Estrada-40")) add("Proibição temporária de conduzir — aplicável conforme gravidade, reincidência ou crime na condução.");

  return agravantes.length ? agravantes.map((a) => `• ${a}`).join("\n") : "[sem agravantes legais identificadas]";
}

function gerarNotasOperacionais(selecionados, dados = {}) {
  const codigos = new Set(selecionados.map((a) => a.codigo));
  const texto = normalize(`${dados.factos || ""} ${dados.agravantes || ""}`);
  const notas = [];

  function add(item) {
    if (!notas.includes(item)) notas.push(item);
  }

  const tem = (...lista) => lista.some((c) => codigos.has(c));

  if (tem("Penal-103", "Penal-110", "Estrada-4", "Estrada-13", "Estrada-18") || texto.includes("fuga") || texto.includes("fugiu")) add("Verificar se houve perigo concreto, percurso da fuga e necessidade de enquadramento criminal.");
  if (tem("Penal-111", "Estrada-33A")) add("Confirmar no MDT se o cidadão possui habilitação legal/categoria válida.");
  if (tem("Penal-112", "Estrada-28", "Estrada-28A")) add("Registar resultado do teste de álcool/droga ou eventual recusa.");
  if (tem("Penal-116", "Penal-117", "Penal-118", "Penal-119", "Penal-120")) add("Confirmar tipo de arma, licença e circunstâncias da posse/uso.");
  if (tem("Penal-124", "Penal-125", "Penal-126", "Penal-127", "Penal-128")) add("Confirmar quantidades, indícios de tráfico e existência de dinheiro/material associado.");
  if (texto.includes("ferid") || texto.includes("hospital")) add("Confirmar assistência médica, identificação dos feridos e relatório/avaliação SIRENE.");
  if (texto.includes("dano") || texto.includes("colid") || texto.includes("embate") || texto.includes("acidente")) add("Registar danos materiais, local exato e eventuais testemunhas.");

  return notas.length ? notas.map((n) => `• ${n}`).join("\n") : "[sem notas operacionais sugeridas]";
}

function gerarDiligenciasSugeridas(selecionados, dados = {}) {
  const codigos = new Set(selecionados.map((a) => a.codigo));
  const texto = normalize(`${dados.factos || ""} ${dados.agravantes || ""}`);
  const diligencias = [];

  function add(item) {
    if (!diligencias.includes(item)) diligencias.push(item);
  }

  const tem = (...lista) => lista.some((c) => codigos.has(c));

  if (tem("Penal-103", "Penal-110", "Estrada-13", "Estrada-18")) add("Registar percurso, infrações observadas e identificação da viatura.");
  if (tem("Penal-111", "Estrada-33A")) add("Identificar proprietário da viatura caso seja diferente do condutor.");
  if (tem("Penal-116", "Penal-117", "Penal-118", "Penal-119", "Penal-120")) add("Fotografar/identificar arma e preservar como prova, se apreendida.");
  if (tem("Penal-124", "Penal-125", "Penal-126", "Penal-127", "Penal-128")) add("Pesar/testar substâncias e registar quantidades, se o procedimento do servidor permitir.");
  if (tem("Penal-126", "Penal-127", "Penal-128", "Penal-136", "Penal-137")) add("Dar conhecimento à DIC quando existam indícios de investigação criminal organizada/complexa.");
  if (texto.includes("acidente") || texto.includes("colid") || texto.includes("embate")) add("Recolher testemunhos, fotografias e confirmar necessidade de reboque.");
  if (texto.includes("ferid") || texto.includes("hospital")) add("Acionar/confirmar SIRENE e registar assistência médica prestada.");

  return diligencias.length ? diligencias.map((d) => `• ${d}`).join("\n") : "[sem diligências sugeridas]";
}

function criarBlocoApreensoesFinal(selecionados, dados = {}) {
  const manual = String(dados.medidas || "").trim();
  if (!manual) return "";
  return `

APREENSÕES / RETENÇÕES
${manual}`;
}

function criarTextoInfracoes(selecionados) {
  if (!selecionados.length) return "[selecionar artigos aplicáveis]";
  return selecionados.map((a) => `- Artigo ${a.artigo}.º (${a.tipo}) — ${a.nome}: ${a.descricao}. Coima mínima: ${money(a.coimaMin)}${a.penaMin ? ` | Pena mínima: ${years(a.penaMin)}` : ""}`).join("\n");
}

function criarRelatorio(dados, selecionados, totais) {
  const tipo = String(dados.tipoDocumento || "Auto de Contraordenação");
  const titulo = tipo === "Detenção" ? "AUTO DE DETENÇÃO" : obterTipoDocumento(dados);
  const artigosSimples = criarTextoArtigosSimples(selecionados);
  const totaisOperacionais = calcularTotaisOperacionais(selecionados, dados);
  const blocoApreensoes = criarBlocoApreensoesFinal(selecionados, dados);

  const cabecalhoBase = `N.º Processo/Auto: ${dados.numeroProcesso || "[n.º interno]"}
Agente: ${dados.posto} ${dados.agente}
Data/Hora: ${dados.dataHora}
Suspeito/Autuado: ${dados.suspeito || "[identificação do cidadão]"}
Local: ${dados.local || "[local da ocorrência]"}
Matrícula/Viatura: ${dados.matricula || "[se aplicável]"}`;

  if (tipo === "Notícia" || tipo === "Detenção") {
    return `${titulo}

${cabecalhoBase}

DESCRIÇÃO DOS FACTOS
${dados.factos || "[descrever os factos ocorridos de forma clara, objetiva e cronológica]"}

ARTIGOS INFRINGIDOS
${artigosSimples}${blocoApreensoes}

TOTAL PELO MÍNIMO
Coima total mínima: ${money(totais.coimaMin)}
Pena total mínima: ${years(totais.penaMin)}

TOTAL OPERACIONAL SUGERIDO
${totaisOperacionais.criterio}
Coima sugerida: ${money(totaisOperacionais.valorCoimaSugerido)}
Pena sugerida: ${years(totaisOperacionais.penaSugerida)}`;
  }

  if (tipo === "Ocorrência") {
    return `${titulo}

N.º Processo/Auto: ${dados.numeroProcesso || "[n.º interno]"}
Agente: ${dados.posto} ${dados.agente}
Data/Hora: ${dados.dataHora}
Local: ${dados.local || "[local da ocorrência]"}
Matrícula/Viatura: ${dados.matricula || "[se aplicável]"}

DESCRIÇÃO DA OCORRÊNCIA
${dados.factos || "[descrever a ocorrência de forma clara e objetiva]"}

ARTIGOS / ENQUADRAMENTO
${artigosSimples}${blocoApreensoes}

TOTAL PELO MÍNIMO
Coima total mínima: ${money(totais.coimaMin)}
Pena total mínima: ${years(totais.penaMin)}

TOTAL OPERACIONAL SUGERIDO
${totaisOperacionais.criterio}
Coima sugerida: ${money(totaisOperacionais.valorCoimaSugerido)}
Pena sugerida: ${years(totaisOperacionais.penaSugerida)}`;
  }

  return `${titulo}

${cabecalhoBase}

DESCRIÇÃO DOS FACTOS
${dados.factos || "[descrever os factos ocorridos de forma clara e objetiva]"}

INFRAÇÕES VERIFICADAS
${artigosSimples}${blocoApreensoes}

TOTAL PELO MÍNIMO
Coima total mínima: ${money(totais.coimaMin)}
Pena total mínima: ${years(totais.penaMin)}

TOTAL OPERACIONAL SUGERIDO
${totaisOperacionais.criterio}
Coima sugerida: ${money(totaisOperacionais.valorCoimaSugerido)}
Pena sugerida: ${years(totaisOperacionais.penaSugerida)}`;
}

function criarRelatorioOficial(dados, selecionados, totais) {
  const titulo = obterTipoDocumento(dados);
  return `════════════════════════════════════\nPOLÍCIA DE SAN ANDREAS — PSA\n${titulo}\n════════════════════════════════════\n\n${criarRelatorio(dados, selecionados, totais)}\n\n════════════════════════════════════\nAssinatura do Agente: ${dados.posto} ${dados.agente}\n════════════════════════════════════`;
}

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return String(Date.now());
}

function criarResumoHistorico(dados, selecionados, totais) {
  return {
    id: makeId(),
    data: new Date().toLocaleString("pt-PT"),
    suspeito: dados.suspeito || "Sem identificação",
    local: dados.local || "Sem local",
    tipo: obterTipoDocumento(dados),
    artigos: selecionados.map((a) => `${a.artigo}.º ${a.nome}`),
    coimaMin: totais.coimaMin,
    penaMin: totais.penaMin,
    relatorio: criarRelatorio(dados, selecionados, totais),
  };
}

function runDevTests() {
  const dadosTeste = {
    agente: "Johny Morcego",
    posto: "Cabo Chefe",
    numeroProcesso: "AUTO-001",
    suspeito: "Teste Suspeito",
    local: "Vanilla",
    matricula: "AA-00-AA",
    dataHora: "17/05/2026, 09:00",
    factos: "O cidadão passou sinais vermelhos e ignorou ordem de paragem.",
    agravantes: "Fuga às autoridades.",
    medidas: "",
    tipoDocumento: "Auto de Contraordenação",
  };
  const selecionadosTeste = [ARTIGOS[0], ARTIGOS[1]];
  const totaisTeste = calcularTotais(selecionadosTeste);
  const relatorioTeste = criarRelatorio(dadosTeste, selecionadosTeste, totaisTeste);
  console.assert(ARTIGOS.length === 208, `Teste: devem existir 208 artigos, existem ${ARTIGOS.length}.`);
  console.assert(ARTIGOS.filter((a) => a.tipo === "Penal").length === 161, "Teste: devem existir 161 artigos do Código Penal.");
  console.assert(ARTIGOS.filter((a) => a.tipo === "Estrada").length === 47, "Teste: devem existir 47 artigos do Código da Estrada.");
  console.assert(ARTIGOS.some((a) => a.codigo === "Penal-108" && a.nome === "Abuso de Poder"), "Teste: artigo 108 Penal deve ser Abuso de Poder.");
  console.assert(ARTIGOS.some((a) => a.codigo === "Penal-115" && a.nome === "Utilização Indevida de Veículo"), "Teste: artigo 115 Penal deve ser Utilização Indevida de Veículo.");
  console.assert(ARTIGOS.some((a) => a.codigo === "Penal-116" && a.nome === "Posse de Arma Branca Proibida"), "Teste: artigo 116 Penal deve ser Posse de Arma Branca Proibida.");
  console.assert(ARTIGOS.some((a) => a.codigo === "Penal-149" && a.nome === "Violação de Espaço Aéreo"), "Teste: deve existir artigo 149 Penal.");
  console.assert(totaisTeste.coimaMin === 0, "Teste: os dois primeiros artigos da estrada são princípios/definições e não têm coima.");
  console.assert(relatorioTeste.includes(dadosTeste.factos), "Teste: descrição dos factos deve aparecer no relatório.");
  console.assert(relatorioTeste.includes("AUTO DE CONTRAORDENAÇÃO"), "Teste: tipo auto de contraordenação deve ser respeitado.");
  console.assert(!relatorioTeste.includes("AGRAVANTES / NOTAS RELEVANTES"), "Teste: agravantes não devem aparecer no auto final.");
  console.assert(gerarMedidasAcessorias([encontrarArtigo("Penal-116")], dadosTeste).includes("Apreender arma"), "Teste: armas devem gerar medida acessória de apreensão.");
  console.assert(aplicarQuebraLinhaTeste("A", "B") === "A\nB", "Teste: quebra de linha em agravantes deve usar escape correto.");
  const dadosOcorrencia = { ...dadosTeste, tipoDocumento: "Ocorrência" };
  console.assert(criarRelatorio(dadosOcorrencia, [], calcularTotais([])).includes("OCORRÊNCIA"), "Teste: tipo ocorrência deve ser respeitado.");
  const dadosNoticia = { ...dadosTeste, tipoDocumento: "Notícia" };
  console.assert(criarRelatorio(dadosNoticia, [], calcularTotais([])).includes("AUTO DE NOTÍCIA"), "Teste: tipo notícia deve ser respeitado.");
  const dadosDetencao = { ...dadosTeste, tipoDocumento: "Detenção" };
  console.assert(criarRelatorio(dadosDetencao, [], calcularTotais([])).includes("AUTO DE DETENÇÃO"), "Teste: tipo detenção deve ser respeitado.");
  const resumo = criarResumoHistorico(dadosTeste, selecionadosTeste, totaisTeste);
  console.assert(Boolean(resumo.id), "Teste: histórico deve ter ID.");
  console.assert(resumo.relatorio.includes("Teste Suspeito"), "Teste: histórico deve guardar o relatório completo.");
}

function aplicarQuebraLinhaTeste(a, b) {
  return `${a}\n${b}`;
}

// Testes desativados em produção.

export default function App() {
  const [query, setQuery] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [categoria, setCategoria] = useState("Todas");
  const [selecionados, setSelecionados] = useState([]);
  const [favoritos, setFavoritos] = useState(() => loadLocal("psa_favoritos", []));
  const [copiado, setCopiado] = useState("");
  const [modoPatrulha, setModoPatrulha] = useState(false);
  const [contextoRapido, setContextoRapido] = useState("");
  const [dados, setDados] = useState({
    agente: "Johny Morcego",
    posto: "Cabo Chefe",
    numeroProcesso: "",
    suspeito: "",
    local: "",
    matricula: "",
    dataHora: new Date().toLocaleString("pt-PT", { dateStyle: "short", timeStyle: "short" }),
    factos: "",
    agravantes: "",
    medidas: "",
    observacoes: "Foi informado do motivo de cada infração, do valor aplicado e dos respetivos artigos.",
    tipoDocumento: "Auto de Contraordenação",
  });

  useEffect(() => saveLocal("psa_favoritos", favoritos), [favoritos]);

  const categorias = useMemo(() => ["Todas", ...Array.from(new Set(ARTIGOS.map((a) => a.categoria))).sort()], []);
  const artigosFavoritos = useMemo(() => favoritos.map((c) => ARTIGOS.find((a) => a.codigo === c)).filter(Boolean), [favoritos]);
  const filtrados = useMemo(() => {
    const q = normalize(query);
    return ARTIGOS
      .filter((a) => tipo === "Todos" || a.tipo === tipo)
      .filter((a) => categoria === "Todas" || a.categoria === categoria)
      .filter((a) => !q || normalize(`${a.codigo} ${a.nome} ${a.descricao} ${a.keyword} artigo ${a.artigo} ${a.categoria}`).includes(q))
      .slice(0, 100);
  }, [query, tipo, categoria]);
  const totais = useMemo(() => calcularTotais(selecionados), [selecionados]);
  const infracoesTexto = useMemo(() => criarTextoInfracoes(selecionados), [selecionados]);
  const relatorio = useMemo(() => criarRelatorio(dados, selecionados, totais), [dados, selecionados, totais]);
  const relatorioOficial = useMemo(() => criarRelatorioOficial(dados, selecionados, totais), [dados, selecionados, totais]);
  const sugestoesContexto = useMemo(() => sugerirPorContexto(`${contextoRapido} ${dados.factos}`, selecionados), [contextoRapido, dados.factos, selecionados]);
  const sugestoesRelacionadas = useMemo(() => sugerirRelacionados(selecionados), [selecionados]);

  function addArtigo(a) {
    if (!a) return;
    if (!selecionados.some((x) => x.codigo === a.codigo)) setSelecionados([...selecionados, a]);
  }

  function addVariosArtigos(codigos) {
    setSelecionados((atuais) => {
      const novos = [...atuais];
      codigos.map(encontrarArtigo).filter(Boolean).forEach((a) => {
        if (!novos.some((x) => x.codigo === a.codigo)) novos.push(a);
      });
      return novos;
    });
  }

  function aplicarMolde(molde) {
    addVariosArtigos(molde.codigos);
    setDados((d) => ({
      ...d,
      agravantes: d.agravantes ? `${d.agravantes}\n${molde.agravantes}` : molde.agravantes,
    }));
  }

  function removeArtigo(codigo) {
    setSelecionados(selecionados.filter((a) => a.codigo !== codigo));
  }

  function toggleFavorito(codigo) {
    setFavoritos((atuais) => atuais.includes(codigo) ? atuais.filter((c) => c !== codigo) : [...atuais, codigo]);
  }

  function reset() {
    setSelecionados([]);
    setContextoRapido("");
    setDados({ ...dados, numeroProcesso: "", suspeito: "", local: "", matricula: "", factos: "", agravantes: "", medidas: "" });
  }

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopiado(label);
      setTimeout(() => setCopiado(""), 1800);
    } catch (error) {
      console.error("Não foi possível copiar:", error);
    }
  }

  function imprimir() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-[#07110a] text-slate-100 relative overflow-hidden p-4 md:p-6">
      <div className="pointer-events-none fixed inset-0 opacity-90">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-0 right-0 h-[420px] w-[520px] rounded-full bg-[#d4af37]/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1500px] space-y-6">
        <header className="relative overflow-hidden rounded-[2rem] border border-[#d4af37]/20 bg-gradient-to-br from-[#0c1a0f]/95 via-[#132918]/95 to-[#061009]/95 p-6 md:p-8 shadow-2xl shadow-black/50">
          <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-[#d4af37] via-[#1e7a3a] to-[#d4af37]" />
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-[#d4af37]/30 bg-black/20 shadow-xl shadow-[#d4af37]/10">
                <img src="/logo-psa.png" alt="PSA" className="h-20 w-20 object-contain drop-shadow-2xl" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <Shield className="absolute h-10 w-10 text-emerald-300/80" />
              </div>
              <div>
                <div className="text-xs md:text-sm uppercase tracking-[0.45em] text-emerald-300 font-black">Polícia de San Andreas</div>
                <h1 className="mt-1 text-4xl md:text-6xl font-black tracking-tight leading-none">
                  <span className="text-white drop-shadow">PSA</span> <span className="text-[#d4af37] drop-shadow">AUTOS</span>
                </h1>
                <p className="mt-3 text-slate-300 text-sm md:text-base">Sistema operacional para criação de autos e apoio ao serviço policial.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => setModoPatrulha(!modoPatrulha)} className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${modoPatrulha ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-white/10 hover:bg-white/15 border border-white/10"}`}><Zap className="h-4 w-4" /> Modo patrulha</button>
              <button onClick={imprimir} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 px-5 py-3 text-sm font-black transition"><Printer className="h-4 w-4" /> Imprimir/PDF</button>
              <button onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#d4af37] hover:bg-[#e1bf58] text-[#151406] px-5 py-3 text-sm font-black shadow-lg shadow-[#d4af37]/20 transition"><RotateCcw className="h-4 w-4" /> Limpar auto</button>
            </div>
          </div>
        </header>

        {copiado && <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 px-4 py-3">Copiado: {copiado}</div>}

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Kpi icon={<FileText />} label="Artigos selecionados" value={selecionados.length} />
          <Kpi icon={<Calculator />} label="Coima mínima" value={money(totais.coimaMin)} />
          <Kpi icon={<Calculator />} label="Coima máxima" value={money(totais.coimaMax)} />
          <Kpi icon={<Shield />} label="Pena mínima" value={years(totais.penaMin)} />
        </section>

        {artigosFavoritos.length > 0 && (
          <section className="rounded-[1.7rem] border border-white/10 bg-[#0e1c11]/85 backdrop-blur-xl p-5 shadow-2xl shadow-black/30 space-y-4">
            <div className="text-xl font-bold">Favoritos</div>
            <div className="flex flex-wrap gap-2">
              {artigosFavoritos.map((a) => <button key={a.codigo} onClick={() => addArtigo(a)} className="rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-4 py-2 text-sm font-semibold text-amber-200">+ Art. {a.artigo}.º — {a.nome}</button>)}
            </div>
          </section>
        )}

        <section className="rounded-[1.7rem] border border-white/10 bg-[#0e1c11]/85 backdrop-blur-xl p-5 shadow-2xl shadow-black/30 space-y-4">
          <div className="flex items-center gap-2 text-xl font-bold"><Wand2 className="h-5 w-5" /> Operacional rápido</div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
            <input value={contextoRapido} onChange={(e) => setContextoRapido(e.target.value)} placeholder="Ex: fugiu sem carta em contramão e bateu num camião" className="rounded-2xl bg-[#07110a]/90 border border-emerald-900/80 px-4 py-3 outline-none focus:border-[#d4af37] transition" />
            <button onClick={() => addVariosArtigos(sugestoesContexto.map((a) => a.codigo))} className="rounded-2xl bg-[#d4af37] hover:bg-[#e1bf58] text-[#151406] px-5 py-3 text-sm font-black shadow-lg shadow-[#d4af37]/20">Adicionar sugestões</button>
          </div>
          {sugestoesContexto.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {sugestoesContexto.map((a) => <button key={a.codigo} onClick={() => addArtigo(a)} className="rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/30 px-3 py-2 text-sm font-semibold text-[#f3d889]">+ Art. {a.artigo}.º {a.nome}</button>)}
            </div>
          )}
          {!modoPatrulha && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {MOLDES_RAPIDOS.map((m) => <button key={m.nome} onClick={() => aplicarMolde(m)} className="text-left rounded-2xl bg-[#07110a]/80 hover:bg-[#122618] border border-white/10 hover:border-[#d4af37]/40 p-4 transition"><div className="font-bold">{m.nome}</div><div className="text-xs text-slate-400 mt-1">{m.descricao}</div></button>)}
            </div>
          )}
        </section>

        <main className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="rounded-[1.7rem] border border-white/10 bg-[#0e1c11]/85 backdrop-blur-xl p-5 shadow-2xl shadow-black/30 space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold"><Search className="h-5 w-5" /> Pesquisa rápida</div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_190px] gap-3">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ex: sem carta, contramão, fuga, arma, cannabis..." className="rounded-2xl bg-[#07110a]/90 border border-emerald-900/80 px-4 py-3 outline-none focus:border-[#d4af37] transition" />
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="rounded-2xl bg-[#07110a]/90 border border-emerald-900/80 px-4 py-3 outline-none focus:border-[#d4af37] transition"><option>Todos</option><option>Estrada</option><option>Penal</option></select>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="rounded-2xl bg-[#07110a]/90 border border-emerald-900/80 px-4 py-3 outline-none focus:border-[#d4af37] transition">{categorias.map((c) => <option key={c}>{c}</option>)}</select>
            </div>
            <div className="max-h-[620px] overflow-auto pr-1 space-y-2">
              {filtrados.map((a) => (
                <article key={a.codigo} className="rounded-2xl bg-[#07110a]/80 border border-white/10 p-4 hover:border-[#d4af37]/50 hover:bg-[#122618] transition shadow-lg shadow-black/10">
                  <div className="flex gap-3 justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2"><span className={`text-xs px-2 py-1 rounded-full ${a.tipo === "Estrada" ? "bg-amber-500/20 text-amber-300" : "bg-red-500/20 text-red-300"}`}>{a.tipo}</span><span className="text-xs px-2 py-1 rounded-full bg-[#1a291b] text-slate-300">{a.categoria}</span><h3 className="font-bold">Art. {a.artigo}.º — {a.nome}</h3></div>
                      <p className="text-sm text-slate-400 mt-1">{a.descricao}</p>
                      <p className="text-sm mt-2 text-slate-300">Coima: <b>{money(a.coimaMin)}</b> a {money(a.coimaMax)}{a.penaMin > 0 && <> · Pena: <b>{years(a.penaMin)}</b> a {years(a.penaMax)}</>}</p>
                    </div>
                    <div className="flex flex-col gap-2"><button onClick={() => addArtigo(a)} className="h-10 min-w-10 rounded-xl bg-[#d4af37] hover:bg-[#e1bf58] text-[#151406] inline-flex items-center justify-center" title="Adicionar artigo"><Plus className="h-5 w-5" /></button><button onClick={() => toggleFavorito(a.codigo)} className={`h-10 min-w-10 rounded-xl inline-flex items-center justify-center ${favoritos.includes(a.codigo) ? "bg-amber-500/30 text-amber-200" : "bg-[#1a291b] hover:bg-[#243724] text-slate-300"}`} title="Favorito"><Star className="h-5 w-5" /></button></div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[1.7rem] border border-white/10 bg-[#0e1c11]/85 backdrop-blur-xl p-5 shadow-2xl shadow-black/30 space-y-4">
              <div className="flex items-center gap-2 text-xl font-bold"><Car className="h-5 w-5" /> Dados do auto</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SelectField label="Tipo de documento" value={dados.tipoDocumento} onChange={(v) => setDados({ ...dados, tipoDocumento: v })} options={TIPOS_DOCUMENTO} />
                <Field label="Data/Hora" value={dados.dataHora} onChange={(v) => setDados({ ...dados, dataHora: v })} />
                <Field label="N.º Processo/Auto" value={dados.numeroProcesso} onChange={(v) => setDados({ ...dados, numeroProcesso: v })} />
                <Field label="Agente" value={dados.agente} onChange={(v) => setDados({ ...dados, agente: v })} />
                <Field label="Posto" value={dados.posto} onChange={(v) => setDados({ ...dados, posto: v })} />
                <Field label="Suspeito" value={dados.suspeito} onChange={(v) => setDados({ ...dados, suspeito: v })} />
                <Field label="Local" value={dados.local} onChange={(v) => setDados({ ...dados, local: v })} />
                <Field label="Matrícula/Viatura" value={dados.matricula} onChange={(v) => setDados({ ...dados, matricula: v })} />
              </div>
              <TextArea label="Descrição dos factos" value={dados.factos} onChange={(v) => setDados({ ...dados, factos: v })} placeholder="Cola aqui a descrição completa dos factos para entrar automaticamente no auto final" rows={5} />
              <TextArea label="Agravantes / notas relevantes" value={dados.agravantes} onChange={(v) => setDados({ ...dados, agravantes: v })} placeholder="Ex: fuga às autoridades, perigo para terceiros, danos materiais, feridos ligeiros, reincidência..." rows={3} />
              <TextArea label="Apreensões / retenções efetuadas" value={dados.medidas} onChange={(v) => setDados({ ...dados, medidas: v })} placeholder="Opcional. Só escreve aqui se existiu apreensão/retenção real. Ex: arma branca apreendida; veículo removido; carta retida." rows={3} />
              <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-3 text-sm text-orange-100">
                <div className="font-bold mb-1">Agravantes legais identificadas</div>
                <pre className="whitespace-pre-wrap text-orange-100/90">{gerarAgravantesLegais(selecionados, dados)}</pre>
              </div>
              <div className="rounded-xl bg-[#1a291b]/70 border border-emerald-900/70 p-3 text-sm text-slate-200">
                <div className="font-bold mb-1">Notas operacionais</div>
                <pre className="whitespace-pre-wrap text-slate-300">{gerarNotasOperacionais(selecionados, dados)}</pre>
              </div>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-100">
                <div className="font-bold mb-1">Diligências sugeridas</div>
                <pre className="whitespace-pre-wrap text-emerald-100/90">{gerarDiligenciasSugeridas(selecionados, dados)}</pre>
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-white/10 bg-[#0e1c11]/85 backdrop-blur-xl p-5 shadow-2xl shadow-black/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xl font-bold">Artigos selecionados</div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => copy(dados.factos || "", "descrição")} className="inline-flex items-center gap-2 rounded-xl bg-[#1a291b] hover:bg-[#243724] px-3 py-2 text-sm font-bold"><Copy className="h-4 w-4" /> Só descrição</button>
                  <button onClick={() => copy(infracoesTexto, "infrações")} className="inline-flex items-center gap-2 rounded-xl bg-[#1a291b] hover:bg-[#243724] px-3 py-2 text-sm font-bold"><Copy className="h-4 w-4" /> Só infrações</button>
                  <button onClick={() => copy(relatorio, "relatório completo")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-sm font-bold shadow-lg shadow-emerald-600/20"><Copy className="h-4 w-4" /> Relatório</button>
                  <button onClick={() => copy(relatorioOficial, "modelo oficial PSA")} className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] hover:bg-[#e1bf58] text-[#151406] px-3 py-2 text-sm font-black shadow-lg shadow-[#d4af37]/20"><Copy className="h-4 w-4" /> Modelo PSA</button>
                </div>
              </div>
              {sugestoesRelacionadas.length > 0 && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3"><div className="text-sm font-bold text-emerald-200 mb-2">Artigos relacionados sugeridos</div><div className="flex flex-wrap gap-2">{sugestoesRelacionadas.map((a) => <button key={a.codigo} onClick={() => addArtigo(a)} className="rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-100">+ Art. {a.artigo}.º {a.nome}</button>)}</div></div>}
              {selecionados.length === 0 ? <p className="text-slate-400">Seleciona artigos na pesquisa rápida.</p> : <div className="space-y-2">{selecionados.map((a) => <div key={a.codigo} className="flex items-center justify-between gap-2 rounded-2xl bg-[#07110a]/80 border border-white/10 p-3"><div className="text-sm"><b>Art. {a.artigo}.º — {a.nome}</b><br /><span className="text-slate-400">{money(a.coimaMin)} mínimo {a.penaMin > 0 ? ` · ${years(a.penaMin)} mínimo` : ""}</span></div><button onClick={() => removeArtigo(a.codigo)} className="rounded-lg bg-red-500/20 text-red-300 p-2 hover:bg-red-500/30" title="Remover artigo"><Trash2 className="h-4 w-4" /></button></div>)}</div>}
              <pre className="whitespace-pre-wrap rounded-2xl bg-[#f8f7f0] border border-[#d4af37]/40 p-5 text-sm text-slate-900 max-h-[420px] overflow-auto shadow-inner">{relatorio}</pre>
            </div>
          </section>
        </main>

      </div>
    </div>
  );
}

function saveLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { console.error("Erro ao guardar no navegador:", error); }
}

function loadLocal(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}

function Kpi({ icon, label, value }) {
  return (
    <div className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-[#0e1c11] to-[#07110a] p-5 shadow-2xl shadow-black/30">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[#d4af37]/10 blur-2xl group-hover:bg-[#d4af37]/20 transition" />
      <div className="relative flex items-center gap-3 text-slate-300 text-sm font-bold">
        {React.cloneElement(icon, { className: "h-5 w-5 text-[#d4af37]" })}
        {label}
      </div>
      <div className="relative mt-3 text-3xl font-black tracking-tight text-white">{value}</div>
    </div>
  );
}


function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-sm font-black text-slate-300">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl bg-[#07110a]/90 border border-emerald-900/70 px-4 py-3 outline-none focus:border-[#d4af37] transition" />
    </label>
  );
}


function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-sm font-black text-slate-300">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl bg-[#07110a]/90 border border-emerald-900/70 px-4 py-3 outline-none focus:border-[#d4af37] transition">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}


function TextArea({ label, value, onChange, placeholder, rows }) {
  return (
    <label className="block">
      <span className="block mb-1.5 text-sm font-black text-slate-300">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full rounded-2xl bg-[#07110a]/90 border border-emerald-900/70 px-4 py-3 outline-none focus:border-[#d4af37] transition" placeholder={placeholder} />
    </label>
  );
}
