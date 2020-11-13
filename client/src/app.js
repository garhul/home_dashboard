import React from 'react';
// import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { WidgetList} from './components/widgets';
import Widgets from './data/widgets';
// init WS and bind data to it 

class App extends React.Component {
  constructor(props) {
    super(props);    
    this.state = { selected: [] };
    
    Widgets.onUpdate(() => { 
      this.forceUpdate();
    });
  }

  onSelected(widget) {
    console.log(widget);

    const index = this.state.selected.findIndex(el => el.ip === widget.ip);
    if (index === -1) {
      this.state.selected.push(widget);
    } else {
      this.state.selected.splice(index, 1);
    }    

    this.setState({ ...this.state });

  }

  render() {    
    return (              
      <div id="AppContainer">
        <WidgetList onSelected={(wg) => this.onSelected(wg)} selected widgets={Widgets.getAll()}></WidgetList>
      </div >
    );
  }
}



export default App;
