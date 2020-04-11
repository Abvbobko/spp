
class DataManipulator {
    get_status_map(status_db_table) {
        let status_map = new Map();
        status_db_table.forEach(function(status) {
            status_map.set(status.id, status.name);
        });
        return status_map;             
    }    

    status_id_to_name(tasks, status_map) {        
        tasks.forEach(task => {            
            task.status = status_map.get(task.STATUSES_id);
        });
        return tasks;
    }

    get_key_by_value(searched_value, map) {
        for (let [key, value] of map.entries()) {
            if (value == searched_value)
                return key;
        }
        console.log(111);
        return null;
    }
}

manipulator = new DataManipulator();

module.exports = { manipulator };