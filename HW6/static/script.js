const submitButton = document.getElementById('submit-button');
const clearButton = document.getElementById('clear-button');
var errorDiv= document.getElementById('error-div');

var tickerInput=document.getElementById("ticker")

var ticker=""

var currentTab="Company"


var stockname = document.getElementById("stockform")


stockname.addEventListener('submit', preventReload)

submitButton.addEventListener("click", test)
clearButton.addEventListener("click", clear)

function preventReload(event) { 
    event.preventDefault(); 
    Err(false)
} 


function Err(flag){
    if (flag){
        errorDiv.style.display='inline-block'
    }
    else{
        errorDiv.style.display='none'
    }
    

}
function clear(event){
    event.preventDefault()

    Err(false);
    Tabs(false);
    tickerInput.value="";
    dataFetched=false;

}


function Tabs(flag){
    if (flag){
        document.getElementById('tabs').style.display='block'
    }
    else{
        document.getElementById('tabs').style.display='none'
    }
}

function enable(currbutton, tabnm) {
    console.log(currbutton)
    var i, tabs, links;
    tabs = document.getElementsByClassName("tab");
    for (i = 0; i < tabs.length; i++) {
    
      tabs[i].style.display = "none";
    }
    links = document.getElementsByClassName("tab-button");
    for (i = 0; i < links.length; i++) {
      links[i].className = links[i].className.replace(" active", ""); 
    }
    
    document.getElementById(tabnm).style.display = "block";
    document.getElementById(currbutton).className += " active";
    currentTab=tabnm
  }


function test(event) {
    ticker= tickerInput.value.toUpperCase()
    if (ticker.length<1){
        console.log('ticker is empty')
    }
    else{

        Tabs(false)

        APICalls("/finnAPI/Company/ticker="+ticker, 'Company', Company);
        APICalls("/finnAPI/Summary/ticker="+ticker, 'Summary', Quote);
          
        APICalls("/finnAPI/Charts/ticker="+ticker, 'Charts', Charts);
        APICalls("/finnAPI/News/ticker="+ticker, 'News', News);      
        

    }
}

function APICalls(url, type, handler) {
    let xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.onreadystatechange = function () {
        if (xmlHttpReq.readyState===4){
            if  (xmlHttpReq.status===200) {
                
                response_json=JSON.parse(xmlHttpReq.responseText)
    
                if (Object.keys(response_json).length === 0){
                    console.log("no info found"+type);
                    if (type=='Company'){
                        
                    Tabs(false)
                    Err(true)
                    dataFetched=false
                    }
                }
                else{
                    if (type=='Company'){
                        Tabs(true)
                        
                        enable(currentTab+'-button',currentTab)
                        
                    }
                    handler(response_json);                    
                }
            } 
            else {
                console.log("not found",xmlHttpReq.readyState,xmlHttpReq.status)
                console.error(xmlHttpReq.statusText);
            }
        } 
        
    };
    xmlHttpReq.open("GET", url, true);
    xmlHttpReq.send();
}



function Company(item){

    if (Object.keys(item).length === 0){
        console.log("no info found");
    }

    else{   

    var Companydiv=document.getElementById('Company')

    
    var CompanyTable="<table class='api-table'>"
    
    CompanyTable+="<tr><td colspan='2'><img class='company-logo'style='padding-left: 150px' src='"+item.logo+"' alt='company-logo'/> </td></tr>"
    CompanyTable+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    CompanyTable+="<tr><td class='table-left'><b>Company Name</b></td>"
    CompanyTable+="<td class='table-right'>"+item.name+"</td></tr>"
    CompanyTable+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    CompanyTable+="<tr><td class='table-left'><b>Stock Ticker Symbol</b></td>"
    CompanyTable+="<td class='table-right'>"+item.ticker+"</td></tr>"
    CompanyTable+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    CompanyTable+="<tr><td class='table-left'><b>Stock Exchange Code</b></td>"
    CompanyTable+="<td class='table-right'>"+item.exchange+"</td></tr>"
    CompanyTable+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    CompanyTable+="<tr><td class='table-left'><b>Company IPO Date</b></td>"
    CompanyTable+="<td class='table-right'>"+item.ipo+"</td></tr>"
    CompanyTable+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    CompanyTable+="<tr><td class='table-left'><b>Category</b></td>"
    CompanyTable+="<td class='table-right'>"+item.finnhubIndustry+"</td></tr>"
    CompanyTable+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    CompanyTable+="</table>"

    
    Companydiv.innerHTML=CompanyTable
}

}

function Quote(item){

    var Tablediv=document.getElementById('Summary')

    var Table="<table class='api-table' id='quote-table'>"

    Table+="<tr><td class='table-left' ><b>Stock Ticker Symbol</b></td>"
    Table+="<td class='table-right'>"+ticker+"</td></tr>"
    Table+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    Table+="<tr><td class='table-left' ><b>Trading Day</b></td>"
    var d = new Date(item.t*1000);
    Table+="<td class='table-right'>"+d.getDate()+" "+ d.toLocaleString('default', { month: 'long' })+ ", " +d.getFullYear()+"</td></tr>"
    Table+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    Table+="<tr><td class='table-left' ><b>Previous Closing Price</b></td>"
    Table+="<td class='table-right'>"+item.pc+"</td></tr>"
    Table+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    Table+="<tr><td class='table-left' ><b>Opening Price</b></td>"
    Table+="<td class='table-right'>"+item.o+"</td></tr>"
    Table+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    Table+="<tr><td class='table-left' ><b>High Price</b></td>"
    Table+="<td class='table-right'>"+item.h+"</td></tr>"
    Table+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    Table+="<tr><td class='table-left' ><b>Low Price</b></td>"
    Table+="<td class='table-right'>"+item.l+"</td></tr>"
    Table+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    Table+="<tr><td class='table-left' ><b>Change</b></td>"
    Table+="<td class='table-right arrowspan'>"+item.d+" &ensp;"
    
    if (item.d < 0){
        Table+="<div class='down'></div>"

    }
    else if (item.d>0)
    {
        Table+="<div class='up'></div>"

    }
    
    Table+="</td></tr>"
    Table+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    Table+="<tr><td class='table-left ' ><b>Change Percent</b></td>"
    Table+="<td class='table-right arrowspan'>"+item.dp+"&ensp; "

    if (item.dp <0){
        Table+="<div class='down'></div>"

    }
    else if (item.dp>0){
        Table+="<div class='up'></div>"
    }

    Table+="</td></tr>"
    Table+="<tr><td colspan='2'><hr style='margin-top:1px;margin-bottom:1px;border-top: 0.5px solid rgb(242,241,241);'></td></tr>"
    Table+="</table>"

    
    Tablediv.innerHTML=Table

    APICalls("/finnAPI/Recommendation/ticker="+ticker, 'recommendation', Recommendations);

}

function Recommendations(item){

var Tablediv=document.getElementById('Summary')


var Recomm=""
item.sort((a,b)=> (a.period < b.period)? 1: (a.period > b.period)?-1: 0)
latest=item[0]

Recomm+= "<table class='recomm-container'><tr><td class='recomm-cell' id='strongsell-head'>Strong Sell</td>"
Recomm+="<td class='recomm-cell' id='strongsell'>"+latest.strongSell+"</td>"
Recomm+="<td class='recomm-cell' id='sell'>"+latest.sell+"</td>"

Recomm+="<td class='recomm-cell' id='hold'>"+latest.hold+"</td>"
Recomm+="<td class='recomm-cell' id='buy'>"+latest.buy+"</td>"
Recomm+="<td class='recomm-cell' id='strongbuy'>"+latest.strongBuy+"</td>"
Recomm+="<td class='recomm-cell' id='strongbuy-head'>Strong Buy</td></tr>"
Recomm+="<tr><td id='recom-trends' colspan=7 style='text-align:center; font-size: 20px; color:#585252;'>Recommendation Trends</td></tr></table>"

recDiv=document.createElement('div')
recDiv.innerHTML=Recomm

Tablediv.appendChild(recDiv)

}

function News(items){
    var ltNewsdiv=document.getElementById('News')
    console.log('len')
    console.log(items.length)
        let ltNews = "";
        let newsNum = items.length;
        let i;
        console.log("news number: " + newsNum);
        for (i = 0; i < newsNum; i++) {
            var d= new Date(items[i]['datetime']*1000)
            ltNews += "<div class=\'news-box\'><div class=\'image\'>";
            ltNews += "<img class=\'news-image\' alt=\'urlImage\' src=\'" + items[i]["image"] + "\'/></div>";
            ltNews += "<div class=\'news-text\'><p><strong>" + items[i]["headline"] + "</strong></p>";
            ltNews+="<p>"+d.getDate()+" "+d.toLocaleString('default', { month: 'long' })+ ", " +d.getFullYear()+"</p>";
            ltNews += "<p><a href=\'" + items[i]["url"] + "\' target=\"_blank\">See Original Post</a></p>";
            ltNews += "</div></div>";
        }
        ltNewsdiv.innerHTML = ltNews;  
         
}

function Charts(items){

    var chartsDiv=document.getElementById('Charts')
    var time=items['date']
    var close=items['close']
    var volume=items['volume']

    console.log(close)

    Highcharts.stockChart('Charts', {
        stockTools: {
            gui: {
                enabled: false 
            }
        },

        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%e. %b}'
            }
        },

        yAxis: [{
            title: {text: 'Volume'},
            labels: {align: 'left'}, 
            min: 0,
        }, {
            title: {text: 'Stock Price'},
            opposite: false,
            min: 0,
        }],

        plotOptions: {
            column: {
                pointWidth: 2,
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
            selected: 4,
            inputEnabled: false
        },

        title: {text: 'Stock Price ' + ticker + ' ' + time},

        subtitle: {
            text: '<a href="https://finnhub.io/" target="_blank">Source: FinnHub</a>',
            useHTML: true
        },

        series: [{
            type: 'area',
            name: ticker,
            data: close,
            yAxis: 1,
            showInNavigator: true,
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
                name: ticker + ' Volume',
                data: volume,
                yAxis: 0,
                showInNavigator: false,
            }]


    });

}




