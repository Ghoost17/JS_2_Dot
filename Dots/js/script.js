$(document).ready(function()
{
    let circle1 = $('.circle'),
    circle2 = $('.circle2'),
    dot =  $('.dot'),
    currenttime = Date.now(),
    a1 = 200, 
    b1 = 100,
    c1 = ( Math.sqrt(a1*a1-b1*b1)),
    x1 = '', 
    y1 = '',
    x2 = '',
    y2 = '',
    alpha = 0.002 * Math.PI,
//=======Start param========
//Coords dots  1 and 2 +
    x10 = -1, y10 = 1,
    x20 = -3, y20 = 2,
    vx10 = 1, vy10 = 1,
    vx20 = 2, vy20 = 3,
//Mass +
    m1 = 1, m2 = 1,
    m = m1 + m2,
//Const +
    G = 6.674e-11,
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

//Integralls
    c = r10 * vr20 - r20 * vr10, //Area
    //c = 1e-11,
    omega0 = c / r0_2,
    h = v0_2 - 2 * k / r0, //Energy 
//Vec Laplas
    f1 = k * r10 / r0 - c * vr20,
    f2 = k * r20 / r0 + c * vr10,
//Elipse param
    p = c * c / k,
    e = Math.sqrt(f1 * f1 + f2 * f2) / k,
    //e = 0.5,
    a = p / (1 - e*e),
    b = p / Math.sqrt(1 - e*e), 
//Angles
    nu0 = Math.acos((r0/p-1)/e),
    //n = Math.sqrt(k) * Math.pow(a, -1.5),
    n = Math.sqrt(k/(a*a*a)),
    T = 2*Math.PI / n,
//Anomalies
    E0 = Math.acos(r0 * Math.cos(nu0) / a + e),
    M0 = E0 - e * Math.sin(E0),
    tau = -M0 / n ; //Pericenter passTime
//////////////////////////////////////////////////
    function Solve_Kepler(e,M)
    {  
        let eps = 0.0000001,
            En = E0,
            En1 = E0+1;
        while (true)
        {
           En1 = M + e*Math.sin(En);
           if (Math.abs(En1-En)<eps)
           { 
               alert(En1);
               break;
           };
           En = En1;
           break;// Его тут быть не должно, но так как что-то не так с н.у. то оно уходит в вечный цикл
        }
       
      return 1;
    }

    function drawPosition(t)
    {
        let M = n * (t-tau),
            E = Solve_Kepler(e,M),
            cos_E = Math.cos(E),
            r_cos_nu = a * (cos_E - e),
            e_cos_nu = (e*e - 1) / (e * cos_E - 1) - 1,
            r = r_cos_nu * e / e_cos_nu,
            r2 = r*r,
            r_sin_nu = Math.sqrt( r_cos_nu * r_cos_nu - r2),//!!!!
            omega = c / r2;
            
        circle1.css({'left':x1,'top':y1});
        x1 = m1 * r_cos_nu / m;
        y1 = m1 * r_sin_nu / m;

        circle2.css({'left':x2,'top':y2});
        x2 = 2*c1 + a1 * Math.cos(alpha*(t+500));
        y2 = 180 + b1 * Math.sin(-alpha*(t+500));
       // alert(e);
        dot.css({'left':(x1+x2)/2,'top':(y1+y2)/2});
    }
        
    

   setInterval(function()
   {
        let t = Date.now()-currenttime;
        drawPosition(t);
        
    },8);
  
});

