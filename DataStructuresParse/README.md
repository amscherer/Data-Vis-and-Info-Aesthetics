// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the cheerio object into a variable, `content`
// which holds data and metadata about the html file (written as txt)
var content = fs.readFileSync('data/m01.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

var r_meetings=[];
var p_Meetings = [];


$('tr').each(function(i, elem) {
    if ($(elem).attr("style")=="margin-bottom:10px") {
        console.log($(elem).html());
       console.log('*************')
       parseAa($(elem).html())
        var thisMeeting = {}; // Your function and data collection go here! 
    }
});

function helper(rawData){
  const r_meeting= rawData.split('tr style="margin-bottom:10px"').slice(1,22);
   r_meeting.push[0]
};
function parseAa (r_meeting){
      //console.log(r_meeting)
  const p_meetingName= r_meeting.split('</b><br>')[0].split('<b>')[1].split('-')[0];
  const p_locationName= r_meeting.split('">')[2].split('</h4>')[0];
  const p_locationAddress= r_meeting.split('</b>')[1].split('</b><br />\t\t\t\t\t\t')[0].split('\n\t\t\t\t\t\t')[1];
  //const p_addressNotes= r_meeting.split('</div>')[0].split('"detailsBox">')[1]
  const p_zipCode= r_meeting.match(/(\d{5})/g);
  const p_wheelChair= r_meeting.includes('Wheelchair Access');
  const r_meetingTimes= r_meeting.split('\t\t\t\t  \t    <b>').slice(2);
  const p_meetingTimes=[]
  
  r_meetingTimes.forEach(function(item){
    const items= item.split(' ');

    p_meetingTimes.push({
      day:items[0],
      startTime:items[3]+' '+items[4],
      endTime: items[6]+' '+items[7],
      type: items[10]})  
  });
  //console.log(p_meetingTimes)
  p_Meetings.push({
    name:p_meetingName,
    location:{name:p_locationName,address:p_locationAddress,zip:p_zipCode,adaAccessible:p_wheelChair},
    times:p_meetingTimes
  });
};
console.log(p_Meetings)
//console.log(JSON.stringify(p_Meetings))
