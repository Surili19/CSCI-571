const submitButton = document.getElementById('submit-button');
const clearButton = document.getElementById('clear-button');
var errorDiv= document.getElementById('error-div');

var tickerInput=document.getElementById("ticker")

var ticker=""
var companyProfile=null

// var dataFetched=false

var form = document.getElementById("stockform")

var displayTabs=false
var displayError=false


form.addEventListener('submit', preventReload)

submitButton.addEventListener("click", testfunction, false)
clearButton.addEventListener("click", clearForm)

function preventReload(event) { 
    event.preventDefault(); 
    showError(false)
} 


function showError(flag){
    if (flag){
        displayError=true
        errorDiv.style.display='inline-block'
    }
    else{
        displayError=false
        errorDiv.style.display='none'
    }
    

}
function clearForm(event){
    event.preventDefault()
    companyProfile=null
    // showTabs(false)


    showError(false);
    showTabs(false);
    tickerInput.value="";
    // displayTabs=false

    dataFetched=false;

}

/*
TODO: Functions needed:
showError(flag): display error div if no valid results found
showTabs(flag): display tabs if results found
which tab to show tho?
*/
function showTabs(flag){
    if (flag){
        document.getElementById('tabs').style.display='block'
    }
    else{
        document.getElementById('tabs').style.display='none'
    }
}

function enable(currenttabbutton, tabname) {
    var i, tabs, tablinks;
    tabs = document.getElementsByClassName("tab");
    for (i = 0; i < tabs.length; i++) {
        // if tabs[i]
      tabs[i].style.display = "none"; //deactivate all tab content
    }
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", ""); //deactivate all tab buttons
    }
    // console.log('fpun', document.getElementById(tabname))
    document.getElementById(tabname).style.display = "block";
    document.getElementById(currenttabbutton).className += " active";
  }


function testfunction(event) {
    // make api call thru flask
    // and print data

    console.log('javascript works')

    ticker= tickerInput.value.toUpperCase()
    if (ticker.length<1){
        console.log('ticker is empty')
    }
    else{

        showTabs(false)
        fetchProfile(ticker)

        console.log('in testfunction after fetchprofile')
        // console.log(dataFetched)

        // if (dataFetched==true){

            fetchQuote(ticker)
        fetchCharts(ticker)
        fetchNews(ticker)
        // }
        

        // if (fetchProfile(ticker)){
        //     showTabs(true)
        //     fetchQuote(ticker)

        //     fetchCharts(ticker)

        //     fetchNews(ticker)

        // }

        
        


    }
}




function fetchProfile(ticker) {
    callAPI("/finnAPI/profile/"+ticker, 'Company', parseProfile);
}

function fetchQuote(ticker) {
    callAPI("/finnAPI/quote/"+ticker, 'quote', parseQuote);
}


function fetchNews(ticker) {
    callAPI("/finnAPI/news/"+ticker, 'news', parseNews);
}

function fetchCharts(ticker) {
    callAPI("/finnAPI/charts/"+ticker, 'charts', parseCharts);
}


function callAPI(url, type, handler) {
    let xhr = new XMLHttpRequest();
    console.log(" URL: " + url+ 'type'+type);


    xhr.onreadystatechange = function () {
        if (xhr.readyState===4){
            if  (xhr.status===200) {
                console.log(" response received");
                
    
                // TODO: handle empty response here?
                // if data received: displayTabs=true, call handler
                
                response_json=JSON.parse(xhr.responseText)
    
                if (Object.keys(response_json).length === 0){
                    console.log("no info found"+type);
                    if (type=='Company'){
                        
                    showTabs(false)
                    showError(true)
                    dataFetched=false
                    }
                    // else{
                    //     document.getElementById(type).innerHTML="Error: no data found"

                    // }
                    // return false
                }
                else{
                    if (type=='Company'){
                        showTabs(true)
                        enable('Company-button','Company')
                    }
                    
                    console.log('data fetched')
                    console.log(type)

                    handler(response_json);

                    //TODO: currently always opens Company first
                    
                    // dataFetched=true
                    // console.log(dataFetched)
                    
                    
                    // return true
                }
            } 
        } 
        else {
            console.log("not found",xhr.readyState,xhr.status)
            console.error(xhr.statusText);
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}


// TODO:refactor a bit? move error handling to a higher up function?
function parseProfile(item){

    if (Object.keys(item).length === 0){
        console.log("no info found");

    }

    else{
    companyProfile=item

    console.log('companyprofile')
    console.log(companyProfile)

    var profilediv=document.getElementById('Company')

    // TODO: HANDLE IMAGE SEPARATE API CALL
    var profileTable="<table class='api-table'>"
    

    // TODO: maybe fetch and handle image separately?
    profileTable+="<tr><td colspan='2'><img class='company-logo' src='"+item.logo+"' alt='company-logo'/> </td></tr>"

    profileTable+="<tr><td class='table-left'>Company Name</td>"
    profileTable+="<td class='table-right'>"+item.name+"</td></tr>"

    profileTable+="<tr><td class='table-left'>Stock Ticker Symbol</td>"
    profileTable+="<td class='table-right'>"+item.ticker+"</td></tr>"
    
    profileTable+="<tr><td class='table-left'>Stock Exchange Code</td>"
    profileTable+="<td class='table-right'>"+item.exchange+"</td></tr>"

    profileTable+="<tr><td class='table-left'>Company IPO Date</td>"
    profileTable+="<td class='table-right'>"+item.ipo+"</td></tr>"

    profileTable+="<tr><td class='table-left'>Category</td>"
    profileTable+="<td class='table-right'>"+item.finnhubIndustry+"</td></tr>"

    profileTable+="</table>"

    
    profilediv.innerHTML=profileTable
}

}

function parseQuote(item){

    

    console.log('companyprofile in quote')
    console.log(companyProfile)

    console.log(item)

    var quotediv=document.getElementById('quote')

    // TODO: HANDLE IMAGE SEPARATE API CALL
    var quoteTable="<table class='api-table' id='quote-table'>"
    // quoteTable+="<tr><td colspan='2'><img src='"+item.logo+"' alt='company-logo'/> </td></tr>"

    // quoteTable+="<tr><td>Company Name</td>"
    // quoteTable+="<td>"+item.name+"</td></tr>"

    quoteTable+="<tr><td class='table-left' >Stock Ticker Symbol</td>"
    quoteTable+="<td class='table-right'>"+ticker+"</td></tr>"
    
    quoteTable+="<tr><td class='table-left' >Trading Day</td>"
    var d = new Date(item.t*1000);
    quoteTable+="<td class='table-right'>"+d.getDate()+" "+ d.toLocaleString('default', { month: 'long' })+ ", " +d.getFullYear()+"</td></tr>"

    quoteTable+="<tr><td class='table-left' >Previous Closing Price</td>"
    quoteTable+="<td class='table-right'>"+item.pc+"</td></tr>"

    quoteTable+="<tr><td class='table-left' >Opening Price</td>"
    quoteTable+="<td class='table-right'>"+item.o+"</td></tr>"

    quoteTable+="<tr><td class='table-left' >High Price</td>"
    quoteTable+="<td class='table-right'>"+item.h+"</td></tr>"

    quoteTable+="<tr><td class='table-left' >Low Price</td>"
    quoteTable+="<td class='table-right'>"+item.l+"</td></tr>"

    quoteTable+="<tr><td class='table-left' >Change</td>"
    quoteTable+="<td class='table-right arrowspan'>"+item.d
    
    if (item.d < 0){
        console.log('item d low')
        quoteTable+="<img class='arrow' alt='down_arrow' src='static/img/RedArrowDown.png'></div>"

        // quoteTable+="<div class='down'></div>"
    }
    else if (item.d>0)
    {
        console.log('item d up')
        quoteTable+="<img class='arrow' alt='up_arrow' src='static/img/GreenArrowUp.png'></div>"
    }
    
    
    
    quoteTable+="</td></tr>"
    // TODO: add arrow based on item.d<0


    quoteTable+="<tr><td class='table-left ' >Change Percent</td>"
    quoteTable+="<td class='table-right arrowspan'>"+item.dp+" "

    if (item.dp <0){
        console.log('item dp down')
        quoteTable+="<img class='arrow' alt='down_arrow' src='static/img/RedArrowDown.png'></div>"
    }
    else if (item.dp>0){
        console.log('item dp up')
        quoteTable+="<img class='arrow' alt='up_arrow' src='static/img/GreenArrowUp.png'></div>"
    }

    quoteTable+="</td></tr>"

    quoteTable+="</table>"

    
    quotediv.innerHTML=quoteTable

    callAPI("/finnAPI/recommendation/"+ticker, 'recommendation', writeRecommendations);

}

function writeRecommendations(item){
//sort by date
//pick latest

var quoteDiv=document.getElementById('quote')


var recRow=""
item.sort((a,b)=> (a.period < b.period)? 1: (a.period > b.period)?-1: 0)
console.log('sort:')
console.log(item)
console.log(item[0])

latest=item[0]

//series of squares, with specific classes


recRow+= "<table class='recommendation-container'><tr><td class='recommendation-cell' id='ssell-head'>Strong Sell</td>"
// recRow+= "<td class='recommendation-cell' id='ssell-head'>Strong Sell</td>"
recRow+="<td class='recommendation-cell' id='ssell'>"+latest.strongSell+"</td>"
recRow+="<td class='recommendation-cell' id='sell'>"+latest.sell+"</td>"

recRow+="<td class='recommendation-cell' id='hold'>"+latest.hold+"</td>"
recRow+="<td class='recommendation-cell' id='buy'>"+latest.buy+"</td>"
recRow+="<td class='recommendation-cell' id='sbuy'>"+latest.strongBuy+"</td>"
recRow+="<td class='recommendation-cell' id='sbuy-head'>Strong Buy</td></tr>"
recRow+="<tr><td id='recom-trends' colspan=7 style='text-align:center;    '>Recommendation Trends</td></tr></table>"


// console.log(recRow)

recDiv=document.createElement('div')
recDiv.innerHTML=recRow

quoteDiv.appendChild(recDiv)
// rec.className='recommendation-container'
// rec.innerHTML=recRow
}

function parseNews(items){
    var newsDiv=document.getElementById('news')
    console.log('len')
    console.log(items.length)
    

    
        // showNews("off");
        // let newsArray = item["latest_news"];
        var news = "";
        
        
        // console.log("news number: " + newsNum);
        for ( let i = 0; i < items.length; i++) {
            var d= new Date(items[i]['datetime']*1000)

            

            news+="<div class='news-container'>";
            news+="<div class='center-crop-img'><img class='news-thumb' alt='urlImage' src='" + items[i]["image"] + "'/></div>";
            news+="<div class='news-text'><p><b>" + items[i]["headline"] + "</b></p>";
            news+="<p>"+d.getDate()+" "+d.toLocaleString('default', { month: 'long' })+ ", " +d.getFullYear()+"</p>";
            news+="<p><a href='" + items[i]["url"] + "' target='_blank'>See Original Post</a></p>";
            news+="</div></div>";
        }
        newsDiv.innerHTML = news;   
}

function parseCharts(items){
    // var chartsDiv=document.getElementById('charts')
    // console.log('len')
    // console.log(items.length)
    
    // var time=items['time']
    var close=items['close']
    var volume=items['volume']
    var datestr=items['date']
    
    // var d=new Date()
    // var datestr= d.getFullYear()+"-"+("0" + (d.getMonth() + 1)).slice(-2)+ "-"+d.getDate()
    
    console.log(close)

    Highcharts.stockChart('charts', {
        
        title: {text: 'Stock Price ' + ticker + ' ' + datestr},

        subtitle: {
            text: '<a href="https://finnhub.io/" target="_blank">Source: FinnHub</a>',
            useHTML: true
        },

        stockTools: {
            gui: {
                enabled: false // disable the built-in toolbar
            }
        },

        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%e %b}'
            }
        },

        yAxis: [{
            title: {text: 'Volume'},
            labels: {align: 'left'}, // align text of label from left side
            min: 0,
            // offset: 1  // move Volume yAxis out of plot area, need to be dismissed with label align left
        }, {
            title: {text: 'Stock Price'},
            opposite: false,
            min: 0,
        }],

        plotOptions: {
            column: {
                pointWidth: 3,
                color: '#404040'
            }
        },

        rangeSelector: {
            buttons: [{
                type: 'day',
                count: 7,
                text: '7d'
            }, {
                type: 'day',
                count: 15,
                text: '15d'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'month',
                count: 3,
                text: '3m'
            }, {
                type: 'month',
                count: 6,
                text: '6m'
            }],
            selected: 0,
            inputEnabled: false
        },

        series: [{
            type: 'area',
            name: "Stock Price",
            data: close,
            yAxis: 1,
            showInNavigator: true,
            // gapSize: 5,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
        },
            {
                type: 'column',
                name: 'Volume',
                data: volume,
                yAxis: 0,
                showInNavigator: false,
            }]


    });



        // showNews("off");
        // let newsArray = item["latest_news"];
        // let latestNews = "";
        // let newsNum = items.length;
        // let i;
        // console.log("news number: " + newsNum);
        // for (i = 0; i < newsNum; i++) {
        //     latestNews += "<div class=\'news-box\'><div class=\'center-crop-img\'>";
        //     latestNews += "<img class=\'news-img\' alt=\'urlImage\' src=\'" + items[i]["image"] + "\'/></div>";
        //     latestNews += "<div class=\'news-text\'><p><b>" + items[i]["headline"] + "</b></p>";
        //     latestNews += "<p>Published Date: <span>" + items[i]["datetime"] + "</span></p>";
        //     latestNews += "<p><a href=\'" + items[i]["url"] + "\' target=\"_blank\">See Original Post</a></p>";
        //     latestNews += "</div></div>";
        // }
        // newsDiv.innerHTML = latestNews;   
}
