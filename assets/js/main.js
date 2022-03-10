(() => {
    const input = document.querySelector('#input');
    const button = document.querySelector('button');

    input.addEventListener('keydown', e => {
        if (e.keyCode === 13) {
            validateCPF();
        }
    });

    button.addEventListener('click', () => validateCPF());

    function validateCPF() {
        const CPF = (() => {
            if (input.value.length < 12 || input.value.length > 15)return error();

            for (let index = 0; index < input.value.length; index++) {
                if (input.value[index] !== '.' || input.value[index] !=='-') {
                    const value = input.value.replace(/\D+/g, '');

                    if(Number(value) === NaN)return error();
                    return value;
                }
            }
            if(Number(input.value) === NaN)return error();
            return input.value;
        })();

        if(CPF === undefined)return;

        //Feita apenas a parte da formatação de dados
        //[IMPORTANTE!!!] Rever o vídeo para utilizar prototypes e etc
    }

    function error(){
        input.value = "";
        alert("[ERRO] Informe um valor de CPF válido!!!");
    }
})();