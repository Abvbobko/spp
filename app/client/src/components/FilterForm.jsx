var React = require('react');
var sc = require('../server_connector.jsx').sc;

class FilterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            statuses: [],
          };          
    }

    componentDidMount(){
        sc.get_statuses().then(
            statuses => this.setState({ statuses: statuses.statuses })
        );
        // sc.get_tasks().then(data => this.setState({tasks: data }));
    }

    render() {
        return (
            <div>
                <form action="/filter" method="POST" id="filter_form">     
                    <div className="task filter-form">
                        <div className="task-item filter-form-item">
                            <label htmlFor="status">Status filter:</label>
                            <select id="status" name="status" defaultValue="all" form="filter_form" className="task-item select-list enter-field">
                                <option value="all">all</option> 
                                {
                                    this.state.statuses.map(function(status){                        
                                        return <option value={status}>{status}</option>
                                    })    
                                }
                            </select>
                        </div>
                        <input type="submit" value="Show" className="task-item filter-form-item button" />
                    </div>
                </form>
            </div>
        );
    }
}

module.exports = FilterForm;


// constructor(props) {
//     super(props);
//     var name = props.name;
//     var nameIsValid = this.validateName(name);
//     var age = props.age;
//     var ageIsValid = this.validateAge(age);
//     this.state = {name: name, age: age, nameValid: nameIsValid, ageValid: ageIsValid};

//     this.onNameChange = this.onNameChange.bind(this);
//     this.onAgeChange = this.onAgeChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }
//     validateAge(age){
//         return age>=0;
//     }
//     validateName(name){
//         return name.length>2;
//     }
//     onAgeChange(e) {
//         var val = e.target.value;
//         var valid = this.validateAge(val);
//         this.setState({age: val, ageValid: valid});
//     }
//     onNameChange(e) {
//         var val = e.target.value;
//         console.log(val);
//         var valid = this.validateName(val);
//         this.setState({name: val, nameValid: valid});
//     }

//     handleSubmit(e) {
//         e.preventDefault();
//         if(this.state.nameValid ===true && this.state.ageValid===true){
//             alert("Имя: " + this.state.name + " Возраст: " + this.state.age);
//         }
//     }

//     render() {
//         // цвет границы для поля для ввода имени
//         var nameColor = this.state.nameValid===true?"green":"red";
//         // цвет границы для поля для ввода возраста
//         var ageColor = this.state.ageValid===true?"green":"red";
//         return (
//             <form onSubmit={this.handleSubmit}>
//                 <p>
//                     <label>Имя:</label><br />
//                     <input type="text" value={this.state.name} 
//                         onChange={this.onNameChange} style={{borderColor:nameColor}} />
//                 </p>
//                 <p>
//                     <label>Возраст:</label><br />
//                     <input type="number" value={this.state.age} 
//                         onChange={this.onAgeChange}  style={{borderColor:ageColor}} />
//                 </p>
//                 <input type="submit" value="Отправить" />
//             </form>
//         );
//       }