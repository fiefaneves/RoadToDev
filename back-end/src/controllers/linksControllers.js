import fs from 'fs/promises';

// Função para carregar os links do arquivo JSON
async function carregarLinks() {
    try {
        const data = await fs.readFile('./data/links.json', 'utf-8');//utf-8 e a codoficação do arquivo, devolve conteudo como string- data
        const links = JSON.parse(data);//converte em um objeto
        console.log("Links carregados com sucesso!");
        return links;
    } catch (error) {
        console.error("Erro ao carregar o arquivo JSON:", error);
        return [];
    }
}

// Função para filtrar links por tema
async function filtrarLinksPorTema(tema) {//tema x do front, disponicel na paArte de interreses do form
    const links = await carregarLinks();

    if (links.length > 0) {
        const linksFiltrados = links.filter(item => item.tema === tema);//retorna um array com os links do tema x
        return linksFiltrados;
    } else {
        return [];
    }
}

//export { carregarLinks, filtrarLinksPorTema };


// Função para exibir links filtrados por tema
async function exibirLinksPorTema(tema) {
    const linksFiltrados = await filtrarLinksPorTema(tema);

    if (linksFiltrados.length > 0) {
        const item = linksFiltrados[0];// so vai retornar um objeto, entáo náo prescisa de um for each
        console.log(`Links encontrados sobre "${tema}":`);
        item.recursos.forEach(recurso => {
            console.log(`  Descrição: ${recurso.descricao}`);
            console.log(` • Link: ${recurso.link}`);
        });
    } 
    else {
        console.log(`Nenhum link encontrado para o tema "${tema}".`);
    }
}

async function linksRoadMap(req, res){//define uma rota get que tem tema como parametro, async [e o manioulador dessa rota 
    const tema = req.params.tema;//extrai o valor de tema da url da solicitacao
    await exibirLinksPorTema(tema);
    res.send('Links exibidos no console.');
}

export default  linksRoadMap;
