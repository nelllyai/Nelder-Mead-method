class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function addition(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

function subtraction(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

function multiplication(p, v) {
    return new Point(p.x * v, p.y * v);
}

function f(p) { // функция Розенброка
    return 100 * Math.pow((Math.pow(p.x, 2) - p.y), 2) + Math.pow((1 - p.x), 2);
}

let e = 0.0001;
let a = 1; // коэффициент отражения
let b = 3; // коэффициент растяжения
let g = 0.3; // коэффициент сжатия

// начальный набор точек
let Xfirst = [new Point(-1.2, 1), new Point(-0.2, 1), new Point(-1.2, 2)];

let list = document.querySelector("ul");

list.children[0].innerHTML += `(${Xfirst[0].x}, ${Xfirst[0].y})`;
list.children[1].innerHTML += `(${Xfirst[1].x}, ${Xfirst[1].y})`;
list.children[2].innerHTML += `(${Xfirst[2].x}, ${Xfirst[2].y})`;
list.children[3].innerHTML += e;
list.children[4].innerHTML += a;
list.children[5].innerHTML += b;
list.children[6].innerHTML += g;

nelder_mead(f, Xfirst, e, a, b, g);

function nelder_mead(f, X, eps, alpha, beta, gamma) {
    let area = document.querySelector("textarea");
    area.innerHTML = `Начало работы алгоритма\n\n`;
    
    let k = 1;
    let final = false;

    do {
        // сортировка точек по значению функции
        X.sort((p1, p2) => f(p1) - f(p2));

        let b = X[0], // "лучшая" точка
            g = X[1], // "средняя" точка
            w = X[2]; // "худшая" точка

        area.innerHTML += `\n${k}.`;
        area.innerHTML += ` X${k} = (${b.x.toFixed(2)}, ${b.y.toFixed(2)}) Q(X${k}) = ${f(b).toFixed(2)}`;

        // центр тяжести
        let C = multiplication(addition(g, b), 0.5);

        // операция отражения
        let U = addition(C, multiplication(subtraction(C, w), alpha));

        if (f(b) <= f(U) && f(U) <= f(g)) {
            w = U;

            let c = multiplication(addition(w, C), 0.5);
            if (f(c) < f(w)) w = c;
        }

        else if (f(U) < f(b)) {
            //операция растяжения
            let V = addition(C, multiplication(subtraction(U, C), beta));

            if (f(V) < f(U)) w = V;
            else w = U;
        }

        else {
            // операция сжатия
            let W;

            if (f(U) < f(w)) W = addition(C, multiplication(subtraction(U, C), gamma));
            else W = addition(C, multiplication(subtraction(w, C), gamma));

            if (f(W) < Math.min(f(w), f(U))) w = W;
        }

        k++;

        let stop = Math.sqrt((1 / 3) * (Math.pow(f(X[1]) - f(X[0]), 2) + Math.pow(f(X[2]) - f(X[0]), 2)));
        
        final = stop <= eps ? !final : final;

        // обновление точек
        X[0] = w;
        X[1] = g;
        X[2] = b;
    } while(!final);

    area.innerHTML += `\n\nКонец работы алгоритма\nОтвет:`;
    area.innerHTML += `\nX* = (${X[2].x.toFixed(2)}, ${X[2].y.toFixed(2)})`;
    area.innerHTML += `\nQ(X*) = ${f(X[2]).toFixed(2)}`;
}