export function setLocalStorageWithExpiry(key: string, value: any, ttl: number) {
	const now = new Date()

	// `item` is an object which contains the original value
	// as well as the time when it's supposed to expire
	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	}
	localStorage.setItem(key, JSON.stringify(item))
}

export function getLocalStorageWithExpiry(key: string) {
	const itemStr = localStorage.getItem(key)
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null
	}
	const item = JSON.parse(itemStr)
	const now = new Date()
	// compare the expiry time of the item with the current time
	if (now.getTime() > item.expiry) {
		// If the item is expired, delete the item from storage
		// and return null
	alert( now.getTime().toString() + 'asdasd'  + item.expiry.toString() + 'fff' + (item.expiry  - now.getTime()).toString())
	//	localStorage.removeItem(key)
		return null
	}
	return item.value ? item.value : null
}

export function shuffle(arr: any){
	var j, temp;
	for(var i = arr.length - 1; i > 0; i--){
		j = Math.floor(Math.random()*(i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
}

export function getRandomNumber(min: number = 0, max: number = 100) {
    return Math.random() * (max - min) + min;
}

export function sortTable( a: any, b: any ) {
	if ( a.score < b.score ){
	  return 1;
	}
	if ( a.score > b.score ){
	  return -1;
	}

	if ( a.score == b.score ){
		if ( a.grobValue < b.grobValue ){
			return 1;
		}
		if ( a.grobValue > b.grobValue ){
			return -1;
		}
	}
	return 0;
}

export function sortMultyArray(index: number){
    return function(a: any, b: any){
		let aValue = a[index] == '-' ? -1 : a[index]
		let bValue = b[index] == '-' ? -1: b[index]
		let result = (aValue === bValue ? 0 : (aValue > bValue ? -1 : 1));
        return result;
    };
}
