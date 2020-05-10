var React = require('react');

class TasksList extends React.Component {
    render() {
        return (
            <div>
                <form method="POST" className="task">                            
                    <span className="task-item big-text">task.text</span>
                    <div className="task-item">date</div>                
                    <div className="task-item <%= task.status %>">Status: status</div> 
                    <div className="task-item">file_name</div>                                                           
                    <div className="task task-buttons">
                        <button type="submit" className="task-item fa fa-edit button" ></button>  
                        <button type="submit" className="task-item fa fa-trash-o button" name="task_id"></button>                                                            
                    </div>
                </form>                            
            </div>
        );
    }
}

module.exports = TasksList;


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