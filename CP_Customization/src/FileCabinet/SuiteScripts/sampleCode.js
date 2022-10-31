/** 

*@NApiVersion 2.1

*@NScriptType ScheduledScript 

*/

define(['N/record', 'N/search', 'N/task', 'N/file'],

    function (record, search, nTask, file ) {

        function execute(scriptContext) {

            var searchObj = search.load({ id: 'customsearch_reverseChargeSales' }) //load the saved search 


            

            searchObj.run().each(function (result) {

                var internalid = result.getValue({
                    name: "internalid",
                    sort: search.Sort.ASC
                })
                // var soId = record.submitFields({

                //     type: record.Type.SALES_ORDER,

                //     id: result.id,

                //     values: {

                //         memo: 'Reverse Charge'

                //     }

                // });

            });

        }

        function createcsvcontent(columns, firstsearchResult) {

            //Creating arrays that will populate results
            var content = new Array();

            var headers = new Array();
            var temp = new Array();
            var x = 0;

            for (var i = 0; i < columns.length; i++) {
                headers[i] = columns[i].label;


            }

            content[x] = headers;
            x = 1;

            for (var i = 0; i < firstsearchResult.length; i++) {

                var result = firstsearchResult[i];
                for (var y = 0; y < columns.length; y++) {

                    if (result.getText(columns[y]) != '' && result.getText(columns[y]) != ' ' && result.getText(columns[y]) != null) {
                        var searchResult = result.getText(columns[y]);
                        if (searchResult != null) {

                            searchResult = searchResult.toString().replace("undefined", "");
                            searchResult = searchResult.toString().replace("false", "No");
                            searchResult = searchResult.toString().replace("true", "Yes");
                        }

                        temp[y] = searchResult;


                    }
                    else {


                        var searchResult = result.getValue(columns[y]);
                        if (searchResult != null) {

                            searchResult = searchResult.toString().replace("undefined", "");
                            searchResult = searchResult.toString().replace("false", "No");
                            searchResult = searchResult.toString().replace("true", "Yes");

                            temp[y] = searchResult;


                        }//searchResult!=null


                    }//else


                } //y

                content[x] += temp;
                x++;


            }//i

            var contents = '';

            for (var z = 0; z < content.length; z++) {
                contents += content[z].toString() + '\n';
            }
            log.debug('contents before', contents);
            if (contents != '') {
                contents = contents.toString().replace(/undefined/g, "");
                contents = contents.toString().replace(/’/g, '');
            }
            log.debug('contents after', contents);

            return contents;

        }

        function createcsvfile(start_name,contents) {
    	
            var file_date = new Date();
            
            file_date.setDate(file_date.getDate()-1);
             
             var file_dd = file_date.getDate();
             
             if(file_dd<10)
                 {
                 
                 file_dd = '0'+file_dd;
                 }
             
             var file_mm = file_date.getMonth();
             file_mm++;
             if(file_mm<10)
            {
            
                 file_mm = '0'+file_mm;
            }
             
             var file_yy = file_date.getFullYear()-2000;
             file_yy = parseFloat(file_yy).toFixed(0);
             
             var final_file_name = start_name+file_mm+file_dd+file_yy;//start_name+file_dd+file_mm+file_yy;
             
             var id = 0;
             
             try
             {
             var fileObj = file.create({
                 name: final_file_name+'.csv',
                 fileType: file.Type.CSV,
                 contents: contents,
                 encoding: file.Encoding.UTF8,
                 //description: 'This is description',
                 folder: folderid//SFTP CSV
                });
                
                id = fileObj.save();
              //  log.debug('id',id );

              //---- Task Module ----

              var taskRecord = nTask.create({
                taskType: nTask.TaskType.SCHEDULED_SCRIPT,
                scriptId: 1321321,                              // Change to your Scheduled Script's Internal ID
                params: {
                    'param1': 'value1',
                    'param2': 'value2'
                }
            });

            // Submits Scheduled Script to NetSuite's Scheduling queue
            var taskId = taskRecord.submit();

            log.debug({
                title: 'execute()',
                details: 'execute() :: Scheduled Script rescheduled with task ID: ' + taskId
            });

            log.debug({
                title: 'execute()',
                details: 'execute() :: terminate'
            }); 

            //--------------------------------------------------
             }
             
             catch (e) { // incase the folder is not present
                 
                 var fileObj = file.create({
                     name: final_file_name+'.csv',
                     fileType: file.Type.CSV,
                     contents: contents,
                     encoding: file.Encoding.UTF8,
                     
                    });
                    
                    id = fileObj.save();
               // TODO: handle exception
           }
                return id;
            
           
       }

        return {

            execute: execute

        };

    }); 