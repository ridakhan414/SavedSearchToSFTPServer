/** 

*@NApiVersion 2.1

*@NScriptType ScheduledScript 

*/

define(['N/record', 'N/search', 'N/task', 'N/file'],

    function (record, search, nTask, file ) {

        function execute(task) {

            //var SEARCH_ID = search.load({ id: 'customsearch_reverseChargeSales' }) //load the saved search 

            var SEARCH_ID = 768

            var searchTask = task.create({
                taskType: task.TaskType.SEARCH
            })

            searchTask.savedSearch = SEARCH_ID;

            var path = 'ExportFolder/export.csv';
            searchTask.filePath = path;

            var searchTaskId = searchTask.submit();

           log.debug("searchTaskId", searchTaskId)

        }

        return {

            execute: execute

        };

    }); 