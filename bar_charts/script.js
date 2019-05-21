'use strict';

const barChart = document.getElementById("bars-list");
const axisX = document.getElementById("x-axis");
const axisY = document.getElementById("y-axis");

var str = "5,8,2,1,15,2,3,5,9,11,10,4,3,14,1,7,10,3,2,13";
var arr = str.split(",");

const multiplier = 20;

const barClass = "value-item";
const xItemClass = "x-item";
const yItemClass = "y-item";



const createBar = ( value ) => {
    let li = document.createElement('li');
    const red = "#F00";
    const green = "#0F0";
    const yellow = "#FF0";
    let color = red;

    if ( value <= 5 ) {
        color = green;
    } else if  ( value <= 10 ) {
        color = yellow;
    }

    li.classList.add( barClass );
    li.style.height = `${value * multiplier}px`;
    li.style.backgroundColor = color;

    return li;
};

const addItemX = ( parent, index ) => {
    var li = document.createElement('li');
    li.classList.add( xItemClass );
    li.innerHTML = index;
    parent.appendChild( li );
};

const createYAxis = ( parent, arr ) => {
    const maxValue = Math.max.apply(null, arr);
    for ( let index = 1; index <= maxValue; index++ ) {
        var li = document.createElement( 'li' );
        li.classList.add( yItemClass );
        li.style.height = `${multiplier}px`;
        li.innerHTML = index;
        parent.appendChild( li );
    }; 
};

const renderChart = ( parent, arr ) => {
    arr.forEach( ( item, i ) => {
        let elem = createBar( item );
        addItemX( axisX, i );
        parent.appendChild( elem );
    });

    createYAxis( axisY, arr );
};

renderChart( barChart, arr );
