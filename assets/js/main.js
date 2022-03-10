//[DEVELOPMENT NOTE] 70548445052

(() => {//Arrow function autoinvocável por proteção das funções
    const input = document.querySelector('#input');
    const button = document.querySelector('button');

    input.addEventListener('keydown', e => {
        if (e.keyCode === 13) {//Enter
            validateCPF();
        }

        if (e.keyCode === 8) {//Backspace
            input.value = '';
            input.style.backgroundColor = 'white';
        }

        if(input.value.length === 3 || input.value.length === 7){
            input.value += '.';
        }

        if(input.value.length === 11){
            input.value += '-';
        }
    });

    button.addEventListener('click', () => validateCPF());

    function validateCPF() {//Função principal na qual é dado se o CPF é ou não válido
        function CPF(value) {//Constructor function para retornar o CPF 'limpo' caso dê tudo certo
            Object.defineProperty(this, 'cleanedCPF', {
                get: () => {
                    return value.replace(/\D+/g, '');
                }
            });
        }

        CPF.prototype.test = function () {//Testa se a entrada de dados é válida
            //Não utilizei Arrow function por conta da sua interação com o this
            if (typeof this.cleanedCPF === 'undefined' || this.cleanedCPF.length !== 11 || this.sequencial()) return false;//Caso o valor seja vazio ou de tamanho diferente do esperado
            const slicedCPF = this.cleanedCPF.slice(0, -2);

            const firstDigit = this.calculate(slicedCPF);
            const secondDigit = this.calculate(slicedCPF + firstDigit);

            const testedCPF = slicedCPF + firstDigit + secondDigit;

            if (this.cleanedCPF === testedCPF) return true;

            return false;
        }

        CPF.prototype.calculate = function (parcialCPF) {//Faz o calculo do CPF
            //Não utilizei Arrow function por conta da sua interação com o this

            const arrayOfCPF = Array.from(parcialCPF);

            const sum = arrayOfCPF.reduce((accumulator, value, index, baseArray) => {
                accumulator += value * (baseArray.length + 1 - index)
                return accumulator;
            }, 0);

            return 11 - (sum % 11) > 9 ? 0 : 11 - (sum % 11);
        }

        CPF.prototype.sequencial = function () {
            return this.cleanedCPF[0].repeat(11) === this.cleanedCPF;
        }

        CPF.prototype.responseCPF = function (response) {
            if (response === true) {
                input.style.backgroundColor = 'rgba(0, 128, 0, 0.8)';
            } else {
                input.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            }
        }

        const validCPF = new CPF(input.value);//Criação do objeto do CPF valido

        validCPF.responseCPF(validCPF.test());
    }
})();