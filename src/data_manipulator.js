
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
            console.log(task.STATUSES_id, status_map.get(task.STATUSES_id));
            task.status = status_map.get(task.STATUSES_id);
        });
        return tasks;
    }
}

manipulator = new DataManipulator();

module.exports = { manipulator };