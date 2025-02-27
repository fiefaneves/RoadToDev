import Links from "./models/Links.js";
import conectar_db from "../config/dbConnection.js";

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
            tema:""
        }

        
    ]
}