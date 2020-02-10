export default function sketch (p) {
    let rotation = 0;
  
    p.setup = function () {
        p.createCanvas(150, 150);
        p.background(0);
    };
  
    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
      if (props.rotation){
        rotation = props.rotation * Math.PI / 180;
      }
    };
  
    p.draw = function () {
        p.background(0);
    };
  };
  