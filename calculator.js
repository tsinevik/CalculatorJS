(function () {

    function add(a, b) {
        return a + b;
    }

    function subtract(a, b) {
        return a - b;
    }

    function multiply(a, b) {
        return a * b;
    }

    function divide(a, b) {
        if (Number.isFinite(a / b)) return a / b;
        return "Division by 0 Exception!";
    }

    function operate(a, b, sign) {
        a = parseFloat(a);
        b = parseFloat(b);
        switch (sign) {
            case '+':
                return add(a, b);
            case '-':
                return subtract(a, b);
            case '*':
                return multiply(a, b);
            case '/':
                return divide(a, b);
            default:
                break;
        }
    }

    function evalExpr(rpn) {
        let resultStack = [];

        for (let token of rpn) {
            if (isNaN(token)) {
                let b = resultStack.pop();
                let a = resultStack.pop();
                resultStack.push(operate(a, b, token));

                if (isNaN(resultStack[resultStack.length - 1])) break;
            } else {
                resultStack.push(token);
            }
        }

        return resultStack.pop();
    }

    function parse() {
        let displayMemory = display.textContent.split(' ');

        if (displayMemory.includes('')) display.textContent = 'ERROR';

        else if (displayMemory.length > 2) {

            for (let token of displayMemory) {
                if (isNaN(token)) {
                    while (
                        opStack.length > 0 && opPrecedence[opStack.slice(-1)[0]] >= opPrecedence[token]
                        ) {
                        outQueue.push(opStack.pop());
                    }
                    opStack.push(token);
                } else {
                    outQueue.push(token);
                }
            }

            outQueue = [...outQueue, ...opStack.reverse()];

            let answer = evalExpr(outQueue);
            display.textContent = isNaN(answer) ? answer : parseFloat(answer.toFixed(10));
        }
        isAnswer = true;
        clearCache();
    }

    function pressNumber(number) {
        if (isAnswer) {
            isAnswer = false;
            display.textContent = '';
        }
        if (display.textContent === '0') display.textContent = '';
        if (display.textContent.slice(-2) === ' 0' && number !== '.') display.textContent = display.textContent.slice(0, -1);
        if (this.textContent === '.') {
            if (isDecimal) isDecimal = false;
            else return;
        }
        display.textContent += number;
    }

    function pressOperator(operator) {
        if (/[a-zA-Z]/.test(display.textContent)) display.textContent = '0';
        else if (display.textContent.slice(-1) === ' ') display.textContent = display.textContent.slice(0, -3);
        display.textContent += ' ' + operator + ' ';
        isAnswer = false;
        isDecimal = true;
    }

    function clearCache() {
        outQueue = [];
        opStack = [];
        isDecimal = true;
    }

    function clearAll() {
        display.textContent = '0';
        clearCache();
    }

    function removeLastSymbol() {
        if (display.textContent.length > 1) {
            if (display.textContent.slice(-1) === ' ') {
                display.textContent = display.textContent.slice(0, -3);
            } else {
                display.textContent = display.textContent.slice(0, -1);
            }
        } else {
            display.textContent = '0';
        }
    }

    function supportKeyboard(e) {
        switch (e.key) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
            case '.':
                pressNumber(e.key);
                break;
            case '+':
            case '-':
            case '/':
            case '*':
                pressOperator(e.key);
                break;
            case 'Enter':
                parse();
                break;
            case 'Backspace':
                removeLastSymbol();
                break;
            case 'Escape':
                clearAll();
                break;
            default:
                break;
        }
    }

    document.addEventListener('keydown', supportKeyboard);

    const display = document.querySelector('.display');
    let isDecimal = true;
    let isAnswer = false;
    let outQueue = [];
    let opStack = [];
    const opPrecedence = {
        "*": 4,
        "/": 4,
        "+": 3,
        "-": 3
    };

    const equals = document.querySelector('.equals');
    equals.addEventListener('click', parse);

    const numbers = document.querySelectorAll('.number');
    numbers.forEach(number => number.addEventListener('click', function () {
        pressNumber(this.textContent);
    }));

    const operators = document.querySelectorAll('.operator');
    operators.forEach(operator => operator.addEventListener('click', function () {
        pressOperator(this.textContent);
    }));

    const clear = document.querySelector('.clear');
    clear.addEventListener('click', clearAll);

    const backspace = document.querySelector('.backspace');
    backspace.addEventListener('click', removeLastSymbol);
})();