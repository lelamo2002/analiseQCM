### Documentação do Projeto de Análise de Comentários do Google Play Store

#### Propósito do Código

Este código foi desenvolvido para analisar uma das métricas em nosso GQM na disciplina de Qualidade de Software da Universidade de Brasília (UnB). O objetivo do código é coletar e analisar comentários de usuários sobre um aplicativo específico da Google Play Store, utilizando a API do OpenAI para determinar o sentimento dos comentários em relação à usabilidade do aplicativo. O resultado da análise inclui a contagem total de comentários analisados e a porcentagem de feedbacks positivos, neutros e negativos.

#### Funcionalidades

1. **Coleta de Comentários**: Utiliza o Puppeteer para navegar na página do aplicativo na Google Play Store, clicar no botão para visualizar todos os comentários e rolar a página para carregar mais comentários.
2. **Análise de Sentimento**: Utiliza a API do OpenAI para analisar o sentimento dos comentários e determinar se o feedback é positivo, neutro ou negativo.
3. **Relatório de Resultados**: Calcula a porcentagem de cada tipo de feedback e salva um resumo dos resultados em um arquivo de texto.

#### Como Rodar o Código

1. **Pré-requisitos**:
   - Node.js instalado.
   - Conta na OpenAI com uma chave de API válida.
   - Navegador Google Chrome ou Chromium instalado (necessário para o Puppeteer).

2. **Instalação de Dependências**:
   - Clone este repositório.
   - Navegue até o diretório do projeto no terminal.
   - Execute o comando `npm install` para instalar as dependências necessárias.

3. **Configuração da Chave de API do OpenAI**:
   - Crie um arquivo `.env` na raiz do projeto.
   - Adicione a seguinte linha ao arquivo `.env`, substituindo `YOUR_OPENAI_API_KEY` pela sua chave de API do OpenAI:
     ```plaintext
     OPENAI_API_KEY=YOUR_OPENAI_API_KEY
     ```

4. **Execução do Código**:
   - No terminal, navegue até o diretório do projeto.
   - Execute o comando `node index.js` para iniciar o script.

#### Estrutura do Projeto

- **index.js**: Arquivo principal do projeto que contém todo o código para coletar e analisar os comentários.
- **.env**: Arquivo de configuração que armazena a chave de API do OpenAI.
- **responses.txt**: Arquivo gerado pelo script contendo as respostas da análise de cada comentário.
- **summary.txt**: Arquivo gerado pelo script contendo o resumo dos resultados da análise.

