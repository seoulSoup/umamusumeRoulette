const SLOTS_PER_REEL = 12;
// radius = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / SLOTS_PER_REEL ) ); 
// current settings give a value of 149, rounded to 150
const REEL_RADIUS = 148;
const ListTotal = [];
const consoleDiv = document.querySelector("#console")
const consoleToHtml = function() {
    Array.from(arguments).forEach(el => {
        const insertValue = typeof el === "object" ? JSON.stringify(el) : el
		consoleDiv.textContent += insertValue
    })
	
    consoleDiv.textContent += "\n"
}
window.console.log = consoleToHtml


let DictRange = {0: ["단거리", "#E0BBE4"],	// 단거리: 오이 제외
				1: ["마일", "#957DAD"],		// 마일: 오이 제외
				2: ["중거리", "#D291BC"],	// 중거리: 오이 제외
				3: ["장거리", "#FEC8D8"],			// 장거리: 니이가타, 츄쿄, 오이 제외
				4: ["더트", "#FFDFD3"], 		// 더트: 삿포로, 코쿠라 제외
				};
let DictLoc = {0: ["삿포로", "#C7E3A4"],
				1: ["하코다테", "#FDF6C3"],
				2: ["후쿠시마", "#FFFEF7"],
				3: ["니이가타", "#F8CBEE"],
				4: ["도쿄", "#CAC3F7"],
				5: ["나카야마", "#C3E9F8"],
				6: ["츄쿄", "#F075AB"],
				7: ["교토", "#F2BD93"],
				8: ["한신", "#FAD8CC"],
				9: ["코쿠라", "#F5A6CD"],
				10: ["오이", "#D879C9"]
				};
let DictRot = {0: ["시계 (우)", "#F595B2"], 1: ["반시계 (좌)", "#FFB3B3"], 2: ["직선", "#FFF1BA"]};
let DictSide = {0: ["내주로", "#BEE3ED"], 1: ["외주로", "#AFADDE"], 2: ["외->내", "#FFA694"], 3: ["없음", "#BFEDBE"]};
let DictLength = {0: ["1000m", "#E0BBE4"], 1: ["1150m", "#957DAD"], 2: ["1200m", "#D291BC"], 3: ["1300m", "#FEC8D8"], 4: ["1400m", "#FFDFD3"], 5: ["1500m", "#C7E3A4"],
				 6: ["1600m", "#FDF6C3"], 7: ["1700m", "#FFFEF7"], 8: ["1800m", "#F8CBEE"], 9: ["1900m", "#CAC3F7"], 10: ["2000m", "#C3E9F8"], 11: ["2100m", "#F075AB"],
				 12: ["2200m", "#F2BD93"], 13: ["2300m", "#FAD8CC"], 14: ["2400m", "#F5A6CD"], 15: ["2500m", "#D879C9"], 16: ["2600m", "#F595B2"], 17: ["3000m", "#FFB3B3"],
				 18: ["3200m", "#BADB9E"], 19: ["3400m", "#FDEEB4"], 20: ["3600m", "#FAADE3"]
				}

let DictLUT = {0: {0: {0: {3: [2]}},	// 삿포로
				1: {0: {3: [2, 0]}}, 	// 하코다테
				2: {0: {3: [2]}},	// 후쿠시마
				3: {1: {0: [4, 2]}, 
					2: {3: [0]}},	// 니이가타
				4: {1: {3: [4]}},	// 도쿄
				5: {0: {1: [2]}},	// 나카야마
				6: {1: {3: [4, 2]}},	// 츄쿄
				7: {0: {0: [4, 2], 
						1: [4]}},	// 교토
				8: {0: {0: [4, 2]}},	// 한신
				9: {0: {3: [2]}}	// 코쿠라
                }, // 단거리
                1: {0: {0: {3: [8, 5]}},	// 삿포로
                    1: {0: {3: [8]}}, 	// 하코다테
                    2: {0: {3: [8]}},	// 후쿠시마
                    3: {1: {1: [8, 6]}},	// 니이가타
                    4: {1: {3: [8, 6]}},	// 도쿄
                    5: {0: {0: [8],
                            1: [6]}},	// 나카야마
                    6: {1: {3: [6]}},	// 츄쿄
                    7: {0: {0: [6],
                        1: [8, 6]}},	// 교토
                    8: {0: {1: [8, 6]}},	// 한신
                    9: {0: {3: [8]}}	// 코쿠라
                    }, // 마일
                2: {0: {0: {3: [10]}},	// 삿포로
                    1: {0: {3: [10]}}, 	// 하코다테
                    2: {0: {3: [10]}},	// 후쿠시마
                    3: {1: {0: [14, 12, 10],
                            1: [10]}},	// 니이가타
                    4: {1: {3: [14, 13, 10]}},	// 도쿄
                    5: {0: {0: [10],
                        1: [12]}},	// 나카야마
                    6: {1: {3: [12, 10]}},	// 츄쿄
                    7: {0: {0: [10],
                        1: [14, 12]}},	// 교토
                    8: {0: {0: [12, 10],
                        1: [14]}},	// 한신
                    9: {0: {3: [10]}}	// 코쿠라
                    }, // 중거리
                3: {0: {0: {3: [16]}},	// 삿포로
                    1: {0: {3: [16]}}, 	// 하코다테
                    2: {0: {3: [16]}},	// 후쿠시마
                    4: {1: {3: [19, 15]}},	// 도쿄
                    5: {0: {0: [1920, 15]}},	// 나카야마
                    7: {0: {3: [18, 17]}},	// 교토
                    8: {0: {0: [17],
                            1: [16],
                            2: [18]}},	// 한신
                    9: {0: {3: [16]}}	// 코쿠라
                    }, // 장거리
                4: {0: {0: {3: [7]}},	// 삿포로
                    1: {0: {3: [7]}},	// 하코다테
                    2: {0: {3: [7, 1]}},	// 후쿠시마
                    3: {1: {3: [8, 2]}},	// 니이가타
                    4: {1: {3: [11, 6, 4, 3]}},	// 도쿄
                    5: {0: {3: [8, 2]}},	// 나카야마
                    6: {1: {3: [8, 4]}},	// 츄쿄
                    7: {0: {3: [9, 8, 4, 2]}},	// 교토
                    8: {0: {3: [10, 8, 4]}},	// 한신
                    9: {0: {3: [7]}},	// 코쿠라
                    10: {0: {3:[10, 8, 2]}} // 오이
                    } // 더트
                }

function createSlots (ring, DictTemp) {
	var slotAngle = 360 / SLOTS_PER_REEL;
	var LenTemp = Object.keys(DictTemp).length
	for (var i = 0; i < LenTemp; i ++) {
		var slot = document.createElement('div');
		slot.className = 'slot';
		
		// compute and assign the transform for this slot
		var transform = 'rotateX(' + (slotAngle * i) + 'deg) translateZ(' + REEL_RADIUS + 'px)';
		slot.style.transform = transform;
		slot.style.backgroundColor = DictTemp[i][1];
		// setup the number to show inside the slots
		var content = slot.append((DictTemp[i][0]));
		// add the poster to the row
		ring.append(slot);
	}
}

function getSeed(LenInput) {
    // generate random number smaller than 13 then floor it to settle between 0 and 12 inclusive
    if (LenInput == 1) return 0;
    else return Math.floor(Math.random()*(LenInput));
}

function findRoute(DictLUT, ListLUT) {
    if (typeof DictLUT == 'number') {
        ListLUT.push(DictLUT);
        return;
    }
    var keys = Object.keys(DictLUT);
    var LenTemp = keys.length;
    var seedKey = keys[getSeed(LenTemp)];
    ListLUT.push(seedKey)
    findRoute(DictLUT[seedKey], ListLUT);
}

function* infGenerator(ListGen){
    var idx = 0;
	var lenList = ListGen.length;
    while (true) {
        yield ListGen[idx++%lenList];
    }
}

function spin(timer) {
	//var txt = 'seeds: ';
	let ListLUT = [];
	findRoute(DictLUT, ListLUT);
	ListTotal.push(ListLUT);
	for(var i = 1; i < 6; i ++) {
		// Condition
		console.log("ring"+i+"done");
		// 0:-120 1:-150, ... i:-30*(i+4)
		// -30도: idx +1
		document.querySelector('#ring'+i)
			// .animate([
			// 	{ transform: rotateX(-30deg), offset: 0 },
			// 	{ transform: rotateX(-150deg), offset: 0.5 },
			// 	{ transform: rotateX(-300deg), offset: 1.0 }
			// ], {
			// 	duration: 2000,
			// 	direction: 'alternate',
			// 	iterations: Infinity
			// })
			// .attr('class','ring spin-' + seed);
		console.log("ring animate done")
	}

	console.log('=====');
}

window.onload = function() {
	// initiate slots 
 	createSlots(document.querySelector('#ring1'), DictRange);
 	createSlots(document.querySelector('#ring2'), DictLoc);
 	createSlots(document.querySelector('#ring3'), DictRot);
 	createSlots(document.querySelector('#ring4'), DictSide);
 	createSlots(document.querySelector('#ring5'), DictLength);
 	// hook start button
 	document.querySelector('.go').addEventListener('click',function(){
 		var timer = 1;
 		spin(timer);
 	});
 	// hook xray checkbox
	console.log("after go");
 	document.querySelector('#xray').addEventListener('click',function(){
		document.getElementById("checkbox").checked = true;
		console.log("xray go");
		var tilt = 'tiltout';
		// check box condition: xray
		if(document.getElementById("checkbox").checked) {
			tilt = 'tiltin';
			document.querySelector('.slot').addClass('backface-on');
			document
			.querySelector('#rotate').css('animation',tilt + ' 2s 1');

			setTimeout(function(){
				document.querySelector('#rotate').toggleClass('tilted');
			},2000);
		} else {
			tilt = 'tiltout';
			document.querySelector('#rotate').css({'animation':tilt + ' 2s 1'});

			setTimeout(function(){
				document.querySelector('#rotate').toggleClass('tilted');
				document.querySelector('.slot').removeClass('backface-on');
			},1900);
		}
 	})

 	// hook perspective
	// check box condition: perspective
 	document.querySelector('#perspective').on('click',function(){
		document.querySelector('#stage').toggleClass('perspective-on perspective-off');
 	})	
 };