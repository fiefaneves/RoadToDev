import { filtrarLinksPorTema } from '../service/linksServices.js';//importa a função filtrarLinksPorTema 

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

export default exibirLinksPorTema;