	function ml_withDo(withArray,conditionFunction,doFunction)
	{
		for(var i=0;i<withArray.length;i++)
		{
			if(conditionFunction(withArray[i]))
			{
				doFunction(withArray[i]);
			}
		}
	}
	const must=1;
	const not=0;
	const pos=3;
	
	const up=0;
	const down=1;
	const left=2;
	const right=3;
	
	function ml_randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        default: 
            return 0; 
		} 
	} 


	function Ml_Position(x,y)
	{
		this.x=x;
		this.y=y;
		return this;
		
	}

	function Ml_Condition(id,student1,student2,mode,x,y)
	{
		//["前","后","左","右"];
		//["前","后","左","右"];
		//["相邻","不相邻","定位"];
		this.conditionId=id;
		this.student1=student1;
		this.student2=student2;
		this.mode=mode;
		this.position=Ml_Position(x,y);
		
		return this;
	}
	
	var ml_global={};
	(function ml_init(){
	ml_global.students=[];
	ml_global.visited={};
	ml_global.seats=[];
	ml_global.row=0;
	ml_global.line=0;
	ml_global.condition=[];
	ml_global.position={};
	})();
	function ml_creatTable(data)
	{
		var tableData="";
		for(var i=0;i<data.length;i++)
		{
			tableData+="<tr>";
			for(var j=0;j<data[i].length;j++)
				tableData+="<td>"+data[i][j]+"</td>";
			tableData+="</tr>"
		}
		return tableData;
	}
	function ml_creatOption(data,id,name)
	{
		var tableData='<select id="'+id+'" name="'+name+'">';
		for(var i=0;i<data.length;i++)
		{
			tableData+="<option value="+'"'+i+'"'+">";
			tableData+=data[i];
			tableData+="</option>";
		}
		tableData+="</select>";
		return tableData;
	}
	function ml_update()
	{
		document.getElementById("ml_must1").innerHTML=ml_creatOption(ml_global.students,"ml_optionMust1","ml_mustFirst");
		document.getElementById("ml_must2").innerHTML=ml_creatOption(ml_global.students,"ml_optionMust2","ml_mustSecond");
		document.getElementById("ml_not1").innerHTML=ml_creatOption(ml_global.students,"ml_optionNot1","ml_notFirst");
		document.getElementById("ml_not2").innerHTML=ml_creatOption(ml_global.students,"ml_optionNot2","ml_notFirst");
		document.getElementById("ml_pos").innerHTML=ml_creatOption(ml_global.students,"ml_optionPosition","ml_position");
	}
	function ml_addName_oc()
	{
		ml_global.students.push(ml_fromName.value);
		ml_studentJson.innerHTML=JSON.stringify(ml_global.students);
		ml_update();
	}
	function ml_inputJSON_oc()
	{
		if(JSON.parse(ml_fromJSON.value) instanceof Array)
		{
			ml_global.students=JSON.parse(ml_fromJSON.value);
			ml_studentJson.innerHTML=JSON.stringify(ml_global.students);
			ml_update();
		}
		else
		{
			alert("非法的JSON格式！");
		}
	}
	//function ml_set_oc()
	//{
	//	ml_global.row=document.getElementById("ml_row").value;
	//	ml_global.line=document.getElementById("ml_line").value;
	//	ml_global.seats=[];
	//	for (var i=0;i<ml_global.line;i++)
	//	{
	//		ml_global.seats.push([]);
	//		for (var j=0;j<ml_global.row;j++)
	//		{
	//			if(ml_global.position[])
	//			ml_global.seats[i].push("空位置");
	//		}
	//	}
	//	document.getElementById("ml_data").innerHTML=ml_creatTable(ml_global.seats);
	//}
	function ml_setmust_oc()
	{
		if(ml_conditionMust.value==="-请选择条件-")
		{
			alert("请选择条件！");
			return;
		}
		if(ml_optionMust1.value===ml_optionMust2.value)
		{
			alert("条件不正确！");
			return;
		}
		for(var i=0;i<ml_global.condition.length;i++)
		{
			if((ml_global.condition[i].student1===ml_optionMust1.value&&ml_global.condition[i].student2===ml_optionMust2.value)||(ml_global.condition[i].student2===ml_optionMust1.value&&ml_global.condition[i].student1===ml_optionMust2.value))
			{
				alert("已存在条件！");
				return;
			}
		}
		ml_global.condition.push(new Ml_Condition(ml_conditionMust.value,ml_optionMust1.value,ml_optionMust2.value,must));
		ml_conditionJson.innerHTML=JSON.stringify(ml_global.condition)
	}
	function ml_setnot_oc()
	{
		if(ml_conditionNot.value==="-请选择条件-")
		{
			alert("请选择条件！");
			return;
		}
		if(ml_optionNot1.value===ml_optionNot2.value)
		{
			alert("条件不正确！");
			return;
		}
		for(var i=0;i<ml_global.condition.length;i++)
		{
			if((ml_global.condition[i].student1===ml_optionNot1.value&&ml_global.condition[i].student2===ml_optionNot2.value)||(ml_global.condition[i].student2===ml_optionNot1.value&&ml_global.condition[i].student1===ml_optionNot2.value))
			{
				alert("已存在条件！");
				return;
			}
		}
		ml_global.condition.push(new Ml_Condition(ml_conditionNot.value,ml_optionNot1.value,ml_optionNot2.value,not));
		ml_conditionJson.innerHTML=JSON.stringify(ml_global.condition)
	}
	function ml_importJSON_oc()
	{
		if(JSON.parse(ml_conditionJSON.value) instanceof Array)
		{
			ml_global.condition=JSON.parse(ml_conditionJSON.value);
			ml_conditionJson.innerHTML=JSON.stringify(ml_global.condition);
			ml_update();
		}
		else
		{
			alert("非法的JSON格式！");
		}
	}
	function ml_generatePosition(mode)
	{
		if(mode===-1)
		{
			var x=ml_randomNum(0,ml_global.line-1);
			var y=ml_randomNum(0,ml_global.row-1);
			while(!(ml_global.seats[x][y]==="空位置"))
			{
				x=ml_randomNum(0,ml_global.line-1);
				y=ml_randomNum(0,ml_global.row-1);
			}
			return [x,y];
		}
	}
	function ml_searchAllEmpty()
	{
	var emptySeats=[];
	for(var i=0;i<ml_global.line;i++)
		{
			for(var j=0;j<ml_global.row;j++)
			{
				if(ml_global.seats[i][j]==="空位置")
					{
						emptySeats.push([i,j]);
					}
				
			}
		}
		return emptySeats;
	}
	
	function ml_generate_oc()
	{
		ml_set_oc();
		for (var i=0;i<ml_global.students.length;i++)
		{
			var x=ml_randomNum(0,ml_global.line-1);
			var y=ml_randomNum(0,ml_global.row-1);
			while(!(ml_global.seats[x][y]==="空位置"))
			{
				x=ml_randomNum(0,ml_global.line-1);
				y=ml_randomNum(0,ml_global.row-1);
			}
			ml_global.seats[x][y]=ml_global.students[i];
		}
		document.getElementById("ml_data").innerHTML=ml_creatTable(ml_global.seats);
	}
	function ml_isMust(obj)
	{
		if(obj.mode==must)
		{
			return true;
		}
	}
	function ml_isNot(obj)
	{
		if(obj.mode==not)
		{
			return true;
		}
	}
	function ml_condGenerate_oc()
	{
		// ml_withDo(ml_global.condition,ml_isMust,function(obj){
		// 		var eptSeats=ml_searchAllEmpty();
		// 		if(obj.conditionId=up)
		// 		{
		// 			for(var i=)
		// 		}
		// 	}
		// );
		// for(var i=0;i<ml_global.students.length;i++)
		// ml_global.tableData[ml_positionX.value][ml_positionY.value]=;
	}
	function ml_setpos_oc()
	{
		ml_global.position[ml_positionX.value,ml_positionY.value]=document.getElementById("ml_optionPosition").selectedIndex;
		ml_positionJson.innerHTML=JSON.stringify(ml_global.position);
	}
	function ml_deleteSelect_oc()
	{
		//if(document.getElementById("")
	}
