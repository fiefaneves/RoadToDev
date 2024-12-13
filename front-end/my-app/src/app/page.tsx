import React from 'react';
import Image from 'next/image';

const HomePage = () => {
  return (
    <div className="px-4">
      {/* Header */}
      <div className="flex justify-center items-center w-full h-full mt-16">
        <h1 className="text-neutral-700 text-[53px] text-center">Road To Dev</h1>
      </div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mt-10">
        {/* Text Content */}
        <div className="md:w-[70vw] w-full">
          <p className="text-neutral-700 md:ml-[58px] md:mt-10 text-justify">
          RoadToDev: Facilitando o Caminho na Programação
A programação é um universo amplo e desafiador, com tópicos que muitas vezes possuem uma hierarquia implícita difícil de identificar. Pensando nisso, criamos o RoadToDev, uma ferramenta inovadora que orienta desenvolvedores em suas jornadas de aprendizado. Nosso software utiliza inteligência artificial para analisar informações do usuário e criar um roadmap personalizado, adaptado ao nível de experiência e aos interesses de cada indivíduo.

Com o RoadToDev, iniciantes recebem uma base sólida e motivação para dar os primeiros passos, intermediários encontram ferramentas para aprofundar seus conhecimentos, e avançados têm acesso a conteúdos especializados e opções de liderança técnica. Além disso, oferecemos recursos de estudo, integração com projetos práticos e insights sobre tendências de mercado, garantindo que cada usuário alcance seus objetivos com clareza e eficiência.

Junte-se a nós nessa jornada e transforme o aprendizado de programação em uma experiência organizada e personalizada!
          </p>
        </div>

        {/* Image */}
        <div className="mt-6 md:mt-0">
          <Image
            src="roadmap_img.svg"
            alt="Description of image"
            width={320}
            height={1}
            className="rounded-lg mr-[58px] ml-[58px] mb-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
