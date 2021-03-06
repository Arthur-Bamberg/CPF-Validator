(() => {//Arrow function autoinvocável por proteção das funções
    const input = document.querySelector('#input');
    const button = document.querySelector('button');

    input.addEventListener('keydown', e => {
        if (e.keyCode === 13) {//Enter
            validateCPF();//Chama a função principal que praticamente faz tudo
        }

        if (e.keyCode === 8) {//Backspace
            input.value = '';//Limpa o input
            input.style.backgroundColor = 'white';//Deixa a cor do input branca para desfazer a cor do resultado
        }

        if(input.value.length === 3 || input.value.length === 7){//Adiciona os pontos nos digitos do CPF
            input.value += '.';
        }

        if(input.value.length === 11){//Adiciona o traço no CPF
            input.value += '-';
        }
    });

    button.addEventListener('click', () => validateCPF());//No clique do botão

    function validateCPF() {//Função principal na qual é dado se o CPF é ou não válido
        function CPF(value) {//Constructor function para retornar o CPF 'limpo' caso dê tudo certo
            Object.defineProperty(this, 'cleanedCPF', {//Cria a propriedade cleanedCPF
                get: () => {
                    return value.replace(/\D+/g, '');//Tira o que não for número
                }
            });
        }

        CPF.prototype.test = function () {//Testa se a entrada de dados é válida
            //Não utilizei Arrow function por conta da sua interação com o this
            if (typeof this.cleanedCPF === 'undefined' || this.cleanedCPF.length !== 11 || this.sequencial()) return false;//Caso o valor seja vazio ou de tamanho diferente do esperado
            const slicedCPF = this.cleanedCPF.slice(0, -2);//Tira os primeiros 9 dígitos para executar o cálculo do décimo

            const firstDigit = this.calculate(slicedCPF);//Calcula o penúltimo dígito com os 9 anteriores
            const secondDigit = this.calculate(slicedCPF + firstDigit);//Calcula o último dígito com os 10 anteriores (9 puros, 1 calculado)

            const testedCPF = slicedCPF + firstDigit + secondDigit;//Gera um CPF testado (correto)

            if (this.cleanedCPF === testedCPF) return true;//Se for igual retorna verdadeiro

            return false;//Caso não seja igual retorna falso
        }

        CPF.prototype.calculate = function (parcialCPF) {//Faz o calculo do CPF
            //Não utilizei Arrow function por conta da sua interação com o this

            const arrayOfCPF = Array.from(parcialCPF);//Cria um vetor com os números

            const sum = arrayOfCPF.reduce((accumulator, value, index, baseArray) => {//Calcula a soma dos valores multiplicados por números de 11 ou 10 à 2 de forma decrescente
                accumulator += value * (baseArray.length + 1 - index);
                return accumulator;
            }, 0);

            return 11 - (sum % 11) > 9 ? 0 : 11 - (sum % 11);//11 - (o resto da soma de onze), e caso o resultado seja maior que 9 então é 0
        }

        CPF.prototype.sequencial = function () {//Retira os CPF sequenciais que no cálculo são válidos, mas na vida real não
            return this.cleanedCPF[0].repeat(11) === this.cleanedCPF;//Primeiro dígito repetido em relação ao CPF informado
        }

        CPF.prototype.responseCPF = function (response) {//Dá a resposta de acordo com os testes feitos
            if (response === true) {//Caso seja válido 
                input.style.backgroundColor = 'rgba(0, 128, 0, 0.8)';//Deixa o input verde
            } else {//Caso não
                input.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';//Deixa o input vermelho
            }
        }

        const validCPF = new CPF(input.value);//Criação do objeto do CPF válido

        validCPF.responseCPF(validCPF.test());//Executa a resposta de acordo com os testes
    }
})();