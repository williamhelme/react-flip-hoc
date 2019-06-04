import styled from "styled-components";
import without from "lodash.without";

const composeStyledComponent = (value, ...rest) => BaseComponent =>
  styled(BaseComponent)(value, ...rest);

const flipStyles = `
height: inherit;

.flip-container {
  -webkit-perspective: 1000;
  -moz-perspective: 1000;
  -o-perspective: 1000;
  perspective: 1000;
}

.flip-container, .front, .back {
  width: 100%;
  height: inherit;
}

.flipper {
  -moz-transform: perspective(1000px);
  -moz-transform-style: preserve-3d;

  position: relative;
}

.front, .back {
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  backface-visibility: hidden;

  -webkit-transition: 0.6s;
  -webkit-transform-style: preserve-3d;

  -moz-transition: 0.6s;
  -moz-transform-style: preserve-3d;

  -o-transition: 0.6s;
  -o-transform-style: preserve-3d;

  -ms-transition: 0.6s;
  -ms-transform-style: preserve-3d;

  transition: 0.6s;
  transform-style: preserve-3d;

  position: absolute;
  height: inherit;
  top: 0;
  left: 0;
}

.back {
  -webkit-transform: rotateY(-180deg);
  -moz-transform: rotateY(-180deg);
  -o-transform: rotateY(-180deg);
  -ms-transform: rotateY(-180deg);
  transform: rotateY(-180deg);
  order: 0;
}

.flip-container.flip .back {
  -webkit-transform: rotateY(0deg);
  -moz-transform: rotateY(0deg);
  -o-transform: rotateY(0deg);
  -ms-transform: rotateY(0deg);
  transform: rotateY(0deg);
}

.flip-container.flip .front {
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
  -o-transform: rotateY(180deg);
  transform: rotateY(180deg);
}


.front {
  order: 1;
  z-index: 2;
}
`;

const FlipHOC = () => {
  return function(FrontComponent, BackComponent) {
    const enhance = composeStyledComponent(flipStyles);

    class HOC extends React.Component {
      constructor(props) {
        super(props);
        this.flipRef = {};
        this.state = {};

        this.performFlip = this.performFlip.bind(this);
      }
      performFlip(className) {
        if (this.props.className === className) {
          this.flipRef[this.props.className].classList.toggle("flip");
        }
      }

      componentDidMount() {
        const { position, className } = this.props;
        if (position === "back") {
          this.performFlip(className);
        }
      }

      render() {
        const { className = "" } = this.props;

        return (
          <div className={`${className}`}>
            <div
              className={`flip-container`}
              ref={ref => (this.flipRef[this.props.className] = ref)}
            >
              <div className={`flipper`}>
                <div className={`front`}>
                  <FrontComponent
                    {...without(this.props, "className")}
                    performFlip={this.performFlip(this.props.className, "back")}
                    style={this.props.style}
                  />
                </div>
                <div className={`back`}>
                  <BackComponent
                    {...without(this.props, "className")}
                    performFlip={this.performFlip(
                      this.props.className,
                      "front"
                    )}
                    style={this.props.style}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    return enhance(HOC);
  };
};

export default FlipHOC;
