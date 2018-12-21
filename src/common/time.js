const transTimeFunc = {
	getTime(inpuTime) {
		var year = inpuTime.getFullYear(); //年
		var month = inpuTime.getMonth() + 1; //月
		var day = inpuTime.getDate(); //日
		var hh = inpuTime.getHours(); //时
		var mm = inpuTime.getMinutes(); //分
		var clock = year + "-";
		if (month < 10)
			clock += "0";
		clock += month + "-";
		if (day < 10)
			clock += "0";

		clock += day + " ";
		if (hh < 10)
			clock += "0";
		clock += hh + ":";
		if (mm < 10) clock += '0';
		clock += mm;
		return (clock);
	},
	transTime(time) {
		return this.getTime(new Date(time * 1000));
	},
	getTimeNow() {
		return this.getTime(new Date());
	}
}
export default {
	transTimeFunc
}
