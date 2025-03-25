import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import fs from 'fs/promises';

// Mock modules
vi.mock('axios');
vi.mock('fs/promises');

// Type definitions for better type safety
interface Recurso {
  link: string;
  descricao: string;
}

interface LinkCategory {
  tema: string;
  recursos: Recurso[];
}

// Functions to test
async function carregarLinks(): Promise<LinkCategory[]> {
  try {
      const data = await fs.readFile('./data/links.json', 'utf-8');
      const links: LinkCategory[] = JSON.parse(data);
      console.log("Links carregados com sucesso!");
      return links;
  } catch (error) {
      console.error("Erro ao carregar o arquivo JSON:", error);
      return [];
  }
}

async function filtrarLinksPorTema(tema: string): Promise<LinkCategory[]> {
    const links = await carregarLinks();
    return links.filter(item => item.tema === tema);
}

async function exibirLinksPorTema(tema: string): Promise<Recurso[]> {
    const linksFiltrados = await filtrarLinksPorTema(tema);
    
    if (linksFiltrados.length > 0) {
        console.log(`Links encontrados sobre "${tema}":`);
        return linksFiltrados[0].recursos.map(recurso => ({
            descricao: recurso.descricao,
            link: recurso.link
        }));
    } else {
        console.log(`Nenhum link encontrado para o tema "${tema}".`);
        return [];
    }
}

describe('Sistema de Gerenciamento de Links', () => {
  const mockLinks: LinkCategory[] = [
    {
      tema: "frontend",
      recursos: [
        {
          link: "https://www.freecodecamp.org/",
          descricao: "Curso gratuito e interativo de desenvolvimento web"
        },
        {
          link: "https://developer.mozilla.org/en-US/",
          descricao: "Documentação oficial de HTML, CSS e JavaScript"
        }
      ]
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fs.readFile).mockReset();
    vi.mocked(axios.head).mockReset();
    
    // Mock console
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });


  describe('carregarLinks()', () => {
    it('should load links correctly from JSON file', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockLinks));
      
      const result = await carregarLinks();
      expect(result).toEqual(mockLinks);
      expect(fs.readFile).toHaveBeenCalledWith('./data/links.json', 'utf-8');
      expect(console.log).toHaveBeenCalledWith("Links carregados com sucesso!");
    });

    it('should return empty array if file does not exist', async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error('File not found'));
      
      const result = await carregarLinks();
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('filtrarLinksPorTema()', () => {
    beforeEach(() => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockLinks));
    });

    it('should filter links by existing theme', async () => {
      const result = await filtrarLinksPorTema('frontend');
      expect(result).toEqual([mockLinks[0]]);
    });

    it('should return empty array for non-existent theme', async () => {
      const result = await filtrarLinksPorTema('inexistente');
      expect(result).toEqual([]);
    });
  });

  describe('exibirLinksPorTema()', () => {
    beforeEach(() => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockLinks));
    });

    it('should correctly format links for display', async () => {
      const result = await exibirLinksPorTema('frontend');
      expect(result).toEqual([
        {
          descricao: "Curso gratuito e interativo de desenvolvimento web",
          link: "https://www.freecodecamp.org/"
        },
        {
          descricao: "Documentação oficial de HTML, CSS e JavaScript",
          link: "https://developer.mozilla.org/en-US/"
        }
      ]);
      expect(console.log).toHaveBeenCalledWith('Links encontrados sobre "frontend":');
    });

    it('should return empty array for theme without links', async () => {
      const result = await exibirLinksPorTema('marketing');
      expect(result).toEqual([]);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Nenhum link encontrado'));
    });
  });

  describe('Link Validation', () => {
    it('should verify all links are active', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockLinks));
      vi.mocked(axios.head).mockResolvedValue({ status: 200 });
      
      const links = await carregarLinks();
      
      for (const category of links) {
        for (const resource of category.recursos) {
          await expect(axios.head(resource.link)).resolves.toBeDefined();
        }
      }
    });

    it('should detect broken links', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockLinks));
      vi.mocked(axios.head).mockImplementation(url => 
        url.includes('freecodecamp') 
          ? Promise.resolve({ status: 200 })
          : Promise.reject({ response: { status: 404 } })
      );
      
      await expect(axios.head('https://developer.mozilla.org/en-US/')).rejects.toBeDefined();
    });
  });

  describe('Data Structure Validation', () => {
    it('should validate the structure of each link object', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockLinks));
      
      const links = await carregarLinks();
      
      expect(links).toBeInstanceOf(Array);
      links.forEach(categoria => {
        expect(categoria).toHaveProperty('tema');
        expect(categoria).toHaveProperty('recursos');
        expect(categoria.recursos).toBeInstanceOf(Array);
        
        categoria.recursos.forEach(recurso => {
          expect(recurso).toHaveProperty('link');
          expect(recurso).toHaveProperty('descricao');
          expect(recurso.link).toMatch(/^https?:\/\//);  // Fixed regex
          expect(typeof recurso.descricao).toBe('string');
        });
      });
    });
  });

});

//vitest
//axios
//jsdom