// npm install cheerio


var fs = require('fs');
var cheerio = require('cheerio');

//my GLOBAL array
var p_Meetings = [];

// for loop to loop over the data files
for(let i = 1; i<11; i++) {
        // load the cheerio object into a variable, `content`
        // which holds data and metadata about the html file (written as txt)
    var content = fs.readFileSync(`data/m${i.toString().padStart(2,0)}.txt`);   
   // load `content` into a cheerio object
    var $ = cheerio.load(content); 


    $('tr').each(function(i, elem) {
        if ($(elem).attr("style")=="margin-bottom:10px") {
            console.log($(elem).html());
           console.log('*************')
           //parseAa refers to the function I wrote for the parsing down below
           //each time the loop occurs the resulted parsed data gets pushed into the global array
           //avoiding the issue of side effects - which would occur if my push was in the function.
           p_Meetings.push(parseAa($(elem).html()))
            //var thisMeeting = {}; // Your function and data collection go here! 
       }
    });
}
//writes a file for me to save my data! and instead of making it a text file, I changed it to make it a proper JSON file!
fs.writeFileSync('/home/ec2-user/environment/data/final.json', JSON.stringify(p_Meetings));


//functions that are referred to in the for loop are outside the for loop itself 
function parseAa (r_meeting){
    
  const p_meetingName= r_meeting.split('</b><br>')[0].split('<b>')[1].split('-')[0].trim();
  const p_locationName= r_meeting.split('">')[2].split('</h4>')[0];
  const p_locationAddress= r_meeting.split('</b>')[1].split('</b><br />\t\t\t\t\t\t')[0].split('\n\t\t\t\t\t\t')[1].trim();
  const p_zipCode= r_meeting.match(/(\d{5})/g);
  const p_wheelChair= r_meeting.includes('Wheelchair Access');
  const r_meetingTimes= r_meeting.split('\t\t\t\t  \t    <b>').slice(2);
  const p_meetingTimes=[];
  
  let meetingDetails=''
  
  if (r_meeting.includes('detailsBox')) {
    meetingDetails= r_meeting.split('detailsBox">')[1].split('\t')[1].split('</div>')[0].replaceAll('<br>','').replaceAll('&amp;','&').trim()
  }
  
  r_meetingTimes.forEach(function(item){
    const items= item.split(' ');

    p_meetingTimes.push({
      day:items[0],
      startTime:items[3]+' '+items[4],
      endTime: items[6]+' '+items[7],
      type: items[10]})  
  });
  
  return {
    name:p_meetingName,
    location:{name:p_locationName,address:p_locationAddress,meetingDetails:meetingDetails,zip:p_zipCode,adaAccessible:p_wheelChair},
    times:p_meetingTimes
  };
};

console.log(JSON.stringify(p_Meetings))
