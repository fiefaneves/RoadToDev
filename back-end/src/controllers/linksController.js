import fs from 'fs/promises';


async function carregarLinks() {
    try {
        const data = await fs.readFile('./data/links.json', 'utf-8');
        const links = JSON.parse(data);
        console.log("Links carregados com sucesso!");
        return links;
    } catch (error) {
        console.error("Erro ao carregar o arquivo JSON:", error);
        return [];
    }
}

async function filtrarLinksPorTema(tema) {
    const links = await carregarLinks();

    if (links.length > 0) {
        const linksFiltrados = links.filter(item => item.tema === tema);
        return linksFiltrados;
    } else {
        return [];
    }
}


export async function exibirLinksPorTema(tema) {
    const linksFiltrados = await filtrarLinksPorTema(tema);

    if (linksFiltrados.length > 0) {
        const item = linksFiltrados[0];
        console.log(`Links encontrados sobre "${tema}":`);
        
        return item.recursos.map(recurso => ({
            descricao: recurso.descricao,
            link: recurso.link
        }));  
    } 
    else {
        console.log(`Nenhum link encontrado para o tema "${tema}".`);
        return [];
    }
}


