const SLOTS_PER_REEL = 12;
// radius = Math.round( ( panelWidth / 2) / Math.tan( Math.PI / SLOTS_PER_REEL ) ); 
// current settings give a value of 149, rounded to 150
const REEL_RADIUS = 149;
const PATH_VAR = "./assets/variable/";
const cardWidth =  400;
const cardHeight = 512;
var COUNT = 1;
let dictRoute = {}; // Route Append
let listCurrentRings = []; // Route Append
const consoleDiv = document.querySelector('#console')
const consoleToHtml = function() {
    Array.from(arguments).forEach(el => {
        const insertValue = typeof el === 'object' ? JSON.stringify(el) : el
		consoleDiv.textContent += insertValue
    })
	
    consoleDiv.textContent += '\n'
}
window.console.log = consoleToHtml
					// index0: 거리
let dictTotalInfo = {0: {0: ['단거리', '#E0BBE4'],	// 단거리: 오이 제외
						1: ['마일', '#957DAD'],		// 마일: 오이 제외
						2: ['중거리', '#D291BC'],	// 중거리: 오이 제외
						3: ['장거리', '#FEC8D8'],			// 장거리: 니이가타, 츄쿄, 오이 제외
						4: ['더트', '#FFDFD3'], 		// 더트: 삿포로, 코쿠라 제외
						},
						// index1: 경기장
					1: {0: ['삿포로', '#C7E3A4'],
						1: ['하코다테', '#FDF6C3'],
						2: ['후쿠시마', '#FFFEF7'],
						3: ['니이가타', '#F8CBEE'],
						4: ['도쿄', '#CAC3F7'],
						5: ['나카야마', '#C3E9F8'],
						6: ['츄쿄', '#F075AB'],
						7: ['교토', '#F2BD93'],
						8: ['한신', '#FAD8CC'],
						9: ['코쿠라', '#F5A6CD'],
						10: ['오이', '#D879C9'],
						11: [`url('https://github.com/seoulSoup/umamusumeRoulette/blob/main/assets/icon(squre)/big.png?raw=true)`, '#CAC3F7']
						},
						// index2: 방향
					2: {0: ['시계 (우)', '#F595B2'], 1: ['반시계 (좌)', '#FFB3B3'], 2: ['직선', '#FFF1BA']},
						// index3: 내/외
					3: {0: ['내주로', '#BEE3ED'], 1: ['외주로', '#AFADDE'], 2: ['외->내', '#FFA694'], 3: ['없음', '#BFEDBE']},
						// index4: 세부 거리
					4: {0: ['1000m', '#E0BBE4'], 1: ['1150m', '#957DAD'], 2: ['1200m', '#D291BC'], 3: ['1300m', '#FEC8D8'], 4: ['1400m', '#FFDFD3'], 5: ['1500m', '#C7E3A4'],
						6: ['1600m', '#FDF6C3'], 7: ['1700m', '#FFFEF7'], 8: ['1800m', '#F8CBEE'], 9: ['1900m', '#CAC3F7'], 10: ['2000m', '#C3E9F8'], 11: ['2100m', '#F075AB'],
						12: ['2200m', '#F2BD93'], 13: ['2300m', '#FAD8CC'], 14: ['2400m', '#F5A6CD'], 15: ['2500m', '#D879C9'], 16: ['2600m', '#F595B2'], 17: ['3000m', '#FFB3B3'],
						18: ['3200m', '#BADB9E'], 19: ['3400m', '#FDEEB4'], 20: ['3600m', '#FAADE3']
						}
}

let dictLUT = {0: {0: {0: {3: [2]}},	// 삿포로
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
                    5: {0: {0: [20, 15]}},	// 나카야마
                    7: {0: {3: [18, 17]}},	// 교토
                    8: {0: {0: [17],
                            1: [16],
                            2: [18]}},	// 한신
                    9: {0: {3: [16]}}	// 코쿠라
                    }, // 장거리
                // 4: {0: {0: {3: [7]}},	// 삿포로
                //     1: {0: {3: [7]}},	// 하코다테
                //     2: {0: {3: [7, 1]}},	// 후쿠시마
                //     3: {1: {3: [8, 2]}},	// 니이가타
                //     4: {1: {3: [11, 6, 4, 3]}},	// 도쿄
                //     5: {0: {3: [8, 2]}},	// 나카야마
                //     6: {1: {3: [8, 4]}},	// 츄쿄
                //     7: {0: {3: [9, 8, 4, 2]}},	// 교토
                //     8: {0: {3: [10, 8, 4]}},	// 한신
                //     9: {0: {3: [7]}},	// 코쿠라
                //     10: {0: {3:[10, 8, 2]}} // 오이
                //     } // 더트 Original
				4: {0: {0: {3: [7]}},	// 삿포로
                    1: {0: {3: [7]}},	// 하코다테
                    2: {0: {3: [7]}},	// 후쿠시마
                    3: {1: {3: [8]}},	// 니이가타
                    4: {1: {3: [6]}},	// 도쿄
                    5: {0: {3: [8]}},	// 나카야마
                    6: {1: {3: [8]}},	// 츄쿄
                    7: {0: {3: [9, 8]}},	// 교토
                    8: {0: {3: [8]}},	// 한신
                    9: {0: {3: [7]}},	// 코쿠라
                    10: {0: {3:[8]}} // 오이
                    } // 더트 for 개작두
                }
const dictCardCategory = {
					'env': '00A_weather_course.png',
					'condition': '00B_condition.png',
					'race': '00C_race.png',
					'none': '00D_null.png'
}
const dictCardVariable = {
					'none': {

					},
					'env': {
						'gyosin': '001.course_sunnyfine.png',
						'ggot': '002.course_sunnywet.png',
						'baram': '003.course_cloudyfine.png',
						'cafe': '004.course_cloudywet.png',
						'bitgil': '005.course_rainsat.png',
						'poku': '006.course_rainbad.png',
						'bingpan': '007.course_snowwet.png',
						'illyu': '008.course_snowbad.png',
						'donggyoung': '009.weth_spring.png',
						'bubbly': '010.weth_summer.png',
						'cheongo': '011.weth_fall.png',
						'gansik': '012.weth_winter.png'

					},
					'condition': {
						'muhan': '013.condi_best.png',
						'hwejang': '014.condi_worst.png'
					},
					'race': {
						'mejiro': '015.ban_mejiro.png',
						'lucky': '016.ban_sakuramachikane.png',
						'babsang': '017.ban_narita.png',
						'domang': '018.ban_nige.png',
						'daum': '019.ban_senko.png',
						'route': '020.ban_sasi.png',
						'gate': '021.ban_tsui.png',
						'hyusik': '022.ban_already.png',
						'bonup': '023.ban_unit.png',
						'chilhuk': '024.ban_add.png',
						'costum': '025.only_origin.png',
						'road': '026.only_addicth.png',
						'yori': '027.only_right.png',
						'sihum': '028.only_left.png',
						'mission': '029.only_junior.png',
						'nai': '030.only_senior.png',
						'jungche': '031.only_under93.png',
						'gisuksa': '032.only_over94.png',
						'hisiama': '033.only_ritto.png',
						'dalkom': '034.only_miho.png',
						'yes': '035.only_under158.png',
						'jingyeok': '036.only_over159.png',
						'banyeok': '037.18entry.png',
						'kekiretsu': '038.allout.png'
					}
}


function createSlots (ring, dictTemp) {
	var slotAngle = 360 / SLOTS_PER_REEL;
	// var LenTemp = Object.keys(dictTemp).length
	let listGen = [];
	let listSlot = [];
	for (val in Object.keys(dictTemp)){
		listGen.push([val, dictTemp[val]]);
	}
	// shuffle list
	shuffle(listGen);
	genTemp = infGenerator(listGen);
	for (var i = 0; i < SLOTS_PER_REEL; i ++) {
		var slot = document.createElement('div');
		slot.className = 'slot';
		slot.id = 'ring' + (listCurrentRings.length+1) + 'slot' + i;
		var genNext = genTemp.next().value;
		// compute and assign the transform for this slot
		var transform = 'rotateX(' + (slotAngle * i) + 'deg) translateZ(' + REEL_RADIUS + 'px)';
		slot.style.transform = transform;
		slot.style.backgroundColor = genNext[1][1];
		// setup the number to show inside the slots
		var content = genNext[1][0]
		if (content.includes('url')){
			$(slot).css('background-image', content)
					.css('background-size', 'contain')
					.css('background-position', 'center')
					.css('background-repeat', 'no-repeat')
					// .css('object-position', '50% 50%')
		}
		else {
			// $(slot).append(i + ':' + content);
			$(slot).append(content);
		}
		listSlot.push(genNext);
		// add the poster to the row
		ring.append(slot);
		
	}
	// console.log(listSlot);
	listCurrentRings.push(listSlot);
}

function getSeed(LenInput) {
    // generate random number smaller than 13 then floor it to settle between 0 and 12 inclusive
    if (LenInput == 1) return 0;
    else return Math.floor(Math.random()*(LenInput));
}

function findRoute(dictLUT, listLUT) {
    if (Array.isArray(dictLUT)) {
        listLUT.push(dictLUT[getSeed(dictLUT.length)].toString());
        return;
    }
    var keys = Object.keys(dictLUT);
    var LenTemp = keys.length;
    var seedKey = keys[getSeed(LenTemp)];
    listLUT.push(seedKey)
    findRoute(dictLUT[seedKey], listLUT);
}

function* infGenerator(listGen){
    var idx = 0;
	var lenlist = listGen.length;
    while (true) {
        yield listGen[idx++%lenlist];
    }
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		  // 무작위로 index 값 생성 (0 이상 i 미만)
	  let j = Math.floor(Math.random() * (i + 1));
	  [array[i], array[j]] = [array[j], array[i]];
	}
}

function copyObjectDeep(target) {
	var result = {};
	if (typeof target == 'object' && target != null) {
		for (var prop in target) {
			result[prop] = copyObjectDeep(target[prop]);
		}
		if (Array.isArray(target)) {
			result = Object.values(result);
		}
		
	} else {
	  result = target;
	}
	return result;
}
function inputTable(dictRoute){
	// console.log(dictRoute[Object.keys(dictRoute).length]);
	// $('#resultTable tr').eq(0).find('th').eq(1).html('Contact Name');
	let listRoute = dictRoute[Object.keys(dictRoute).length];
	for (i = 0; i < 5; i++){
		// console.log(dictTotalInfo[i][listRoute[i]][0]);
		document.getElementById('resultTable').rows[COUNT-1].cells[i].innerHTML = dictTotalInfo[i][listRoute[i]][0];
	}
	
}

function spin(timer, dictInput) {
	let listLUT = [];
	findRoute(dictInput, listLUT);
	delete dictInput[listLUT[0]];
	dictRoute[COUNT++] = listLUT;
	
	// console.log(dictRoute);
	var timeAnimation = 3.5;
	for(var i = 1; i < 6; i ++) {
		// console.log($('#ring'+i).attr('class'));
		
		let listCurrentRing = listCurrentRings[i-1];
		var answer = listLUT[i-1];
		// Condition
		var oldClass = $('#ring'+i).attr('class').split('-');
		var oldSeed = Number(oldClass[1]);
		// Check Slot Class is orig or rev
		var flagOldSeed = true;
		if(oldClass.length > 2) flagOldSeed = false;
		// Checking Answer in Ring?
		// k: randomized list index of answer
		let listAnswerIdx = [];
		for (var k = 0; k < listCurrentRing.length; k++){
			if (answer == listCurrentRing[k][0]) listAnswerIdx.push(k);
		}
		// Case: Answer is in Ring already
		if (listAnswerIdx.length > 1 ) {
			var seed = (listAnswerIdx[getSeed(listAnswerIdx.length)]) % 12;
			while (seed == oldSeed){
				seed = (listAnswerIdx[getSeed(listAnswerIdx.length)]) % 12;
			}
		}
		// Case: Answer is in Ring already and only one
		else if (listAnswerIdx.length == 1){
			var seed = (listAnswerIdx[0]) % 12;
			// var strSeed = seed;
			// if (flagOldSeed) strSeed = seed + '-' + 2;
		}
		// Case: Answer is not in Ring => Ju-jack
		else {
			seed = (oldSeed + 7) % 12;
			// var slot = $('#ring'+i).slot;
			$('#ring'+i+'slot' + (oldSeed + 7) % 12).text(dictTotalInfo[i-1][answer][0]);
			listCurrentRings[i-1][(oldSeed + 7) % 12] = [answer, dictTotalInfo[i-1][answer]];
			// $('#ring'+i+'slot5').text() = '0';
			// console.log($('#ring'+i+'slot5').text);
			// var seed = getSeed(listAnswerIdx.length);

			// $('#ring'+i+'slot5').css('background-image', `url('https://github.com/seoulSoup/umamusumeRoulette/blob/main/assets/icon(squre)/big.png?raw=true)`);
			// 	$(slot).css('background-image', content)
			// 			.css('background-size', 'contain')
			// 			.css('background-position', 'center')
			// 			.css('background-repeat', 'no-repeat')
			// }
			// console.log(listCurrentRings[i-1]); // answer
			
		}
		if (seed == oldSeed){
			// console.log('start' + seed);
			// console.log($('#ring'+i).attr('class'));
			// console.log($('#ring'+i).css('transform'));
			$('#ring'+i)
			.css('animation','back-spin 0s, spin-' + seed + ' ' + (COUNT + i*0.5) + 's')
			.attr('class','ring spin-' + seed);  // Last State (Result)
			// .css('animation','back-spin 5s');
			// .css('animation','spin-' + seed + ' ' + (timer + i*0.5) + 's');
			// console.log($('#ring'+i).css('transform'));
			if (timeAnimation < (COUNT + i*0.5)) timeAnimation = (COUNT + i*0.5);

		}
		else {
			// Animation
			$('#ring'+i)
			.css('animation','back-spin 1s, spin-' + seed + ' ' + (timer + i*0.5) + 's')
			.attr('class','ring spin-' + seed);  // Last State (Result)
			if (timeAnimation < (timer + i*0.5)) timeAnimation = (timer + i*0.5);
		}
		
		// Current Win position Index: oldSeed + 2
		// We have to put answer into this position
		// seed = (12 + listAnswerIdx[seed])%12;
		
	}
	// $('#ring'+(i-1)).on('animationend', (() => {
	// 	console.log("AAA");
	// 	inputTable(dictRoute);
	// 	cardOverlay();
	// }));
	setTimeout(() => {
		inputTable(dictRoute);
		cardOverlay();
	}, timeAnimation*1000);
	
	// console.log(dictRoute);
	// console.log('=====');
}
function createCardSet(dictCardSet) {
	let width = window.innerWidth;
	let height = window.innerHeight;
	let shuffleRadius = parseInt((width-100)/3);
	let shuffleHeight = parseInt((height-100)/2);
	let cardSet = $('<div></div>')
	$('#overlay').append(cardSet);
	cardSet.attr('id', Object.keys({dictCardSet})[0])
			.attr('class', 'cardSet');
	cardSet.css('left', shuffleRadius)
			.css('top', shuffleHeight);
	for (let i=0; i < Object.keys(dictCardSet).length; i++) {
		let card = $('<div></div>');
		let cardFace = $('<div></div>');
		card.attr('id', 'card' + i);
		cardFace.attr('id', 'cardFace' + i)
			.attr('class', 'cardFace')
			
			// .css('position', 'absolute')
			// .css('width', '400px')
			// .css('height', '512px')
			// .css('opacity', '0.7')
			// .css('background-size', 'contain')
			// .css('background-position', 'center')
			// .css('background-repeat', 'no-repeat')
			// .css('margin', '0')
			// .css('backface-visibility', 'hidden')
			// .css('display', 'none')
			// .css('animation-fill-mode', 'forwards')
			.css('background-image', 'url(' + PATH_VAR + dictCardSet[Object.keys(dictCardSet)[i]] + ')')
			// .css('left', (intervalWidth-) + intervalWidth*i)
			// .css('top', shuffleHeight-)
			// .css('transform','rotateY('+(90*i)+'deg) translateZ('+shuffleRadius+'px)')
		let cardBack = $('<div></div>')
		cardBack.attr('id', 'cardBack' + i)
			.attr('class', 'cardFace')
			.css('background-image', 'url(' + PATH_VAR + '000_backside.png)')
			.css('transform','rotateY(180deg) translateX(-1px)');
			
			
		
		// let transform = 'rotateY(' + (90 * i) + 'deg) translateX(' + shuffleRadius + 'px)';
		// card.style.transform = transform;
		card.append(cardBack);
		card.append(cardFace);
		cardSet.append(card);
		card.css('animation', 'cardFadeIn 0.5s');
		// cardFace.show();
		// cardBack.show();
		
	}
	setTimeout(() => {
		for (let i=0; i < Object.keys(dictCardSet).length; i++) {
			let card = cardSet.find('#card' + i);
			card.css('animation', 'cardSpreadCategoryFadeIn' + i + ' 0.7s ease-out');
			card.on('animationend', (() => {
				card.css('transform','rotateY('+(90*(3-i))+'deg) translateZ(300px)');
			}))
			// card.css('transform','rotateY('+(90*i)+'deg) translateZ(300px)');
			// let cardBack = cardSet.find('#cardBack' + i);
			
			// cardBack.css('animation', 'cardBackSpreadCategoryFadeIn' + i + ' 0.7s');
			// cardBack.on('animationend', (() => {
			// 	cardBack.css('transform','rotateX(180deg) rotateZ(180deg) rotateY('+(90*i)+'deg) translateZ(300px) ');
			// }))
				
		}
	}, 700);
	
	const randomIdx = Math.floor(Math.random() * (Object.keys(dictCardSet).length+1));
	// Spread Animation
	// Spin Animation
}

function resetCardSet(cardSet) {

}

function cardOverlay() {
	// Dark After Roulette
	$('#overlay').show();
	// Category Roulette
	const flagPick = createCardSet(dictCardCategory);
	$('#overlay').on('click', (event) => {
		if (flagPick) {
			const flagPick2 = createCardSet(dictCardVariable);
		}
		var x = event.pageX;
		var y = event.pageY;
		var biwacon = $('<div></div>');
		$('#overlay').append(biwacon);
		biwacon.attr('class', 'biwacon')
				.css('left', x + 'px')
				.css('top', y + 'px')
				.css('animation', 'fadeOut 0.9s');
		biwacon.on('animationend', (() => {
			biwacon.remove();
		}))
		// setTimeout(() => {
		// 	biwacon.remove();
		// }, 800);
	});	
	// console.log($('#overlay'));
	$('#overlay').on('dblclick', () => {
		////////////////////////////////
		// Task: skip action instead of hide
		$('#overlay').hide();
		////////////////////////////////
		
	});
	
	// $('#overlay').attr('display', 'block');
}

// window.onload = function() {
$(document).ready(function() {
	let dictLUTCopy = copyObjectDeep(dictLUT);
	// initiate slots 
	// ring1:spin6 (-240deg + back60deg : idx - 6 ) Win: listSlot1[8]
	// ring2:spin9 (-330deg + back60deg : idx - 9) Win: listSlot2[11]
	// ring3:spin3 (-150deg + back60deg : idx - 3) Win: listSlot3[5]
	// ring4:spin1 (-90deg + back60deg : idx - 1) Win: listSlot4[3]
	// ring5:spin2 (-120deg + back60deg : idx - 2) Win: listSlot5[4]
	createSlots($('#ring1'), dictTotalInfo['0']);
	createSlots($('#ring2'), dictTotalInfo['1']);
	createSlots($('#ring3'), dictTotalInfo['2']);
	createSlots($('#ring4'), dictTotalInfo['3']);
	createSlots($('#ring5'), dictTotalInfo['4']);

	// Button Start
	let clickCounter = 0;
	$('.go').click(function(){
		clickCounter++
		if (COUNT > 5){
			alert('5번 넘엇다 이기');
			clickCounter=0;
		}
		else if(clickCounter > 1){
			alert('광클 금지');
		}
		else{
			var timer = 1;
			spin(timer, dictLUTCopy);
			clickCounter=0;
		}
		
 	});
	 
	// Button Reset
	$('.goReset').click(function(){
		COUNT = 1;
		dictRoute = {};		
		dictLUTCopy = copyObjectDeep(dictLUT);
		$('#resultTable tbody td').text('');
		
	});
	
	// hook result checkbox
 	$('#toggle').click(function(){
		// console.log($('#toggle').is(':checked'));
		if ($('#toggle').is(':checked')){
			// $('#resultTable').attr('visible', 'true');
			$('#resultTable').hide();
		}
		else{
			// $('#resultTable').attr('visible', 'false');
			$('#resultTable').show();
		}
 	})

 });
