/*ARC 日历插件 32237384@qq.com*/ 
(function($) {	 
	$.fn.arcdata = function(options) { 
        var target = this,
        	 $container,
        	 opts = {//默认配置
        		classid:'arcdata',
				previous:'previous',
				next:'next',
				language:'cn',
				value:0,
				addweek:28,
				arcdate:new Date(),
				type:'1',//类型
				firstDay:1,//第一天
				lastDay:28,//最后一天
				onCast: function (value) {},//点击日期事件
				onPrevious:function (value) {},//点击左箭头事件
				onNext:function (value) {}//点击右箭头事件
        };
        
        //判断是否传入配置项
        if(options) {
        	 $.extend(opts, options);  
        }    
        getcountdate(target,opts);  
        
        _year = opts.arcdate.getFullYear();
        _month = opts.arcdate.getMonth()+1;
        //初始化
        init(target,opts);		
	}        
	// 初始化
	init = function(target, opts) { 
		target.toggleClass(opts.classid, true);		
		// 定义空件布局
		var _html = [];			
        week = initweek(target,opts); 
       	_year = opts.arcdate.getFullYear(), //判断当前年份
		_month = opts.arcdate.getMonth() + 1; //判断当前月份
		
		_html.push('<div class="'+opts.classid+'_header">'+
						'<a href="javascript:;" class="'+opts.classid+'_'+opts.previous+'"></a>'+
						'<p class="'+opts.classid+'_title">'+_year+' 年 '+_month+' 月 </p>'+
						'<a href="javascript:;" class="'+opts.classid+'_'+opts.next+'"></a></div>');//标题栏
		_html.push('<ul class="'+opts.classid+'_week">'+week+'</ul>');//星期几
		_html.push('<ul class="'+opts.classid+'_calendar"></ul>');//日期			
		target.html(_html.join(''));				
		initDate(target,opts);	
		clickdate(target,opts);//点击日期事件		
	} 
	//初始化星期
	initweek = function(target,opts){			
		if(opts.language=='cn'){
			val =['日','一','二','三','四','五','六'];
		}else{
			val =['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
		}
		week = [];
		for (i=0;i<val.length;i++){
			week += '<li>'+val[i]+'</li>'
		}	
		return week;
	}
	//点击事件
	clickdate = function(target,opts){	
		//点击左箭头事件
		target.find('.'+opts.classid+'_'+opts.previous).click(function(){	
			previousWeek(target,opts);
			clickday(target,opts);
			val = opts.arcdate.getFullYear()+'-'+(opts.arcdate.getMonth()+1);
			opts.onPrevious.call(target,val);
		});
		//点击左箭头事件
		target.find('.'+opts.classid+'_'+opts.next).click(function(){	
			nextWeek(target,opts);
			clickday(target,opts);
			val = opts.arcdate.getFullYear()+'-'+(opts.arcdate.getMonth()+1);
			opts.onNext.call(target,val);
		});	
		clickday(target,opts);			
		function clickday(target,opts){			
			//点击日期事件
			target.find('.'+opts.classid+'_calendar li').click(function(){	
				val = $(this).attr('value');
				opts.onCast.call(target,val);
			});
		}
	}
	//初始化日期加载
	initDate = function(target,opts) {
		currDT = opts.arcdate;
		var tdDT;//日期  	
		_html = [];	
		if(opts.type==1){			
      		_countone= countone(getDays(opts)[0]);
     		for(k=0;k<_countone; k++){
       			_html.push('<li></li>');
     		}
		}
		for(var i=0;i<opts.addweek;i++) {
			tdDT = getDays(opts)[i];
			calendarval = tdDT.getFullYear()+'-'+(tdDT.getMonth()+1)+'-'+tdDT.getDate();
			if (opts.value.in_array(calendarval)) {
				_html.push('<li class="active" value="'+calendarval+'"><em></em><span>' + tdDT.getDate()  + '</span></li>');
			} else {
				_html.push('<li value="'+calendarval+'"><span>' + tdDT.getDate()  + '</span></li>');
			}
		} 
		target.find('.'+opts.classid+'_calendar').html(_html.join(''));
		//重新赋值
		opts.lastDay = getDays(opts)[opts.addweek-1];//本周的最后一天
		opts.firstDay = getDays(opts)[0];//本周的第一天
		target.find('.'+opts.classid+'_title').html(tdDT.getFullYear()+' 年 '+(tdDT.getMonth()+1)+' 月');
		opts.arcdate = tdDT;
	}	
	//上一周
	previousWeek = function(target,opts) {
		currDT = opts.arcdate;
		currDT.setDate(currDT.getDate()-opts.addweek);
		var tdDT,_html = [];
		if(opts.type==1){			
      		_countone= countone(getPreviousWeekDatas(opts.firstDay,opts)[0]);
			opts.arcdate = getPreviousWeekDatas(opts.lastDay,opts)[0];
   			getcountdate(target,opts); 
     		for(k=0;k<_countone; k++){
       			_html.push('<li></li>');
     		}
		}
		for(var i=0;i<opts.addweek;i++) {
			tdDT = getPreviousWeekDatas(opts.firstDay,opts)[i]; 	   	
			calendarval = tdDT.getFullYear()+'-'+(tdDT.getMonth()+1)+'-'+tdDT.getDate();
			if (opts.value.in_array(calendarval)) {
				_html.push('<li class="active" value="'+calendarval+'"><em></em><span>' + tdDT.getDate()  + '</span></li>');
			} else {
				_html.push('<li value="'+calendarval+'"><span>' + tdDT.getDate()  + '</span></li>');
			}
		} 
		target.find('.'+opts.classid+'_calendar').html(_html.join(''));
		//重新赋值
		opts.lastDay =  getPreviousWeekDatas(opts.firstDay,opts)[opts.addweek-1];//注意赋值顺序1
		opts.firstDay = getPreviousWeekDatas(opts.firstDay,opts)[0];//注意赋值顺序2
		target.find('.'+opts.classid+'_title').html(tdDT.getFullYear()+' 年 '+(tdDT.getMonth()+1)+' 月');		
	}
	//下一周
 	nextWeek = function(target,opts) {
		currDT = opts.arcdate;
		currDT.setDate(currDT.getDate()+opts.addweek);//重设时间
		var tdDT,_html = [];	
		if(opts.type==1){			
      		_countone= countone(getNextWeekDatas(opts.lastDay,opts)[0]);	
			opts.arcdate = getNextWeekDatas(opts.lastDay,opts)[0];
    		getcountdate(target,opts);  
     		for(k=0;k<_countone; k++){
       			_html.push('<li></li>');
     		}
		}
		for(var i=0;i<opts.addweek;i++) {
			tdDT = getNextWeekDatas(opts.lastDay,opts)[i];	
			calendarval = tdDT.getFullYear()+'-'+(tdDT.getMonth()+1)+'-'+tdDT.getDate();
			if (opts.value.in_array(calendarval)) {
				_html.push('<li class="active" value="'+calendarval+'"><em></em><span>' + tdDT.getDate()  + '</span></li>');
			} else {
				_html.push('<li value="'+calendarval+'"><span>' + tdDT.getDate()  + '</span></li>');
			}
		} 
		target.find('.'+opts.classid+'_calendar').html(_html.join(''));
		//重新赋值
		opts.firstDay = getNextWeekDatas(opts.lastDay,opts)[0];//注意赋值顺序1
		opts.lastDay = getNextWeekDatas(opts.lastDay,opts)[opts.addweek-1];//注意赋值顺序2
		target.find('.'+opts.classid+'_title').html(tdDT.getFullYear()+' 年 '+(tdDT.getMonth()+1)+' 月');
	}
	//获取天数
	getcountdate = function(target,opts){		
        if(opts.type==1){
        	opts.addweek = getdaycount(target,opts);
        }else if(opts.type==2){
        	opts.addweek = 7;
        }
		function getdaycount(target,opts){		
			day = new Date(opts.arcdate.getFullYear(), (opts.arcdate.getMonth() + 1), 0); //构造一个日期对象： 
			daycount = day.getDate(); //获取天数： 
			opts.addweek = daycount;
			return daycount;		
		}
	}	
	//获取星期几
	countone = function(event){     
        return event.getDay();
	}
	//取得当前日期一周内的某一天
	getWeek = function(i,opts) {
		now = new Date(),
		n = now.getDay(),
		start = new Date();
		if(opts.type==1){
			n = 1;
			start.setDate(1); //重定义日期为每月1号
		}
		start.setDate(now.getDate() - n + i);//取得一周内的第一天、第二天、第三天...
		return start;
	}
	//取得当前日期一周内的七天
	getDays = function(opts) {
		var days = new Array();
		for(var i=1;i<=opts.addweek;i++) {
			days[i-1] = getWeek(i,opts);
		}
		return days;
	}
	//取得下一周的日期数(共七天)
	getNextWeekDatas = function(ndt,opts) {
		var days = new Array();
		for(var i=1;i<=opts.addweek;i++) {
			var dt = new Date(ndt);
			days[i-1] = getNextWeek(dt,i,opts);
		}
		return days;
		function getNextWeek(dt,i,opts) {
			var today = dt;	
			today.setDate(today.getDate()+i);
			return today;
		}
	}
	//取得上一周的日期数(共七天)
	getPreviousWeekDatas = function(ndt,opts) {
		var days = new Array();
		for(var i=-opts.addweek;i<=-1;i++) {
			var dt = new Date(ndt);
			days[opts.addweek+i] = getPreviousWeek(dt,i,opts);
		}
		return days;
		//指定日期的上一周(前七天)
		function getPreviousWeek(dt,i,opts) {
			var today = dt;
			today.setDate(today.getDate()+i);
			return today;
		}
	}	
	//与数组中的某个数比对
	//例子array.in_array('值'),array代表一个数组
	Array.prototype.in_array = function(e) {
		var r = new RegExp(',' + e + ',');
		return (r.test(',' + this.join(this.S) + ','));
	}
})(jQuery);
