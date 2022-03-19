$(document).ready(function()
{
    var timer = null; 
    const
    circle1 = $('.circle'),
    circle2 = $('.circle2'),
    dot =  $('.dot'),
    a1 = 200, 
    b1 = 100;
///
    let
    x1 = 0, 
    y1 = 0,
    x2 = 0, 
    t = 0,
    y2 = 0;
    const
//=======Start param========
//Coords dots  1 and 2 +
    x10 = -80, y10 = 0,
    x20 = 80, y20 = 0,
    vx10 = 0, vy10 = 0.05,
    vx20 = 0, vy20 = -0.05,
//Mass +
    m1 = 1, m2 = 1,
    m = m1 + m2,
//Const +
    G =  1,
    k = G * m,
//Vector r(0) and r'(0)
    r10 = x20 - x10,
    r20 = y20 - y10,
    vr10 = vx20 - vx10,
    vr20 = vy20 - vy10,
//Distances 
    r0_2 = r10 * r10 + r20 * r20,
    r0 = Math.sqrt(r0_2),
    v0_2 = vr10 * vr10 + vr20 * vr20,
    v0 = Math.sqrt(v0_2),

//интегралы
    c = r10 * vr20 - r20 * vr10, //Площади
    h = v0_2 - 2 * k / r0, //Энергии 
//Вектор Лапласа
    f1 = k * r10 / r0 - c * vr20,
    f2 = k * r20 / r0 + c * vr10,
//Параметры Элипса
    p = c * c / k,
    e = Math.sqrt(f1 * f1 + f2 * f2) / k,
    a = p / (1 - e*e),
    b = p / Math.sqrt(1 - e*e), 
//Углы
    nu0 = Math.acos((p/r0-1)/e),
    n = Math.sqrt(k/(a*a*a)),
    T = 2*Math.PI / n,
//Аномалии
    E0 = Math.acos(r0 * Math.cos(nu0) / a + e),
    M0 = E0 - e * Math.sin(E0),
    tau = -M0 / n ; //Pericenter passTime

////////////Решаем численно уравнение Кеплера//////////////////////////////////////
    const Solve_Kepler = function(e,M)
    {  
        let eps = 0.0001,
            En = E0,
            En1 = E0+1;
        while (true)
        {
           En1 = M + e*Math.sin(En);
           if (Math.abs(En1-En)<eps)
           { 
               break;
           };
           En = En1;
        }
       
      return En; 
    };
/////////////////////////////////////////////////

    let sign = 1;
    let sin_is_increasing = true;
    let last_r_sin_nu = undefined;
//////////////////////////////////////////////
    function drawEllipse(ctx, x, y, a,b,color) {
        ctx.beginPath();
        ctx.save(); // сохраняем стейт контекста
        ctx.translate(x, y); // перемещаем координаты в центр эллипса
       // ctx.rotate(angle); // поворачиваем координатную сетку на нужный угол
        ctx.scale(1, b/a); // сжимаем по вертикали
        ctx.arc(0, 0, a, 0, Math.PI*2); // рисуем круг
        ctx.restore(); // восстанавливает стейт, иначе обводка и заливка будут сплющенными и повёрнутыми
        ctx.strokeStyle = color;
        ctx.stroke(); // обводим
        ctx.closePath();
    }
///////////////////////////////////////////////////////////////
    const drawPosition = function(t)
    {
        let M = n * (t-tau),
            E = Solve_Kepler(e,M),
            cos_E = Math.cos(E),
            r_cos_nu = a * (cos_E - e),
            e_cos_nu = (e*e - 1) / (e * cos_E - 1) - 1,
            r = r_cos_nu * e / e_cos_nu,
            r2 = r*r,
            r2_diff = r2 - r_cos_nu * r_cos_nu,
            r_sin_nu = sign * Math.sqrt( Math.abs(r2_diff) ),
            omega = c / r2;
//Выбор знака у синуса, для верно го направления движения объектов
        if (last_r_sin_nu !== undefined)
        {
            if (Math.abs(r_sin_nu) < 0.1 * r)
            {
                if (last_r_sin_nu > r_sin_nu && sin_is_increasing
                    ||  last_r_sin_nu < r_sin_nu && !sin_is_increasing)
                {
                    r_sin_nu = -r_sin_nu;
                    sign = -sign;
                }
            }
            else if (Math.abs(r_sin_nu) > 0.9 * r)
            {
                if (last_r_sin_nu > r_sin_nu && sin_is_increasing
                    ||  last_r_sin_nu < r_sin_nu && !sin_is_increasing)
                {
                    sin_is_increasing = !sin_is_increasing;
                }
            }
        }
        last_r_sin_nu = r_sin_nu;
//Считаем координаты тел
        
        x1 = 2*(a1 + m1 * r_cos_nu / m);
        y1 = 2*(b1 + m1 * r_sin_nu / m);
        circle1.css({'left':x1,'top':y1});

        x2 = 2*(a1 - m2 * r_cos_nu / m);
        y2 = 2*(b1 - m2 * r_sin_nu / m); 
        circle2.css({'left':x2,'top':y2});
//Считаеем координаты центра масс
        dot.css({'left':(x1+x2)/2 + 12.5,'top':(y1+y2)/2 + 12.5});
//выводим все значения переменных, которые нам нужны, на экран
        document.getElementById("x1").innerHTML = x1.toFixed(2);
        document.getElementById("y1").innerHTML = y1.toFixed(2);
        document.getElementById("x2").innerHTML = x2.toFixed(2);
        document.getElementById("y2").innerHTML = y2.toFixed(2);
        document.getElementById("ti").innerHTML = t;
        document.getElementById("ex").innerHTML = e.toFixed(2);
        /////////////////////////////////////////////////////////
        var ctx = document.getElementById("canvass").getContext("2d");
        //ctx.globalCompositeOperation = 'destination-over';
        //ctx.clearRect(0,0,825,425);
        ctx.fillStyle = '#B1FFF0';
        ctx.fillRect(0,0,825,425);

        drawEllipse(ctx,(x1+x2)/2+25,(y1+y2)/2,a,b,'red');
        drawEllipse(ctx,(x1+x2)/2-25,(y1+y2)/2,a,b,'blue');

        ctx.beginPath();
        ctx.arc(x1, y1, 7.5, 0, 2 * Math.PI);
        ctx.strokeStyle = 'blue';
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.stroke();


        ctx.beginPath();
        ctx.arc(x2, y2, 7.5, 0, 2 * Math.PI);
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc((x1+x2)/2 , (y1+y2)/2 , 2, 0, 2 * Math.PI);
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.stroke();
        ctx.save();
        


    }
        
    

  /* setInterval(function()
   {
        let t = Date.now()-currenttime;
        drawPosition(t);
        
    },8);*/
    

    $("#start").click(function()
    {
        if (timer !== null) return;
        timer = setInterval(function () 
        {
            t+=10;
            drawPosition(t);
            
        },10); 
    });

    $("#stop").click(function() 
    {
        clearInterval(timer);
        timer = null
    });

});

