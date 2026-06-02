import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
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

const TIPOS_DOCUMENTO = ["Auto de Contraordenação", "Ocorrência", "Notícia"];

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
