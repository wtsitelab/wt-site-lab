/* Kit Veículos — camada de dados (WT Site Lab).
   Lê o estoque de demonstração do site (window.ESTOQUE) e simula consultas a
   um servidor, com latência. Em produção, cada função vira uma chamada ao
   banco — por exemplo, no Supabase:
     buscar()   → select em "anuncios" com .ilike/.in/.gte/.lte, .order e .range
     obter()    → select por id, com join em "lojas"
     facetas    → view ou RPC que agrega contagens por marca, categoria etc.
   As páginas só conversam com window.VeiculosAPI, então trocar a fonte de
   dados não exige mexer no restante do site. */
(function () {
  'use strict';
  const { itens, lojas } = window.ESTOQUE;
  const CONF = window.CONF;
  const esperar = (ms) => new Promise(r => setTimeout(r, ms));
  const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  // faceta (campo do anúncio) → nome da lista no filtro
  const FACETAS = { tipo: 'tipos', marca: 'marcas', categoria: 'categorias', combustivel: 'combustiveis', cambio: 'cambios', cor: 'cores', cidade: 'cidades' };

  function faixaCc(cc) {
    const f = (CONF.faixasCilindrada || []).find(([, min, max]) => cc >= min && cc <= max);
    return f ? f[0] : null;
  }

  function filtrar(f, ignorar) {
    const termo = f.q ? norm(f.q).split(/\s+/).filter(Boolean) : [];
    return itens.filter(v => {
      if (termo.length) {
        const alvo = norm(`${v.marca} ${v.modelo} ${v.versao} ${v.ano} ${v.cor} ${v.cidade} ${CONF.categorias[v.categoria]?.nome || ''}`);
        if (!termo.every(t => alvo.includes(t))) return false;
      }
      for (const [campo, lista] of Object.entries(FACETAS)) {
        if (campo === ignorar) continue;
        const sel = f[lista];
        if (sel && sel.length && !sel.includes(v[campo])) return false;
      }
      if (ignorar !== 'cilindrada' && f.cilindradas && f.cilindradas.length && !f.cilindradas.includes(faixaCc(v.cilindrada))) return false;
      if (f.precoMin && v.preco < f.precoMin) return false;
      if (f.precoMax && v.preco > f.precoMax) return false;
      if (f.anoMin && v.ano < f.anoMin) return false;
      if (f.anoMax && v.ano > f.anoMax) return false;
      if (f.kmMax && v.km > f.kmMax) return false;
      if (f.opcionais && f.opcionais.length && !f.opcionais.every(o => v.opcionais.includes(o))) return false;
      for (const b of ['unicoDono', 'revisado', 'laudo', 'blindado', 'abs']) if (f[b] && !v[b]) return false;
      if (f.abaixoRef && !(v.preco < v.ref)) return false;
      if (f.ids && !f.ids.includes(v.id)) return false;
      return true;
    });
  }

  const ORDENS = {
    relevancia: (a, b) => (Number(b.laudo) + Number(b.revisado) + Number(b.preco < b.ref) - b.dias / 30) - (Number(a.laudo) + Number(a.revisado) + Number(a.preco < a.ref) - a.dias / 30),
    menorPreco: (a, b) => a.preco - b.preco,
    maiorPreco: (a, b) => b.preco - a.preco,
    menorKm: (a, b) => a.km - b.km,
    maisNovos: (a, b) => b.ano - a.ano || a.km - b.km,
    recentes: (a, b) => a.dias - b.dias,
  };

  function contar(lista, fn) {
    const m = {};
    lista.forEach(v => { const k = fn(v); if (k != null) m[k] = (m[k] || 0) + 1; });
    return m;
  }

  const comLoja = (v) => ({ ...v, lojaInfo: lojas[v.loja] });

  async function buscar(f = {}) {
    await esperar(160 + Math.random() * 180);
    const lista = filtrar(f).sort(ORDENS[f.ordem] || ORDENS.relevancia);
    const porPagina = f.porPagina || 12;
    const paginas = Math.max(1, Math.ceil(lista.length / porPagina));
    const pagina = Math.max(1, Math.min(f.pagina || 1, paginas));
    const facetas = {};
    Object.keys(FACETAS).forEach(campo => { facetas[campo] = contar(filtrar(f, campo), v => v[campo]); });
    facetas.cilindrada = contar(filtrar(f, 'cilindrada'), v => faixaCc(v.cilindrada));
    return { total: lista.length, pagina, porPagina, paginas, itens: lista.slice((pagina - 1) * porPagina, pagina * porPagina).map(comLoja), facetas };
  }

  async function obter(id) {
    await esperar(120);
    const v = itens.find(x => x.id === Number(id));
    return v ? comLoja(v) : null;
  }

  async function similares(v, n = 4) {
    await esperar(100);
    return itens.filter(x => x.id !== v.id)
      .map(x => ({ x, s: (x.tipo === v.tipo ? 4 : 0) + (x.categoria === v.categoria ? 3 : 0) + (x.marca === v.marca ? 1 : 0) - Math.abs(x.preco - v.preco) / 40000 }))
      .sort((a, b) => b.s - a.s).slice(0, n).map(o => comLoja(o.x));
  }

  function limites() {
    const uniq = (fn) => [...new Set(itens.map(fn).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), 'pt-BR'));
    const anos = itens.map(v => v.ano);
    return {
      anoMin: Math.min(...anos), anoMax: Math.max(...anos),
      marcas: uniq(v => v.marca), cidades: uniq(v => v.cidade), cambios: uniq(v => v.cambio),
      combustiveis: uniq(v => v.combustivel), cores: uniq(v => v.cor), tipos: uniq(v => v.tipo),
      opcionais: [...new Set(itens.flatMap(v => v.opcionais))].sort(),
      temMotos: itens.some(v => v.tipo === 'moto'), total: itens.length,
    };
  }

  // favoritos e comparação ficam no navegador (no site real: tabela ligada ao usuário)
  const pref = CONF.chave || 'veiculos';
  function ler(k) { try { return JSON.parse(localStorage.getItem(k)) || []; } catch (e) { return []; } }
  function gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  const favoritos = {
    listar: () => ler(pref + '-fav'),
    alternar(id) { const l = ler(pref + '-fav'); const i = l.indexOf(id); if (i >= 0) l.splice(i, 1); else l.push(id); gravar(pref + '-fav', l); return i < 0; },
    tem: (id) => ler(pref + '-fav').includes(id),
  };

  window.VeiculosAPI = { buscar, obter, similares, limites, favoritos, faixaCc };
})();
