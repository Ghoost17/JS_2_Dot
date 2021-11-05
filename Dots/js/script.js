$(document).ready(function(){
    let circle1 = $('.circle'),
    on = $('.on'),
    circle2 = $('.circle2'),
    dot =  $('.dot'),
    currenttime = Date.now(),
     a = 200,
     b = 100,
     c = ( Math.sqrt(a*a-b*b)),
     x1 = '',
     y1 = '',
     x2 = '',
     y2 = '',
     
     alpha = 2*3.14;

     let G = 6.674 * Math.pow(10,-11),
     m1 = 10,
     m2 = 10,
     M = (m1*m2)/(m1+m2);
     

    function drawPosition(t){
        circle1.css({'left':x1,'top':y1});
        x1 = a + a * Math.cos(alpha*t);
        y1 = 180 + b * Math.sin(-alpha*t);

        circle2.css({'left':x2,'top':y2});
        x2 = 2*c + a * Math.cos(alpha*(t+1000));
        y2 = 180 + b * Math.sin(-alpha*(t+1000));

        dot.css({'left':(x1+x2)/2,'top':(y1+y2)/2});
    }
        
    

   setInterval(function()
   {
        let t = Date.now()-currenttime;
        drawPosition(t);
        
    },1);
  
});

