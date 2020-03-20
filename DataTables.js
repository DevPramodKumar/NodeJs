var dbOperate = require('../config/connection')
var res;
var output = {};
var request = {};
var aColumns = [];
exports.Generate = (query, cb) => {
	    var sLimit = "";
		var sWhere=' WHERE 1 ';
		var sOrder = '';
		var tables='';
	    var get_cols='';
		res=query.response;
		request=query.request;
		if(typeof query.where!=='undefined'&&query.where!='')
		{
		sWhere +=query.where;
		}
		get_cols=query.cols;
		tables=query.table;
		aColumns=[];
        // Rendering columns
		 if(get_cols.trim()=='*')
		 {
			 dbOperate.readQuerys('SHOW COLUMNS FROM '+tables,
					function selectCb(err, results, fields){
						if(err){
							console.log(err);
						}
						var res_data=results;
						for(var i in res_data)
						{
							aColumns.push(res_data[i]['Field']);

						}
						get_cols=aColumns.join(',');
					});
			 }
			 else{
						var param_col=get_cols.split(',');
						for(var j in param_col)
						{
							aColumns.push(param_col[j].trim());
						}
						get_cols=aColumns.join(',');
			 }
			 
            //Ordering
            if(typeof request.body.iSortCol_0 !== 'undefined' &&request.body.iSortCol_0!='')
            {
                var ordering_col=aColumns[request.body.iSortCol_0];
                    if(typeof ordering_col!=='undefined'&&ordering_col!='')
                    {
                        if(ordering_col.includes(' as '))
                        {
                            var ordering=aColumns[request.body.iSortCol_0].split(' as ');
                            var orderCol=ordering[1];
                            sOrder = "ORDER BY "+orderCol+" "+request.body.sSortDir_0 +"";
                        }
                        else{
                            sOrder = "ORDER BY "+aColumns[request.body.iSortCol_0] +" "+request.body.sSortDir_0 +"";
                        }
                }
            }
            else if(typeof query.order_by!=='undefined' && query.order_by!='')
            {
                    sOrder = "ORDER BY "+query.order_by;
            }
            //Pagination
            if(request.body.iDisplayStart && request.body.iDisplayLength != -1)
            {
                sLimit = 'LIMIT ' +request.body.iDisplayStart+ ', ' +request.body.iDisplayLength;
            }
		 
			//Filtering
			if(request.body.sSearch && request.body.sSearch != "")
			{
				for(var i=0 ; i<aColumns.length; i++)
				{
					sWhere += aColumns[i]+ " LIKE " +"\'%"+request.body.sSearch+"%\'"+" OR ";
				}

			}

         //Main Queries
          var sQuery = "SELECT "+aColumns.join(',')+"  FROM "+tables+" "+sWhere+" "+sOrder+" "+sLimit +"";
          var iTotal = {};
		  var rResultTotal = {};
		  var aResultTotal = {};
         console.log(sQuery)
		  dbOperate.readQuerys(sQuery, function selectCb(err, results, fields){
		    if(err){
		      console.log(err);
		    }
	      var temp = [];
		  var aRow = results;
          var output1 = {};
	        output1.aaData1 = [];
	        for(var i in aRow)
	        {
	          for(Field in aRow[i])
	          {
	            //if(!aRow[i].hasOwnProperty(Field)) continue; 
	            temp.push(aRow[i][Field]);
	          }
                output1.aaData1.push(temp);
                temp = [];
			}
              sQuery = "SELECT COUNT(*)   FROM "+tables+" "+sWhere+" " ;
		      dbOperate.readQuerys(sQuery, function selectCb(err, results, fields){
		        if(err){
		          console.log(err);
				}

				//Render columns name for sColumns
                var sColumns_0=[];
				var render_col=get_cols.split(',');
				render_col.forEach(function (items,index) {
					if(items.includes(' as '))
					{
						var render_col1=items.split(' as ');
						sColumns_0[index]=render_col1[1];
					}
					else{
						sColumns_0[index]=items;
					} 
				})
				                get_cols=sColumns_0.join(',');
								rResultTotal = results;
								aResultTotal = rResultTotal;
								iTotal = aResultTotal[0]['COUNT(*)'];
								//cb(output);
                                output.sEcho=parseInt(request.body.sEcho);
                                output.iTotalRecords=iTotal;
                                output.iTotalDisplayRecords=iTotal;
								output.aaData=output1.aaData1;
								output.sColumns=get_cols;
								sendJSON(res, 200, output);
		      });
		});     
    }
    
    function sendJSON(res, httpCode, body)
    {
        var response = JSON.stringify(body);
        res.status(httpCode).send(response);
    }