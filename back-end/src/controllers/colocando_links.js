import links from "./models/links.js";
import conectar_db from "../config/dbConnection.js";
import mongoose from "mongoose";

const linksDatabase = async()=>{
    await conectar_db();

    const dados=[
        {
            tema: "frontend",
            recursos:[{link:"https://www.freecodecamp.org/", descricao: "Curso gratuito e interativo de desenvolvimento web "}, 
                {link:"https://developer.mozilla.org/en-US/", descricao: "Documentação oficial de HTML, CSS e JavaScript "}]
        },
        {
            tema:"ux/ui design",
            recursos:[{link: "https://www.frontendmentor.io/", descricao: " Desafios práticos para treinar design e código "},
                {link: "https://css-tricks.com/", descricao: "Dicas e truques para melhorar suas habilidades com CSS "}
            ]
        },
        {
            tema: "cyber security",
            recursos:[{link:"https://training.fortinet.com/", descricao:"Plataforma de treinamento da Fortinet, empresa de segurança cibernética "},
                {link:"https://tryhackme.com/", descricao:"Plataforma prática para aprender hacking ético "}
             ]
        },
        {
            tema:"data analyst",
            recursos:[{link:"https://www.coursera.org/professional-certificates/google-data-analytics", descricao:"Curso oficial do Google sobre análise dados "},
                {link:"https://towardsdatascience.com/", descricao:"Blog com artigos sobre ciência de dados "}
            ]
        },
        {
            tema:"backend",
            recursos:[{link:"https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side"}]
        },
        {
            tema:"project manager",
            recursos:[{link:"https://scrumguides.org/", descricao:"Guia oficial do Scrum, essencial para metodologias ágeis"},
                {link:"https://www.coursera.org/professional-certificates/google-project-management", descricao:"Curso do Google sobre gerenciamento de projetos "}
            ]
        }
    ];//

    try{
        await links.insertMany(dados);
        console.log("Banco dos links populado com sucesso");
    }catch(error){
        console.error("Erro ao inserir os links", error);
    }finally{
        mongoose.connection.close();
    }
};

seedDatabase();

////